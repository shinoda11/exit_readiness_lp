/**
 * Webhook冪等性テストスクリプト
 * 
 * このスクリプトは、Stripe Webhookの冪等性を検証するために、
 * 同一checkout.session.idでの二重送信を模擬します。
 */

import { getDb } from '../db';
import { passSubscriptions } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// テスト用のcheckout.session.completedイベントを生成
function createMockCheckoutSession(sessionId, email) {
  return {
    id: `evt_test_${Date.now()}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        customer_email: email,
        payment_intent: `pi_test_${Date.now()}`,
        amount_total: 2980000, // 29,800円
        currency: 'jpy',
        payment_status: 'paid',
      },
    },
  };
}

// Webhook処理を模擬（server/webhooks/stripe.tsのロジックを再現）
async function processCheckoutSessionCompleted(session) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const sessionId = session.data.object.id;
  const email = session.data.object.customer_email;
  const paymentIntentId = session.data.object.payment_intent;

  console.log(`[Webhook] Processing session: ${sessionId}`);

  // 冪等性チェック: 既に処理済みか確認
  const existing = await db
    .select()
    .from(passSubscriptions)
    .where(eq(passSubscriptions.stripeSessionId, sessionId))
    .limit(1);

  if (existing.length > 0) {
    console.log(`[Webhook] Session ${sessionId} already processed. Skipping.`);
    return { status: 'skipped', reason: 'already_processed' };
  }

  // ログイン情報を生成
  const loginId = `user_${crypto.randomBytes(4).toString('hex')}`;
  const loginPassword = crypto.randomBytes(8).toString('hex');

  // Pass購入情報を保存
  await db.insert(passSubscriptions).values({
    email,
    loginId,
    loginPassword,
    stripeSessionId: sessionId,
    stripePaymentIntentId: paymentIntentId,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90日後
    price: 29800,
  });

  console.log(`[Webhook] Created Pass subscription for ${email}`);
  return { status: 'created', loginId, loginPassword };
}

// テストケース1: 同一イベントの二重送信
async function testCase1() {
  console.log('\n=== Test Case 1: 同一イベントの二重送信 ===');
  const sessionId = `cs_test_${Date.now()}_case1`;
  const email = 'test_case1@example.com';

  const event = createMockCheckoutSession(sessionId, email);

  // 1回目の送信
  console.log('1回目の送信...');
  const result1 = await processCheckoutSessionCompleted(event);
  console.log('結果:', result1);

  // 2回目の送信（同一イベント）
  console.log('2回目の送信（同一イベント）...');
  const result2 = await processCheckoutSessionCompleted(event);
  console.log('結果:', result2);

  // 検証: DBに1件のみ存在するか
  const db = await getDb();
  const records = await db
    .select()
    .from(passSubscriptions)
    .where(eq(passSubscriptions.stripeSessionId, sessionId));

  const passed = records.length === 1 && result2.status === 'skipped';
  console.log(`\n✅ テスト結果: ${passed ? 'PASS' : 'FAIL'}`);
  console.log(`   - DB件数: ${records.length} (期待: 1)`);
  console.log(`   - 2回目の結果: ${result2.status} (期待: skipped)`);

  // クリーンアップ
  await db.delete(passSubscriptions).where(eq(passSubscriptions.stripeSessionId, sessionId));

  return {
    testCase: 'Test Case 1: 同一イベントの二重送信',
    passed,
    details: {
      sessionId,
      firstResult: result1.status,
      secondResult: result2.status,
      dbRecordCount: records.length,
    },
  };
}

// テストケース2: 異なるイベントIDだが同一session.id
async function testCase2() {
  console.log('\n=== Test Case 2: 異なるイベントIDだが同一session.id ===');
  const sessionId = `cs_test_${Date.now()}_case2`;
  const email = 'test_case2@example.com';

  // 1回目の送信
  const event1 = createMockCheckoutSession(sessionId, email);
  console.log('1回目の送信...');
  const result1 = await processCheckoutSessionCompleted(event1);
  console.log('結果:', result1);

  // 2回目の送信（異なるイベントIDだが同一session.id）
  await new Promise(resolve => setTimeout(resolve, 100)); // 少し待つ
  const event2 = createMockCheckoutSession(sessionId, email);
  console.log('2回目の送信（異なるイベントIDだが同一session.id）...');
  const result2 = await processCheckoutSessionCompleted(event2);
  console.log('結果:', result2);

  // 検証: DBに1件のみ存在するか
  const db = await getDb();
  const records = await db
    .select()
    .from(passSubscriptions)
    .where(eq(passSubscriptions.stripeSessionId, sessionId));

  const passed = records.length === 1 && result2.status === 'skipped';
  console.log(`\n✅ テスト結果: ${passed ? 'PASS' : 'FAIL'}`);
  console.log(`   - DB件数: ${records.length} (期待: 1)`);
  console.log(`   - 2回目の結果: ${result2.status} (期待: skipped)`);

  // クリーンアップ
  await db.delete(passSubscriptions).where(eq(passSubscriptions.stripeSessionId, sessionId));

  return {
    testCase: 'Test Case 2: 異なるイベントIDだが同一session.id',
    passed,
    details: {
      sessionId,
      firstResult: result1.status,
      secondResult: result2.status,
      dbRecordCount: records.length,
    },
  };
}

// テストケース3: UNIQUE制約違反のエラーハンドリング
async function testCase3() {
  console.log('\n=== Test Case 3: UNIQUE制約違反のエラーハンドリング ===');
  const sessionId = `cs_test_${Date.now()}_case3`;
  const email = 'test_case3@example.com';

  // 1回目の送信
  const event = createMockCheckoutSession(sessionId, email);
  console.log('1回目の送信...');
  const result1 = await processCheckoutSessionCompleted(event);
  console.log('結果:', result1);

  // 2回目の送信を強制的に実行（冪等性チェックをバイパス）
  console.log('2回目の送信（UNIQUE制約違反を試行）...');
  const db = await getDb();
  let errorCaught = false;
  try {
    await db.insert(passSubscriptions).values({
      email,
      loginId: `user_${crypto.randomBytes(4).toString('hex')}`,
      loginPassword: crypto.randomBytes(8).toString('hex'),
      stripeSessionId: sessionId, // 同じsessionId
      stripePaymentIntentId: `pi_test_${Date.now()}`,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      price: 29800,
    });
  } catch (error) {
    errorCaught = true;
    console.log('エラーキャッチ:', error.message);
  }

  const passed = errorCaught;
  console.log(`\n✅ テスト結果: ${passed ? 'PASS' : 'FAIL'}`);
  console.log(`   - UNIQUE制約違反エラー: ${errorCaught ? 'キャッチされた' : 'キャッチされなかった'}`);

  // クリーンアップ
  await db.delete(passSubscriptions).where(eq(passSubscriptions.stripeSessionId, sessionId));

  return {
    testCase: 'Test Case 3: UNIQUE制約違反のエラーハンドリング',
    passed,
    details: {
      sessionId,
      uniqueConstraintErrorCaught: errorCaught,
    },
  };
}

// すべてのテストを実行
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('Webhook冪等性テスト開始');
  console.log('='.repeat(60));

  const results = [];

  try {
    results.push(await testCase1());
    results.push(await testCase2());
    results.push(await testCase3());
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('テスト結果サマリー');
  console.log('='.repeat(60));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.testCase}`);
    console.log(`   結果: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   詳細:`, JSON.stringify(result.details, null, 2));
  });

  const allPassed = results.every(r => r.passed);
  console.log(`\n総合結果: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  // Notion貼り付け用のMarkdownを生成
  const markdown = generateNotionMarkdown(results);
  console.log('\n' + '='.repeat(60));
  console.log('Notion貼り付け用Markdown');
  console.log('='.repeat(60));
  console.log(markdown);

  return results;
}

// Notion貼り付け用のMarkdownを生成
function generateNotionMarkdown(results) {
  const timestamp = new Date().toISOString();
  let markdown = `# Webhook冪等性テスト結果\n\n`;
  markdown += `**実施日時**: ${timestamp}\n\n`;
  markdown += `**テスト環境**: Development\n\n`;
  markdown += `**テスト対象**: Stripe Webhook \`checkout.session.completed\`\n\n`;
  markdown += `---\n\n`;

  results.forEach((result, index) => {
    markdown += `## ${index + 1}. ${result.testCase}\n\n`;
    markdown += `**結果**: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n\n`;
    markdown += `**詳細**:\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n\n`;
    markdown += `---\n\n`;
  });

  const allPassed = results.every(r => r.passed);
  markdown += `## 総合結果\n\n`;
  markdown += `${allPassed ? '✅ **ALL TESTS PASSED**' : '❌ **SOME TESTS FAILED**'}\n\n`;
  markdown += `**合格基準**:\n\n`;
  markdown += `- 同一 \`checkout.session.id\` が複数回届いても、アカウント発行が1回で終わる\n`;
  markdown += `- UNIQUE制約違反エラーが正しくキャッチされる\n`;
  markdown += `- 冪等性チェックで既処理イベントがスキップされる\n`;

  return markdown;
}

// テスト実行
runAllTests()
  .then(() => {
    console.log('\nテスト完了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('テスト失敗:', error);
    process.exit(1);
  });
