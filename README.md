# CFA Analytics Workspace

## Open the app

Open `index.html` in a modern browser. No BAT file, Node.js, local web server, CDN, or install step is required. All analysis, charts, and manual statement entry work offline. The optional TradingView snapshot makes a direct internet request from the browser only after you select **Load quote**. It uses an unofficial community screener, may be delayed, and does not retrieve financial statements. Verify market data independently.

## CFA-style fundamental analysis

Enter monetary inputs in a consistent currency and scale. Enter share count in the same scale as financial statement amounts (for example, millions of shares with financials reported in millions); enter market price per actual share. Enter annual income statement and cash flow values for the same reporting period. Opening and closing balances are used where averages are required for return and turnover analysis. Missing inputs and undefined ratios are reported as not available. The chart selector keeps metrics with different units on separate charts. Each metric has expandable CFA-style interpretation and caveats.

### Multi-company comparison

In **Company Financials & Peer Comparison**, **Start from attached Codal report metadata** pre-fills the supplied filing's company identity, IRR currency, million-Rial scale, FY1404 period label, 12-month duration, consolidated scope, and audited/unmodified status. It does not import statement amounts; enter those from the PDF, then save. For other companies, set the same report metadata manually. These attributes persist in backups and are shown in the peer table; missing or mixed report bases are flagged. Legacy backups remain importable and appear as metadata-incomplete until updated.

Flow metrics and valuation multiples in peer history are annualized to a 12-month equivalent from each period's saved length. Balance-sheet values and period-end share prices are not annualized. Total return uses the entered period dividend and price change. Set period length accurately, and treat forecast periods, audit status, consolidation scope, restatements, and differing year ends as comparability checks rather than interchangeable observations. The supplied Codal report presents 12-month audited statements alongside management forecast tables; forecast status should remain visible even where the period lengths match. Select a fiscal label and metric family to compare companies; choose a metric to chart trends. Period changes compare each company with its prior saved period. Data stays in this browser's local storage. Use **Export backup** regularly; **Import backup** replaces the company records in the current browser.

All statements remain manually entered; the workspace does not extract figures from PDF reports. Period labels must match exactly to appear side by side. No FX, scale, accounting-policy, or fiscal-year normalization is automatic. For currency-based peer statistics and trend charts, currency and scale must match. Validate accounting comparability and review each metric's guidance before drawing conclusions.

### Enhanced analyst tools

- **ROIC and DuPont:** ROIC follows the CFA ratio-list form: NOPAT divided by average interest-bearing debt plus average equity. Enter an effective tax rate and opening/closing debt and equity. Other invested-capital definitions may differ. DuPont ROE is decomposed into net margin, asset turnover, and equity multiplier.
- **Debt and cash quality:** D/E uses interest-bearing debt; total-liabilities/equity is shown separately. Short- and long-term interest-bearing debt can be reconciled to total debt. Accruals/assets, CFO/net income, FCF margin, and CFO/CapEx supplement the core ratios.
- **CapEx:** Enter reported CapEx as a positive cash-spend amount (negative statement outflows are normalized). When omitted, CapEx is estimated from fixed-asset movement plus depreciation; acquisitions, disposals, FX, and revaluations can make this estimate unreliable.
- **Statement diagnostics:** balance-sheet equation, debt-mix reconciliation, cash conversion, payout, missing opening balances, tax input, and CapEx source are surfaced as review flags. Threshold checks are heuristics, not audit opinions or credit ratings.
- **Scenario DCF:** editable bear/base/bull growth and EBIT-margin assumptions feed a driver-based FCFF forecast: NOPAT + D&A − CapEx − change in NWC. CapEx/sales, D&A/sales, and NWC/sales can be overridden; blank operating-driver values are derived from available statements (NWC initially uses current assets less current liabilities, a broad proxy that can include cash and financing items). WACC can be entered manually or estimated from CAPM using market equity and reported interest-bearing debt as capital weights (debt market value, leases, preferred equity, and minority interests are not modeled). A 5×5 base-case WACC/terminal-growth per-share sensitivity and forecast FCFF chart are included. Check terminal-value concentration and assumptions; the output is not a target price.
- **Analyst dashboard:** brings together ROIC/WACC spread when periods are comparable, DuPont drivers, CFO/net-income conversion, net debt/EBITDA, and prioritized statement-review prompts. Rule-based signals are diagnostics, not a security rating or investment advice.
- **Period presentation and record history:** the single-company calculator can show flow items annualized linearly or as reported; short-period annualization is flagged because it may conceal seasonality. Saved company periods record their save timestamp alongside the source document/page and audit basis.
- **Bulk import:** the local CSV/XLSX importer expects one row per company-period-field. Required headers are `company, period, field, value`; **Download template** provides the exact header row. Use app field IDs such as `net-income`, `operating-cash-flow`, or `reported-capex`. Preview and validate before applying; matching company/currency/period records merge and duplicate field values are replaced.
- **Peer lens and provenance:** set an industry/peer group to filter comparisons and trends. Q1/median/Q3 require at least four observations with comparable report basis, currency, and scale. Store source document/page and mark restated comparative data.

PDF figures are not automatically parsed. Record source page references and verify entered values against the audited statement. DCF is an editable scenario engine, not a forecast, fair-value conclusion, or investment recommendation.

### ابزارهای تکمیلی تحلیلگر

- **ROIC و DuPont:** ROIC مطابق صورت نسبت‌های CFA از تقسیم NOPAT بر مجموع میانگین بدهی بهره‌دار و میانگین حقوق صاحبان سهام به‌دست می‌آید. نرخ مؤثر مالیات و مانده‌های ابتدا و انتهای دورهٔ بدهی و حقوق صاحبان سهام را وارد کنید. تعریف‌های دیگر سرمایه به‌کارگرفته‌شده ممکن است متفاوت باشند. ROE دوپونت به حاشیه سود خالص، گردش دارایی و ضریب حقوق صاحبان سهام تفکیک می‌شود.
- **بدهی و کیفیت سود:** D/E از بدهی بهره‌دار استفاده می‌کند و نسبت کل بدهی به حقوق صاحبان سهام جداست. بدهی کوتاه‌مدت و بلندمدت با کل بدهی تطبیق داده می‌شود. اقلام تعهدی به دارایی، CFO به سود خالص، حاشیه FCF و CFO به CapEx نیز محاسبه می‌شوند.
- **CapEx:** مخارج سرمایه‌ای گزارش‌شده را به‌صورت مبلغ مثبت وجه نقد پرداختی وارد کنید؛ خروجی منفی صورت جریان نقد به قدرمطلق تبدیل می‌شود. اگر رقم گزارش‌شده موجود نباشد، برنامه از تغییر دارایی ثابت به‌علاوهٔ استهلاک برآورد می‌کند؛ تملک، واگذاری، تغییر ارز و تجدید ارزیابی ممکن است برآورد را مخدوش کند.
- **کنترل صورت‌ها:** معادله ترازنامه، تطبیق ترکیب بدهی، تبدیل سود به وجه نقد، نسبت پرداخت سود، مانده‌های ابتدای دوره، نرخ مالیات و مبنای CapEx با پرچم‌های بازبینی نمایش داده می‌شوند. آستانه‌ها تقریبی‌اند و نظر حسابرسی یا رتبهٔ اعتباری نیستند.
- **DCF سناریویی:** رشد فروش و حاشیه EBIT در سه سناریو قابل‌ویرایش است. FCFF به‌صورت محرک‌محور از رابطه NOPAT + استهلاک − CapEx − تغییر سرمایه در گردش پیش‌بینی می‌شود. نسبت CapEx، استهلاک و سرمایه در گردش به فروش قابل‌تغییر است؛ در صورت خالی بودن، از صورت‌ها استخراج می‌شود (سرمایه در گردش اولیه به‌طور پیش‌فرض دارایی جاری منهای بدهی جاری است و ممکن است وجه نقد یا اقلام تأمین مالی را هم شامل شود). WACC یا دستی وارد می‌شود یا با CAPM، ارزش بازار حقوق صاحبان سهام و ماندهٔ گزارش‌شدهٔ بدهی بهره‌دار برآورد می‌شود؛ ارزش بازار بدهی، اجاره، سهام ممتاز و منافع فاقدکنترل در مدل نیستند. نمودار FCFF و حساسیت ۵×۵ ارزش هر سهم سناریوی پایه نسبت به WACC و رشد پایدار اضافه شده‌اند. تمرکز ارزش پایانی و مفروضات را بررسی کنید؛ خروجی قیمت هدف نیست.
- **داشبورد تحلیل‌گر:** فاصله ROIC/WACC را در صورت هم‌دوره بودن، محرک‌های DuPont، تبدیل CFO به سود خالص، بدهی خالص/EBITDA و نکات بازبینی صورت‌ها کنار هم می‌آورد. سیگنال‌های قاعده‌محور صرفاً عارضه‌یابی هستند، نه رتبه‌بندی اوراق یا توصیه سرمایه‌گذاری.
- **نمایش دوره و تاریخچه:** اقلام جریانی تحلیل تک‌شرکتی را می‌توان سالانه‌سازی خطی یا به‌صورت مبلغ گزارش‌شده دید؛ سالانه‌سازی دوره کوتاه که فصل‌پذیری را پنهان می‌کند هشدار می‌گیرد. هنگام ذخیره دوره شرکت، زمان ثبت در کنار سند، صفحه و مبنای حسابرسی نگهداری می‌شود.
- **ورود گروهی:** واردکنندهٔ محلی CSV/XLSX برای هر شرکت، دوره و قلم یک سطر می‌خواهد. سرستون‌های اجباری `company, period, field, value` هستند؛ **دریافت قالب** سرستون‌های دقیق را می‌سازد. شناسهٔ قلم‌ها مانند `net-income`، `operating-cash-flow` و `reported-capex` را به‌کار ببرید. ابتدا پیش‌نمایش و اعتبارسنجی کنید؛ سپس ثبت کنید. رکوردهای شرکت/ارز/دورهٔ یکسان ادغام و مقدار تکراری هر قلم جایگزین می‌شود.
- **همتایان و منبع:** صنعت را برای فیلتر جدول و روند انتخاب کنید. چارک‌ها فقط با حداقل چهار مشاهده و مبنای گزارش، ارز و مقیاس قابل‌مقایسه ارائه می‌شوند. سند و صفحهٔ منبع را ثبت و داده‌های مقایسه‌ای تجدیدارائه‌شده را علامت بزنید.

ارقام PDF خودکار استخراج نمی‌شوند؛ صفحهٔ منبع را ثبت و داده‌های واردشده را با صورت حسابرسی‌شده تطبیق دهید. DCF ابزار سناریویی با مفروضات قابل‌ویرایش است، نه پیش‌بینی قطعی، ارزش منصفانه یا توصیهٔ سرمایه‌گذاری.

## محیط محلی

## اجرای برنامه

فایل `index.html` را با یک مرورگر جدید باز کنید. به فایل BAT، Node.js، وب‌سرور محلی، CDN یا نصب نیاز نیست. تحلیل‌ها، نمودارها و ورود دستی صورت‌ها آفلاین کار می‌کنند. نمای اختیاری TradingView پس از فشردن **دریافت قیمت** مستقیماً از مرورگر درخواست اینترنتی می‌فرستد. این screener جامعه‌محور و غیررسمی است، ممکن است تأخیر داشته باشد و صورت‌های مالی را ارائه نمی‌کند؛ داده‌های بازار را مستقل بررسی کنید.

## تحلیل بنیادی به سبک CFA

برای همهٔ مبالغ از ارز و مقیاس یکسان استفاده کنید و تعداد سهام را نیز هم‌مقیاس با ارقام صورت مالی وارد کنید؛ مثلاً میلیون سهم برای صورت‌های مالی به میلیون. قیمت بازار هر سهم را به واحد واقعی وارد کنید. جریان‌های صورت سود و زیان و جریان نقد را برای دورهٔ یکسان و ماندهٔ ابتدا و انتهای دوره را برای نسبت‌های میانگین وارد کنید. برای هر شاخص، راهنمای تفسیر و محدودیت‌ها بازشدنی است.

### مقایسهٔ چند شرکت

در بخش **صورت‌های مالی و مقایسهٔ شرکت‌ها**، علاوه بر ارز، مقیاس و برچسب دقیق دوره، طول دوره به ماه، دامنهٔ صورت‌ها (تلفیقی/جداگانه)، وضعیت گزارش و اظهارنظر حسابرس را ثبت کنید. این مشخصات در نسخهٔ پشتیبان ذخیره و در جدول همتایان نمایش داده می‌شوند؛ تفاوت یا نبود اطلاعات مبنا نیز هشدار می‌گیرد. نسخه‌های پشتیبان قدیمی همچنان قابل بازیابی‌اند، اما تا تکمیل مشخصات دوره با هشدار مبنای ناقص نمایش داده می‌شوند.

شاخص‌های جریانی و ضرایب ارزش‌گذاری در سابقهٔ مقایسه بر اساس طول هر دوره به معادل ۱۲ماهه تبدیل می‌شوند؛ مانده‌های ترازنامه و قیمت پایان دوره سالانه‌سازی نمی‌شوند. بازده کل از سود تقسیمی و تغییر قیمت همان دوره استفاده می‌کند. طول دوره را دقیق وارد کنید و دوره‌های پیش‌بینی، وضعیت حسابرسی، تلفیقی/جداگانه، تجدید ارائه و تفاوت پایان سال مالی را برای مقایسه بررسی کنید. گزارش کدال پیوست‌شده، صورت‌های مالی حسابرسی‌شدهٔ ۱۲ماهه را کنار جدول‌های پیش‌بینی مدیریت قرار می‌دهد؛ حتی با یکسان بودن طول دوره، برآورد مدیریتی را از دادهٔ حسابرسی‌شده جدا نگه دارید. سپس دوره و گروه شاخص را برای مقایسه انتخاب و شاخصی برای نمودار روند تعیین کنید. تغییر دوره‌ای با آخرین دورهٔ ذخیره‌شدهٔ قبلی همان شرکت سنجیده می‌شود. داده‌ها فقط در حافظهٔ محلی همین مرورگر می‌مانند؛ مرتب **دریافت نسخهٔ پشتیبان** را انجام دهید. **بازیابی نسخهٔ پشتیبان** داده‌های شرکت‌های فعلی مرورگر را جایگزین می‌کند.

دکمهٔ **شروع از مشخصات گزارش کدال پیوست‌شده** هویت شرکت، ارز IRR، مقیاس میلیون ریال، برچسب FY1404، دورهٔ ۱۲ماهه، دامنهٔ تلفیقی و وضعیت حسابرسی‌شده با اظهارنظر مقبول را از گزارش وارد می‌کند؛ مبلغ‌های صورت مالی وارد نمی‌شوند و باید از PDF ثبت شوند. برای سایر شرکت‌ها، مشخصات گزارش را دستی تعیین کنید. برچسب دوره‌ها برای نمایش کنار هم باید دقیقاً یکسان باشد. تبدیل ارز، مقیاس، رویهٔ حسابداری یا سال مالی خودکار نیست. برای آمار و نمودارهای دارای واحد پول، ارز و مقیاس باید یکسان باشند. پیش از نتیجه‌گیری، هم‌ترازی دوره‌ها و مبنای حسابداری را بررسی و راهنمای هر نسبت را مطالعه کنید.
