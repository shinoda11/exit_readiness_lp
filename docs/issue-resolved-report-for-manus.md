# ISSUE RESOLVED: React App Not Rendering in Preview

**Status**: ✅ RESOLVED  
**Date**: 2025-12-20  
**Project ID**: H52KkKEEAVnpGKGv4nGFA9  
**Project Name**: exit_readiness_lp

---

## Summary

The issue where the React app was not rendering in Manus preview (white screen) has been **resolved**. The root cause was a `ReferenceError: process is not defined` error in `shared/const.ts`.

---

## Root Cause

In `shared/const.ts` line 16, the code directly referenced `process.env`:

```typescript
// ❌ This caused ReferenceError in browser
export const FRIEND_INVITE_ENABLED = process.env.FRIEND_INVITE_ENABLED === 'true';
```

**Problem**: `process` is a Node.js global object and does not exist in browser environments. When Vite bundled this code for the client, it caused a `ReferenceError` that prevented React from mounting.

---

## Solution

Added a type check to make the code compatible with both browser and server environments:

```typescript
// ✅ Works in both browser and Node.js
export const FRIEND_INVITE_ENABLED = 
  typeof process !== 'undefined' && process.env?.FRIEND_INVITE_ENABLED === 'true';
```

---

## Error Details

**Error Message**:
```
Uncaught ReferenceError: process is not defined
    at https://3000-i3n8krpk8wqxh454z3om1-37ba6fd8.manus-asia.computer/@fs/home/ubuntu/exit_readiness_lp/shared/const.ts:6:38
```

**Page**: `/?from_webdev=1`  
**Time**: 2025-12-20T07:22:58.956Z (Asia/Tokyo)

---

## Impact

- ✅ Preview now renders correctly
- ✅ React app mounts successfully
- ✅ All pages display as expected
- ✅ No console errors

---

## Lessons Learned

### For Manus Platform

1. **Improve Error Visibility**: The error was hidden and not visible in the initial console view. Consider:
   - Showing JavaScript errors more prominently in preview
   - Adding a "Debug Mode" toggle to show all console errors
   - Displaying a warning banner when JavaScript errors prevent rendering

2. **Template Improvement**: The `shared/` directory in web-db-user templates should avoid using `process.env` directly. Consider:
   - Using Vite's `import.meta.env` for client-side environment variables
   - Adding a helper function to safely access environment variables
   - Documenting the difference between server-side and client-side env access

3. **Better Documentation**: Add a warning in template README about:
   - `process` is only available in Node.js (server-side)
   - `import.meta.env` should be used for client-side env vars
   - `shared/` code must be compatible with both environments

### For Developers

1. **Always check browser console**: Even if the page appears blank, check the console for errors
2. **Be careful with `shared/` code**: Code in `shared/` directories is used by both server and client, so avoid Node.js-specific globals
3. **Use proper environment variable access**:
   - Server-side: `process.env.VAR_NAME`
   - Client-side (Vite): `import.meta.env.VITE_VAR_NAME`
   - Shared code: Add type checks like `typeof process !== 'undefined'`

---

## Recommendation for Manus Engineering

Consider adding a linting rule or build-time check to detect direct `process.env` usage in `shared/` or `client/` directories. This would catch this type of error before deployment.

Example ESLint rule:
```json
{
  "rules": {
    "no-restricted-globals": [
      "error",
      {
        "name": "process",
        "message": "Use 'import.meta.env' for client-side code or add 'typeof process !== \"undefined\"' check for shared code"
      }
    ]
  },
  "overrides": [
    {
      "files": ["client/**/*", "shared/**/*"],
      "rules": {
        "no-restricted-globals": ["error", "process"]
      }
    }
  ]
}
```

---

## Thank You

Thank you for providing the Manus platform. The issue was on our side (user code), but improving error visibility would help developers debug faster in the future.

---

## Contact

- **Project ID**: H52KkKEEAVnpGKGv4nGFA9
- **Resolved Version**: 22eb8745
- **Preview URL**: https://3000-i3n8krpk8wqxh454z3om1-37ba6fd8.manus-asia.computer/

Feel free to close any related support tickets.
