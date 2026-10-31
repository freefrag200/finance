// Global variables and constants
let currentLang = 'en';
let currentTheme = 'dark';
let dataPoints = []; // Array to hold numerical data points for the asset
let marketDataPoints = []; // Array to hold market return data points
let benchmarkDataPoints = []; // Array to hold benchmark return data points
let calculatedResults = {}; // Asset analysis results
let selectedEditIndex = -1;
let equityCalculatedResults = {}; // New: Store equity valuation results
let fixedIncomeCalculatedResults = {}; // New: Store fixed income results
let portfolioCalculatedResults = {}; // New: Store portfolio results
let portfolioAssets = []; // Array to store portfolio assets {id, return, stdDev, weight, correlations: {id: correlation}}
let nextAssetId = 1; // For unique IDs for portfolio assets

// --- Translations Dictionary ---
const texts = {
    theme_switch_light:{en:'Light mode',fa:'حالت روشن'}, theme_switch_dark:{en:'Dark mode',fa:'حالت تیره'},
    workspace_navigation:{en:'Analysis workspaces',fa:'فضاهای تحلیل'},
    record_saved_at:{en:'saved {date}',fa:'ذخیره {date}'}, dcf_terminal_share:{en:'PV of terminal value / EV',fa:'ارزش فعلی بخش پایانی / ارزش بنگاه'}, dcf_year:{en:'Year',fa:'سال'},
    analyst_dashboard_kicker:{en:'ANALYST DASHBOARD',fa:'داشبورد تحلیل‌گر'}, analyst_dashboard_title:{en:'Investment research brief',fa:'خلاصه پژوهش سرمایه‌گذاری'}, analyst_dashboard_hint:{en:'A structured read-through of earnings quality, return drivers, balance-sheet risk, and valuation context. Signals are prompts for analyst review, not recommendations.',fa:'مروری ساختاریافته بر کیفیت سود، محرک‌های بازده، ریسک ترازنامه و ارزش‌گذاری. این سیگنال‌ها برای بررسی تحلیل‌گر هستند و توصیه سرمایه‌گذاری نیستند.'}, analyst_waiting:{en:'Awaiting calculated inputs',fa:'در انتظار محاسبه داده‌ها'}, analyst_empty:{en:'Calculate the financial statements to generate prioritized review notes.',fa:'برای تولید نکات اولویت‌بندی‌شده، صورت‌های مالی را محاسبه کنید.'}, analyst_strong:{en:'Supportive signal',fa:'سیگنال مساعد'}, analyst_review:{en:'Analyst review',fa:'نیازمند بررسی تحلیل‌گر'}, analyst_missing:{en:'Insufficient data',fa:'داده ناکافی'}, analyst_kpi_roic:{en:'ROIC / WACC',fa:'ROIC / WACC'}, analyst_kpi_roe:{en:'DuPont ROE',fa:'ROE دوپون'}, analyst_kpi_cash:{en:'CFO / net income',fa:'CFO / سود خالص'}, analyst_kpi_leverage:{en:'Net debt / EBITDA',fa:'بدهی خالص / EBITDA'}, analyst_roic_wacc:{en:'ROIC is {roic}% versus base-case WACC of {wacc}%. The spread is {spread} percentage points; confirm both use consistent tax, currency, and nominal/real assumptions.',fa:'ROIC برابر {roic}٪ در برابر WACC سناریوی پایه {wacc}٪ است. فاصله {spread} واحد درصد است؛ سازگاری مالیات، ارز و مفروضات اسمی/واقعی را بررسی کنید.'}, analyst_roe_driver:{en:'DuPont ROE is {roe}%: net margin {margin}%, asset turnover {turnover}×, and equity multiplier {multiplier}×. Identify which driver explains the change over time.',fa:'ROE دوپون برابر {roe}٪ است: حاشیه خالص {margin}٪، گردش دارایی {turnover}× و ضریب حقوق صاحبان سهام {multiplier}×. محرک تغییرات زمانی را مشخص کنید.'}, analyst_cash_conversion:{en:'CFO / net income is {value}×. Review working-capital timing and non-cash accruals, especially when earnings and operating cash diverge.',fa:'نسبت CFO به سود خالص {value}× است. زمان‌بندی سرمایه در گردش و اقلام تعهدی غیرنقدی را، به‌خصوص هنگام واگرایی سود و وجه نقد عملیاتی، بررسی کنید.'}, analyst_leverage:{en:'Net debt / EBITDA is {value}×. Test debt maturities, lease treatment, covenant headroom, and refinancing capacity.',fa:'نسبت بدهی خالص به EBITDA برابر {value}× است. سررسید بدهی، اجاره، حاشیه شروط و توان تأمین مالی مجدد را بسنجید.'}, analyst_quality:{en:'{count} statement checks need review. Resolve missing, inconsistent, or unusual model inputs before relying on the valuation.',fa:'{count} کنترل صورت مالی نیازمند بررسی است. پیش از اتکا به ارزش‌گذاری، ورودی‌های ناقص، ناسازگار یا نامتعارف مدل را بازبینی کنید.'}, analyst_quality_clear:{en:'No configured statement check is currently flagged; this does not establish that the statements are error-free.',fa:'در حال حاضر هیچ‌یک از کنترل‌های تعریف‌شده علامت‌دار نیست؛ این موضوع بدون‌خطا بودن صورت‌ها را اثبات نمی‌کند.'}, analyst_fcf:{en:'FCF is {value}; compare its multi-year trend with reinvestment needs and earnings growth.',fa:'FCF برابر {value} است؛ روند چندساله آن را با نیاز سرمایه‌گذاری مجدد و رشد سود مقایسه کنید.'},
    advanced_valuation_kicker:{en:'VALUATION & DIAGNOSTICS',fa:'ارزش‌گذاری و عارضه‌یابی'}, advanced_valuation_title:{en:'Scenario DCF & model checks',fa:'ارزش‌گذاری DCF سناریویی و کنترل مدل'}, advanced_valuation_hint:{en:'Enter your own bear, base, and bull assumptions; no company-specific forecasts are invented. FCFF uses annualized inputs. This is a sensitivity model, not a target price or investment recommendation.',fa:'مفروضات سناریوهای بدبینانه، پایه و خوش‌بینانه را خودتان وارد کنید؛ پیش‌بینی شرکت‌محور ساختگی نمی‌شود. ورودی‌های FCFF سالانه‌سازی می‌شوند. این مدل حساسیت است، نه هدف قیمت یا توصیه سرمایه‌گذاری.'},
    dcf_bear:{en:'Bear case',fa:'سناریوی بدبینانه'}, dcf_base:{en:'Base case',fa:'سناریوی پایه'}, dcf_bull:{en:'Bull case',fa:'سناریوی خوش‌بینانه'}, dcf_growth:{en:'Revenue growth (%)',fa:'رشد فروش (درصد)'}, dcf_margin:{en:'EBIT margin (%)',fa:'حاشیه EBIT (درصد)'}, dcf_wacc:{en:'WACC (%)',fa:'WACC (درصد)'}, dcf_terminal:{en:'Terminal growth (%)',fa:'رشد پایدار (درصد)'}, dcf_horizon:{en:'Forecast horizon (years)',fa:'افق پیش‌بینی (سال)'}, dcf_tax:{en:'Tax rate (%)',fa:'نرخ مالیات (درصد)'}, dcf_run:{en:'Calculate scenario DCF',fa:'محاسبه DCF سناریویی'}, dcf_empty:{en:'Enter and calculate fundamental inputs first, then run the DCF scenarios.',fa:'ابتدا داده‌های بنیادی را وارد و محاسبه کنید، سپس سناریوهای DCF را اجرا کنید.'}, dcf_caveat:{en:'FCFF = NOPAT + D&A − CapEx − change in operating NWC. NWC is forecast as a share of revenue; the opening proxy uses current assets less current liabilities unless overridden. Review seasonality, leases, taxes, and terminal value concentration.',fa:'FCFF برابر NOPAT + استهلاک − CapEx − تغییر سرمایه در گردش عملیاتی است. سرمایه در گردش به‌صورت درصدی از فروش پیش‌بینی می‌شود؛ مبنای اولیه دارایی جاری منهای بدهی جاری است مگر آنکه مقدار دیگری وارد کنید. فصل‌پذیری، اجاره، مالیات و تمرکز ارزش پایانی را بررسی کنید.'}, dcf_invalid:{en:'DCF cannot be calculated: confirm positive sales and shares, valid debt and cash inputs, available nonnegative CapEx/depreciation, and WACC greater than terminal growth in every case.',fa:'محاسبه DCF ممکن نیست: فروش و تعداد سهام مثبت، داده معتبر بدهی و وجه نقد، CapEx/استهلاک غیرمنفی و موجود، و WACC بزرگ‌تر از رشد پایدار در هر سناریو را بررسی کنید.'}, dcf_scenario:{en:'Scenario',fa:'سناریو'}, dcf_ev:{en:'Enterprise value',fa:'ارزش بنگاه'}, dcf_equity:{en:'Equity value',fa:'ارزش حقوق صاحبان سهام'}, dcf_price:{en:'Implied value / share',fa:'ارزش ضمنی هر سهم'}, dcf_current:{en:'Current price',fa:'قیمت فعلی'}, dcf_upside:{en:'Implied change',fa:'تغییر ضمنی'}, dcf_share_warning:{en:'Per-share results need a positive share count and current price.',fa:'نتیجه هر سهم به تعداد سهام و قیمت فعلی مثبت نیاز دارد.'}, dcf_drivers_title:{en:'Operating drivers & cost of capital',fa:'محرک‌های عملیاتی و هزینه سرمایه'}, dcf_nwc_sales:{en:'Operating NWC / sales (%)',fa:'سرمایه در گردش عملیاتی / فروش (٪)'}, dcf_risk_free:{en:'Risk-free rate (%)',fa:'نرخ بدون ریسک (٪)'}, dcf_beta:{en:'Levered beta (β)',fa:'بتای اهرمی (β)'}, dcf_erp:{en:'Equity risk premium (%)',fa:'صرف ریسک سهام (٪)'}, dcf_cost_debt:{en:'Pre-tax cost of debt (%)',fa:'هزینه بدهی پیش از مالیات (٪)'}, dcf_derive_wacc:{en:'Derive WACC from CAPM and market capital structure',fa:'محاسبه WACC با CAPM و ساختار سرمایه بازار'}, dcf_wacc_manual_note:{en:'Manual scenario WACC is active. Derived WACC requires risk-free rate, beta, equity risk premium, cost of debt, tax rate, share price, shares, and interest-bearing debt.',fa:'WACC دستی سناریو فعال است. محاسبه برآوردی به نرخ بدون ریسک، بتا، صرف ریسک سهام، هزینه بدهی، مالیات، قیمت سهم، تعداد سهام و بدهی بهره‌دار نیاز دارد.'}, dcf_wacc_derived:{en:'CAPM cost of equity {coe}% · market equity weight {equityWeight}% · debt weight {debtWeight}% · derived WACC {wacc}%.',fa:'هزینه حقوق صاحبان سهام CAPM برابر {coe}٪ · وزن ارزش بازار حقوق صاحبان سهام {equityWeight}٪ · وزن بدهی {debtWeight}٪ · WACC برآوردی {wacc}٪.'}, dcf_wacc_missing:{en:'Derived WACC is unavailable; check all CAPM and capital-structure inputs. Use manual WACC or complete the missing inputs.',fa:'WACC برآوردی در دسترس نیست؛ ورودی‌های CAPM و ساختار سرمایه را بررسی کنید. WACC دستی را به‌کار ببرید یا ورودی‌های لازم را تکمیل کنید.'}, dcf_sensitivity_title:{en:'Base-case per-share sensitivity · WACC × terminal growth',fa:'حساسیت ارزش هر سهم سناریوی پایه · WACC × رشد پایدار'}, dcf_sensitivity_note:{en:'Sensitivity holds revenue growth, EBIT margin, tax, and operating NWC assumptions constant.',fa:'در این حساسیت، رشد فروش، حاشیه EBIT، مالیات و مفروضات سرمایه در گردش ثابت نگه داشته شده‌اند.'}, dcf_forecast_chart:{en:'Forecast FCFF by scenario',fa:'FCFF پیش‌بینی‌شده به تفکیک سناریو'},
    quality_kicker:{en:'INPUT INTEGRITY',fa:'اعتبار داده‌های ورودی'}, quality_title:{en:'Financial statement quality checks',fa:'کنترل‌های کیفیت صورت‌های مالی'}, quality_not_rating:{en:'Diagnostics, not a rating',fa:'عیب‌یابی، نه رتبه‌بندی'}, quality_hint:{en:'Checks flag missing, inconsistent, or unusual inputs. They do not determine fraud, credit quality, or investment merit.',fa:'این کنترل‌ها داده‌های ناقص، ناسازگار یا نامتعارف را علامت می‌زنند و درباره تقلب، اعتبار یا ارزش سرمایه‌گذاری حکم نمی‌دهند.'}, quality_empty:{en:'Calculate metrics to run input diagnostics.',fa:'برای اجرای کنترل‌های داده، شاخص‌ها را محاسبه کنید.'}, quality_pass:{en:'No issue detected by this check',fa:'این کنترل موردی پیدا نکرد'}, quality_warn:{en:'Review this input or relationship',fa:'این ورودی یا رابطه را بازبینی کنید'}, quality_missing:{en:'Insufficient data for this check',fa:'داده برای اجرای این کنترل کافی نیست'}, quality_balance:{en:'Balance sheet equation: Assets ≈ Liabilities + Equity',fa:'معادله ترازنامه: دارایی ≈ بدهی + حقوق صاحبان سهام'}, quality_balance_note:{en:'Difference',fa:'اختلاف'}, quality_period:{en:'Reporting period',fa:'دوره گزارش'}, quality_period_note:{en:'months annualized; flow items scaled linearly',fa:'ماه سالانه‌سازی شده؛ اقلام جریانی خطی مقیاس شده‌اند'}, quality_period_reported:{en:'flow items shown as reported for this period; peer comparisons remain annualized',fa:'اقلام جریانی به شکل گزارش‌شده این دوره نمایش داده می‌شوند؛ مقایسه همتایان همچنان سالانه‌سازی می‌شود'}, quality_cash:{en:'Cash earnings conversion (CFO / Net income)',fa:'تبدیل سود به وجه نقد (CFO / سود خالص)'}, quality_accrual:{en:'Accruals / average assets',fa:'اقلام تعهدی / میانگین دارایی'}, quality_payout:{en:'Dividend payout sustainability',fa:'پایداری نسبت پرداخت سود'}, quality_capex:{en:'CapEx source basis',fa:'مبنای داده مخارج سرمایه‌ای'}, quality_capex_reported:{en:'Reported cash-flow CapEx used',fa:'CapEx گزارش‌شده از جریان نقد استفاده شد'}, quality_capex_estimated:{en:'Balance-sheet CapEx estimate used; acquisitions, disposals, FX and revaluations can distort it',fa:'برآورد ترازنامه‌ای CapEx استفاده شد؛ تملک، واگذاری، ارز و تجدید ارزیابی ممکن است آن را منحرف کند'}, quality_opening:{en:'Opening balances needed for average-balance ratios',fa:'برای نسبت‌های مبتنی بر میانگین، مانده‌های ابتدای دوره لازم است'}, quality_denominators:{en:'Negative or near-zero denominators',fa:'مخرج منفی یا نزدیک به صفر'},
    workbook_kicker:{en:'BULK DATA ENTRY',fa:'ورود گروهی داده'}, workbook_title:{en:'Multi-company CSV / Excel import',fa:'ورود CSV / Excel چندشرکتی'}, workbook_hint:{en:'Use one row per company-period-field. Required headers: company, period, field, value. Optional: ticker, industry, currency, scale, months, scope, status, opinion, source_page, restated. Preview and validate before applying records.',fa:'برای هر شرکت، دوره و قلم یک سطر بسازید. ستون‌های اجباری: company, period, field, value. اختیاری: ticker, industry, currency, scale, months, scope, status, opinion, source_page, restated. پیش از ثبت، پیش‌نمایش و اعتبارسنجی کنید.'}, workbook_preview:{en:'Preview & validate',fa:'پیش‌نمایش و اعتبارسنجی'}, workbook_apply:{en:'Apply validated rows',fa:'ثبت سطرهای معتبر'}, workbook_template:{en:'Download template',fa:'دریافت قالب'}, workbook_choose:{en:'Choose a CSV or Excel file first.',fa:'ابتدا فایل CSV یا Excel انتخاب کنید.'}, workbook_no_xlsx:{en:'The local spreadsheet library is unavailable.',fa:'کتابخانه آفلاین صفحه‌گسترده در دسترس نیست.'}, workbook_preview_result:{en:'Valid rows: {valid} · skipped: {skipped} · companies: {companies} · periods: {periods}',fa:'سطر معتبر: {valid} · ردشده: {skipped} · شرکت: {companies} · دوره: {periods}'}, workbook_apply_confirm:{en:'Apply {count} validated statement rows to local company records?',fa:'{count} سطر صورت مالی معتبر به سوابق محلی شرکت افزوده شود؟'}, workbook_done:{en:'Imported {count} valid statement rows.',fa:'{count} سطر معتبر صورت مالی وارد شد.'}, workbook_invalid:{en:'Could not read this workbook. Check the file type and required headers.',fa:'خواندن فایل ممکن نشد. نوع فایل و ستون‌های اجباری را بررسی کنید.'}, workbook_field:{en:'Statement field',fa:'قلم صورت مالی'}, workbook_value:{en:'Value',fa:'مقدار'}, workbook_company:{en:'Company',fa:'شرکت'}, workbook_period_col:{en:'Period',fa:'دوره'}, workbook_status:{en:'Status',fa:'وضعیت'}, workbook_rows_sample:{en:'Validated row preview (first 20)',fa:'پیش‌نمایش سطرهای معتبر (۲۰ مورد نخست)'},
    offline_badge:{en:'Offline · local files',fa:'آفلاین · فایل‌های محلی'}, quality_capex_unavailable:{en:'No valid nonnegative CapEx input or estimate is available.',fa:'ورودی CapEx مثبت یا برآورد معتبر و غیرمنفی در دسترس نیست.'}, financial_period_months:{en:'Financial period length (months)',fa:'طول دوره مالی (ماه)'}, financial_period_hint:{en:'Linear annualization can conceal seasonality; compare reported-period values when needed.',fa:'سالانه‌سازی خطی ممکن است فصل‌پذیری را پنهان کند؛ در صورت نیاز مقادیر دوره گزارش‌شده را مقایسه کنید.'}, financial_flow_basis_label:{en:'Flow presentation',fa:'نحوه نمایش اقلام جریانی'}, financial_flow_annualized:{en:'Annualized (linear)',fa:'سالانه‌سازی خطی'}, financial_flow_reported:{en:'Reported period',fa:'دوره گزارش‌شده'}, dcf_current_margin:{en:'Reported EBIT margin baseline: {margin}%',fa:'حاشیه EBIT گزارش‌شده برای مبنا: {margin}٪'},
    source_document_label:{en:'Source document',fa:'سند منبع'}, source_document_placeholder:{en:'e.g., Annual report FY2025',fa:'مثلاً گزارش سالانه ۲۰۲۵'}, source_page_label:{en:'Source page / note',fa:'صفحه / یادداشت منبع'}, source_page_placeholder:{en:'e.g., p. 42, Note 18',fa:'مثلاً صفحه ۴۲، یادداشت ۱۸'}, source_pdf_picker:{en:'Select source PDF',fa:'انتخاب PDF منبع'}, source_pdf_note:{en:'Select a PDF to record its filename only; financial figures are not extracted.',fa:'با انتخاب PDF فقط نام فایل ثبت می‌شود؛ ارقام مالی استخراج نمی‌شوند.'}, restated_label:{en:'Restated comparative data',fa:'ارقام مقایسه‌ای تجدید ارائه‌شده'}, workbook_file_label:{en:'Select CSV or Excel workbook',fa:'انتخاب فایل CSV یا Excel'},
    company_industry_label:{en:'Industry / peer group',fa:'صنعت / گروه همتا'}, company_industry_placeholder:{en:'e.g., Software',fa:'مثلاً نرم‌افزار'}, compare_industry_label:{en:'Peer universe',fa:'گروه مقایسه'}, compare_all_companies:{en:'All companies',fa:'همه شرکت‌ها'}, compare_industry_only:{en:'Industry: {industry}',fa:'صنعت: {industry}'}, peer_quartiles:{en:'Peer quartiles (Q1 / median / Q3)',fa:'چارک‌های همتا (چارک اول / میانه / چارک سوم)'}, peer_sample_small:{en:'At least four comparable observations are required for quartiles.',fa:'برای محاسبه چارک‌ها حداقل چهار مشاهده قابل‌مقایسه لازم است.'},
    advice_liabilitiesEquity:{en:'Includes operating liabilities as well as borrowings. Compare with interest-bearing D/E and inspect lease and pension obligations.',fa:'علاوه بر استقراض، بدهی‌های عملیاتی را هم شامل می‌شود؛ آن را کنار D/E بدهی بهره‌دار ببینید و اجاره و تعهدات بازنشستگی را بررسی کنید.'}, advice_netDebt:{en:'Net debt subtracts cash from interest-bearing debt; restricted cash and lease debt treatment can change the interpretation.',fa:'بدهی خالص وجه نقد را از بدهی بهره‌دار کم می‌کند؛ وجه نقد محدودشده و نحوه برخورد با بدهی اجاره بر تفسیر اثر می‌گذارد.'}, advice_shortDebtShare:{en:'A high short-term share raises refinancing and liquidity exposure. Examine committed facilities, covenants, and cash maturities.',fa:'سهم بالای بدهی کوتاه‌مدت ریسک تأمین مجدد و نقدینگی را افزایش می‌دهد؛ خطوط اعتباری، شروط و سررسید وجه نقد را بررسی کنید.'}, advice_debtMixReconciliation:{en:'The short- and long-term debt split should reconcile to total interest-bearing debt. Review leases, current maturities, and classification differences.',fa:'جمع بدهی کوتاه‌مدت و بلندمدت باید با کل بدهی بهره‌دار تطبیق کند؛ اجاره، بخش جاری بدهی بلندمدت و اختلاف طبقه‌بندی را بازبینی کنید.'}, advice_roic:{en:'ROIC depends on invested-capital definitions, cash treatment, and the tax rate. Compare with WACC using consistent nominal/real and currency assumptions.',fa:'ROIC به تعریف سرمایه به‌کارگرفته‌شده، نحوه کسر نقد و نرخ مالیات وابسته است؛ آن را با WACC دارای مفروضات پولی و اسمی/واقعی یکسان مقایسه کنید.'}, advice_dupontMargin:{en:'The DuPont margin isolates net profitability; review tax, financing and nonrecurring effects.',fa:'حاشیه DuPont سودآوری خالص را جدا می‌کند؛ مالیات، تأمین مالی و اقلام غیرتکراری را بررسی کنید.'}, advice_dupontTurnover:{en:'Asset turnover is affected by asset age, revaluations, outsourcing and business model.',fa:'گردش دارایی از عمر دارایی، تجدید ارزیابی، برون‌سپاری و مدل کسب‌وکار اثر می‌گیرد.'}, advice_equityMultiplier:{en:'A higher multiplier indicates more assets per unit of equity, often reflecting greater leverage; interpret with debt maturity and solvency.',fa:'ضریب بالاتر یعنی دارایی بیشتر به‌ازای هر واحد حقوق صاحبان سهام و معمولاً اهرم بیشتر؛ سررسید بدهی و توان پرداخت را هم بسنجید.'}, advice_dupontRoe:{en:'DuPont decomposes ROE into margin, asset turnover, and equity multiplier. Verify its inputs use aligned periods and average balances.',fa:'DuPont، ROE را به حاشیه سود، گردش دارایی و ضریب حقوق صاحبان سهام می‌شکند؛ هم‌دوره بودن اقلام و استفاده از مانده میانگین را بررسی کنید.'}, advice_accrualRatio:{en:'Large positive accruals relative to assets can indicate weaker cash backing, but growth, seasonality and working capital can explain differences.',fa:'اقلام تعهدی مثبت بالا نسبت به دارایی می‌تواند پشتوانه نقدی ضعیف‌تر را نشان دهد، اما رشد، فصل‌پذیری و سرمایه در گردش نیز مؤثرند.'}, advice_fcfMargin:{en:'FCF margin depends on CapEx classification and acquisitions; inspect cash-flow notes and multi-year reinvestment needs.',fa:'حاشیه FCF به طبقه‌بندی CapEx و تملک‌ها وابسته است؛ یادداشت‌های جریان نقد و نیاز سرمایه‌گذاری چندساله را بررسی کنید.'}, advice_cfoCapexCoverage:{en:'Coverage below 1× means operating cash flow did not cover recorded or estimated CapEx in this period; interpret seasonality and asset sales.',fa:'پوشش کمتر از ۱ برابر یعنی جریان نقد عملیاتی CapEx گزارش‌شده یا برآوردی را در این دوره پوشش نداده؛ فصل‌پذیری و فروش دارایی را در نظر بگیرید.'},
    'treynor_ratio_tooltip': {'en': 'Excess return over the risk-free rate per unit of systematic risk (beta).'},
    'calmar_ratio_tooltip': {'en': 'Annualized return divided by the absolute maximum drawdown.'},
    'jensen_alpha_tooltip': {'en': 'The return above or below the CAPM-predicted return.'},
    'm2_measure_tooltip': {'en': 'Risk-adjusted return scaled to the volatility of the market.'},
    'tab_financial_strategy': {'en':'Financial Strategy','fa':'تحلیل بنیادی'},
    'tab_asset_analysis': {'en':'Asset Analysis'}, 'tab_equity_valuation': {'en':'Equity Valuation'}, 'tab_fixed_income': {'en':'Fixed Income'}, 'tab_portfolio_management': {'en':'Portfolio Management'},
    'app_title': {
        'en': 'Advanced Risk and Return Analyzer'
    },
    'results_title': {
        'en': 'Analysis Results'
    },
    'advanced_metrics_title': {
        'en': 'Advanced CFA Metrics'
    },

    'mean_label': {
        'en': 'Mean Return'
    },
    'geo_mean_label': {
        'en': 'Geometric Mean'
    },
    'std_dev_label': {
        'en': 'Standard Deviation'
    },
    'downside_dev_label': {
        'en': 'Downside Deviation'
    },
    'variance_label': {
        'en': 'Variance'
    },
    'cv_label': {
        'en': 'Coefficient of Variation'
    },
    'mdd_label': {
        'en': 'Maximum Drawdown'
    },
    'skewness_label': {
        'en': 'Skewness'
    },
    'kurtosis_label': {
        'en': 'Kurtosis'
    },

    'var_label': {
        'en': 'Value at Risk (5%)'
    },
    'var_95_label': {
        'en': 'Value at Risk (95%)'
    },
    'cvar_label': {
        'en': 'Conditional VaR (5%)'
    },
    'max_gain_label': {
        'en': 'Maximum Gain'
    },

    'sharpe_label': {
        'en': 'Sharpe Ratio'
    },
    'sortino_label': {
        'en': 'Sortino Ratio'
    },
    'omega_label': {
        'en': 'Omega Ratio'
    },

    'treynor_ratio_label': {
        'en': 'Treynor Ratio'
    },
    'calmar_ratio_label': {
        'en': 'Calmar Ratio'
    },
    'jensen_alpha_label': {
        'en': 'Jensen\'s Alpha'
    },
    'm2_measure_label': {
        'en': 'M2 Measure'
    },
    'beta_label': {
        'en': 'Beta'
    },
    'alpha_label': {
        'en': 'Alpha'
    },
    'rsquared_label': {
        'en': 'R-Squared'
    },
    'capm_expected_return_label': {
        'en': 'CAPM Expected Return'
    },
    'reg_stderr_label': {
        'en': 'Regression Standard Error'
    },
    'beta_t_stat_label': {
        'en': 'Beta T-Statistic'
    },
    'beta_p_value_label': {
        'en': 'Beta P-Value'
    },
    'alpha_p_value_label': {
        'en': 'Alpha P-Value'
    },

    'tracking_error_label': {
        'en': 'Tracking Error'
    },
    'information_ratio_label': {
        'en': 'Information Ratio'
    },

    'mean_tooltip': {
        'en': 'Average return of the investment'
    },
    'geo_mean_tooltip': {
        'en': 'Geometric mean return, accounting for compounding effects'
    },
    'std_dev_tooltip': {
        'en': 'Standard deviation of returns, measuring total risk'
    },
    'downside_dev_tooltip': {
        'en': 'Standard deviation of negative returns only'
    },
    'var_tooltip': {
        'en': 'Value at Risk at 5% confidence level'
    },
    'cvar_tooltip': {
        'en': 'Conditional Value at Risk, expected loss beyond VaR'
    },
    'sharpe_tooltip': {
        'en': 'Risk-adjusted return measure using total risk'
    },
    'sortino_tooltip': {
        'en': 'Risk-adjusted return measure using downside risk'
    },
    'app_title': {'en': "Advanced Risk & Return Analyzer"},
    'status_financial_calculated': {'en': 'Financial metrics calculated.'}, 'quote_price_applied': {'en':'TradingView price applied to the share-price field.'},
    'status_ready': {'en': "Ready."},
    'status_calculating': {'en': "Calculating metrics..."},
    'status_calc_done': {'en': "Calculations complete."},
    'status_calc_error': {'en': "Calculation error: {error}"},
    'status_plotting_hist': {'en': "Plotting histogram..."},
    'status_plotting_box': {'en': "Plotting box plot..."},
    'status_plotting_equity': {'en': "Plotting equity curve..."},
    'status_plotting_qq': {'en': "Plotting QQ plot..."},
    'status_plot_done': {'en': "Plot generated."},
    'status_plot_error': {'en': "Error plotting: {error}"},
    'status_data_added': {'en': "{count} data point(s) added for {dataType}."},
    'status_data_invalid': {'en': "{count} added for {dataType}. Some invalid entries ignored: {entries}"},
    'status_no_valid_data': {'en': "Error: No valid data entered for {dataType}."},
    'status_empty_input': {'en': "Empty input ignored for {dataType}."},
    'status_data_edited': {'en': "Asset data point {index} edited from {old_val}% to {new_val}%."},
    'status_data_deleted': {'en': "Asset data point {index} ({val}%) deleted."},
    'status_list_cleared': {'en': "{listName} list cleared."},
    'status_results_reset': {'en': "Results reset. Click 'Calculate' to analyze."},
    'status_saving_results': {'en': "Preparing to save results..."},
    'status_save_success': {'en': "Results saved to '{filename}'."},
    'status_save_cancel': {'en': "Save operation cancelled."},
    'status_save_error': {'en': "Error saving file."},
    'status_import_cancel': {'en': "Import operation cancelled or no file dropped."},
    'status_importing': {'en': "Reading file '{filename}' for {dataType}..."},
    'status_import_success': {'en': "{count} data points imported successfully for {dataType}."},
    'status_import_error': {'en': "Error reading file for {dataType}."},
    'status_import_format_error': {'en': "Error: Invalid file format. Please drop a CSV, Excel, or TXT file."},
    'status_import_no_numeric': {'en': "Error: No numeric column found in the file for {dataType}."},
    'status_import_no_valid': {'en': "Error: No valid numeric data found in the file/column for {dataType}."},
    'status_rf_error': {'en': "Error: Invalid Risk-Free Rate."},
    'status_expected_market_return_error': {'en': "Error: Invalid Expected Market Return."},
    'status_need_data_calc': {'en': "Insufficient asset data for calculation (min 2 points)."},
    'status_need_data_plot': {'en': "No data to plot."},
    'status_no_results': {'en': "No results to save."},
    'status_no_data_save': {'en': "No data to save."},
    'status_select_edit': {'en': "Select an asset data item to edit first."},
    'status_select_delete': {'en': "Select an asset data item to delete first."},
    'status_edit_empty': {'en': "New value cannot be empty."},
    'status_edit_invalid': {'en': "Invalid value entered."},
    'status_edit_index_error': {'en': "Error saving data (index error)."},
    'status_delete_index_error': {'en': "Error deleting data (index error)."},
    'status_plot_error_no_paired_data': {'en': "Regression plot error: Asset and market data must have the same number of points.", 'title': "Regression Data Mismatch"},
    'status_plot_error_no_regression_params': {'en': "Regression plot error: Beta and Alpha parameters not available or invalid.", 'title': "Regression Parameters Missing"},
    'status_feature_unavailable': {'en': "This feature ({feature}) is currently unavailable."},
    'value_invalid': {'en': "N/A"}, 

    'results_title': {'en': "Analysis Results:"},
    'data_count': {'en': "Data Points"},
    'mean_label': {'en': "Arithmetic Mean"},
    'geo_mean_label': {'en': "Geometric Mean (CAGR)"},
    'std_dev_label': {'en': "Standard Deviation (Risk)"},
    'downside_dev_label': {'en': "Downside Deviation (Target=0)"},
    'variance_label': {'en': "Variance"},
    'cv_label': {'en': "Coefficient of Variation (CV)"},
    'mdd_label': {'en': "Max Drawdown (MDD)"},
    'mdd_period_label': {'en': "MDD Period (steps)"},
    'skewness_label': {'en': "Skewness"},
    'kurtosis_label': {'en': "Excess Kurtosis"},
    'normality_label': {'en': "Normality (Shapiro-Wilk)"},
    'var_label': {'en': "Historical VaR 5%"},
    'var_95_label': {'en': "Historical Gain 95%"},
    'max_gain_label': {'en': "Max Gain"},
    'sharpe_label': {'en': "Sharpe Ratio"},
    'sortino_label': {'en': "Sortino Ratio"},
    'cvar_label': {  'en': "CVaR 5% (Expected Shortfall)"},
    'omega_label': {  'en': "Omega Ratio (Threshold: RF)"},

    // Tab Names
    'tab_asset_analysis': {'en': "Asset Analysis"},
    'tab_equity_valuation': {'en': "Equity Valuation"},
    'tab_fixed_income': {'en': "Fixed Income"},
    'tab_portfolio_management': {'en': "Portfolio Management"},

    'add_data_title': {'en': "Asset Return Data (%)"}, // Updated title
    'add_data_hint': {'en': "(Enter multiple values separated by comma, space, or newline)"},
    'add_data_placeholder': {'en': "Enter asset return value(s)..."},
    'add_button': {'en': "Add"},
    'edit_delete_title': {'en': "Edit / Delete Asset Data:"},
    'edit_placeholder': {'en': "New value"},
    'save_button': {'en': "Save"},
    'delete_button': {'en': "Delete"},
    'rf_title': {'en': "Risk-Free Rate (% Annually):"},
    'rf_placeholder': {'en': "e.g., 2.5"},
    'data_list_title': {'en': "Current Asset Data List:"},
    'clear_list_button': {'en': "Clear Asset List"},
    'calculate_button': {'en': "Calculate Metrics"},
    'plot_hist_button': {'en': "Plot Histogram"},
    'plot_box_button': {'en': "Plot Box Plot"},
    'plot_equity_button': {'en': "Plot Equity Curve"},
    'plot_qq_button': {'en': "Plot QQ-Plot"},
    'lang_select_label': {'en': "Language:"},
    'list_empty_option': {'en': "List Empty"},
    'select_option': {'en': "Select..."},
    'data_option_format': {'en': "Data {index} ({value}%)"},
    'save_results_button_unified': {'en': "Save Results"},
    'drop_zone_prompt_dedicated_asset': {'en': "Drag & drop your Asset CSV/Excel/TXT file here"},
    'or_divider_text': {'en': "OR"},
    'plot_modal_title': {'en': "Chart"},

    // Tooltips
    'mean_tooltip': {  'en': "Arithmetic Mean: Simple average of returns."},
    'geo_mean_tooltip': {  'en': "Geometric Mean (CAGR): Compound average rate of return. More accurate for long-term performance."},
    'std_dev_tooltip': {  'en': "Standard Deviation: Dispersion of returns around the mean (Total Risk). Higher value = more volatility/risk."},
    'downside_dev_tooltip': {  'en': "Downside Deviation (Target=0): Dispersion of returns below zero. Measures unfavorable volatility (Loss Risk)."},
    'variance_tooltip': {  'en': "Variance: Average squared deviation from the mean. Primary unit of dispersion."},
    'cv_tooltip': {  'en': "Coefficient of Variation (CV): Risk per unit of return (StdDev / Mean). Useful for comparing risk of assets with different returns. Lower is better."},
    'mdd_tooltip': {  'en': "Maximum Drawdown: Largest peak-to-trough percentage decline in cumulative returns. Measures downside risk."},
    'mdd_period_tooltip': {  'en': "MDD Period: Duration (in number of data points/periods) of the maximum drawdown, from peak to recovery (or end)."},
    'skewness_tooltip': {  'en': "Skewness: Asymmetry of the distribution. Negative: Longer left tail (large losses more likely). Positive: Longer right tail (large gains more likely). Zero: Symmetric."},
    'kurtosis_tooltip': {  'en': "Excess Kurtosis: Fatness of the distribution's tails relative to Normal (Kurtosis - 3). Positive: Fatter tails, higher probability of extreme values (Tail Risk)."},
    'normality_tooltip': {  'en': "Shapiro-Wilk Normality Test: Tests if data significantly deviates from a normal distribution. (Not calculated in this version)"},
    'var_tooltip': {  'en': "Historical Value at Risk (VaR) 5%: Maximum loss expected to be exceeded only 5% of the time."},
    'var_95_tooltip': {  'en': "Historical Gain 95%: Minimum gain achieved in the best 5% of periods."},
    'max_gain_tooltip': {  'en': "Maximum Gain: The highest single period return observed in the data."},
    'sharpe_tooltip': {  'en': "Sharpe Ratio: Excess return over risk-free rate per unit of total risk. Higher is better risk-adjusted performance."},
    'sortino_tooltip': {  'en': "Sortino Ratio: Excess return over risk-free rate per unit of downside risk. Penalizes only bad risk. Higher is better."},
    'rf_tooltip': {  'en': "Risk-Free Rate: Expected return on a zero-risk investment (e.g., government bonds). Used to calculate excess return. Enter as annual percentage."},
    'cvar_tooltip': {  'en': "Conditional Value at Risk (CVaR) / Expected Shortfall (ES) 5%: Average loss in the worst 5% of historical return scenarios."},
    'omega_tooltip': {  'en': "Omega Ratio: Ratio of weighted desirable returns (above threshold) to weighted undesirable returns (below threshold)."},

    // SweetAlert titles and buttons
    'error_title': {'en': "Error"},
    'warning_title': {'en': "Warning"},
    'info_title': {'en': "Information"},
    'ok_button': {'en': "OK"},
    'cancel_button': {'en': "Cancel"},
    'deleted_title': {'en': "Deleted!"},
    'cleared_title': {'en': "Cleared!"},
    'clear_list_confirm': {'en': "Clear entire {listName} list?"},
    'confirm_clear_text': {'en': "This action cannot be undone."},
    'confirm_delete_text': {'en': "Are you sure you want to delete this data point?"},
    'invalid_format_msg': {'en': "Invalid file format. Please use CSV, Excel, or TXT."},
    'file_save_error_msg': {'en': "Could not save the file: {error}"},

    // Export related
    'export_format_title': {'en': "Select Export Format"},
    'export_txt': {'en': "Text File (.txt)"},
    'export_excel': {'en': "Excel File (.xlsx)"},
    'excel_sheet_raw_data_title': {'en': "Raw Data"},
    'excel_sheet_results_title': {'en': "Analysis Results"},
    'status_saving_txt_success': {'en': "Results saved to '{filename}'."},
    'status_saving_excel_success': {'en': "Results saved to '{filename}'."},
    'col_return': {'en': "Return (%)"},
    'Date': {'en': "Date"},

    // Plotting specific
    'plot_failed': {'en': "Plot generation failed."},
    'noDataPlot': {'en': "No data available to plot."},
    'error_lib_missing': {'en': "Required library ({lib}) is missing for this plot."},
    'status_qq_insufficient_points': {'en': "Not enough valid data points to generate QQ-Plot."},
    'hist_label_main': {'en': "Return Data"},
    'plot_norm_label': {'en': "Normal Fit (μ={mean}%, σ={std}%)"},
    'plot_kde_label': {'en': "Kernel Density Estimate (KDE)"},
    'plot_mean_val_label': {'en': "Mean: {val}%"},
    'plot_median_val_label': {'en': "Median: {val}%"},
    'median_label': {'en': "Median"},
    'plot_var_label': {'en': "Hist. VaR 5%: {val}%"},
    'plot_gain_label': {'en': "Hist. Gain 95%: {val}%"},
    'plot_ylabel_hist_density': {'en': "Density"},
    'plot_xlabel': {'en': "Return (%) / Value"},
    'hist_hover_value': {'en': "Value"},
    'plot_ylabel_hist': {'en': "Frequency / Density"},
    'boxplot_hover_stats': {'en': "Statistics"},
    'boxplot_hover_max': {'en': "Max (Upper Fence)"},
    'boxplot_hover_q3': {'en': "Q3 (75th Pctl)"},
    'boxplot_hover_median': {'en': "Median"},
    'boxplot_hover_q1': {'en': "Q1 (25th Pctl)"},
    'boxplot_hover_min': {'en': "Min (Lower Fence)"},
    'boxplot_hover_mean': {'en': "Mean"},
    'boxplot_hover_std': {'en': "Std. Dev."},
    'plot_ylabel_box': {'en': "Return (%) Values"},
    'plot_box_title': {'en': "Box Plot of Returns"},
    'equity_curve_label': {'en': "Equity Curve"},
    'period_label': {'en': "Period"},
    'equity_value_label': {'en': "Equity Value"},
    'hwm_label': {'en': "High Water Mark"},
    'drawdown_from_hwm_label': {'en': "Drawdown from HWM"},
    'hwm_trace_label': {'en': "High Water Mark Line"},
    'plot_equity_title': {'en': "Cumulative Equity Curve"},
    'plot_xlabel_equity': {'en': "Time Period / Observation"},
    'plot_ylabel_equity_value': {'en': "Cumulative Value (Initial = 100)"},
    'qq_data_quantiles_label': {'en': "Data Quantiles"},
    'qq_hover_point': {'en': "Quantile Point"},
    'qq_hover_theoretical': {'en': "Theoretical Quantile (Normal)"},
    'qq_hover_sample': {'en': "Sample Quantile (Data)"},
    'qq_norm_ref_line_label': {'en': "Normal Reference Line"},
    'plot_qq_title': {'en': "Q-Q Plot (vs. Normal Distribution)"},
    'plot_qq_xlabel': {'en': "Theoretical Quantiles (Standard Normal)"},
    'plot_qq_ylabel': {'en': "Sample Quantiles (Return Data %)"},

    // Regression Analysis Specific
    'regression_results_title': {'en': "Regression Analysis (CAPM)"},
    'beta_label': {'en': "Beta (β)"},
    'alpha_label': {'en': "Alpha (α)"},
    'rsquared_label': {'en': "R-squared (R²)"},
    'reg_stderr_label': {'en': "Std. Error of Regression"},
    'beta_t_stat_label': {'en': "Beta t-statistic"},
    'beta_p_value_label': {'en': "Beta p-value"},
    'alpha_t_stat_label': {'en': "Alpha t-statistic"},
    'alpha_p_value_label': {'en': "Alpha p-value"},
    'capm_expected_return_label': {'en': "CAPM Expected Return"},

    'add_market_data_title': {'en': "Market Return Data (%) (for CAPM)"},
    'add_market_data_hint_short': {'en': "Count must match asset data."},
    'add_market_data_placeholder': {'en': "Enter market return values..."},
    'add_market_data_button': {'en': "Add Market Data"},
    'clear_market_data_button': {'en': "Clear Market Data"},
    'market_list_empty_option': {'en': "Market data list is empty."},
    'plot_regression_button': {'en': "Regression Plot"},

    // Benchmark Analysis Specific
    'benchmark_analysis_title': {'en': "Benchmark Analysis"},
    'add_benchmark_data_title': {'en': "Benchmark Return Data (%) (for Benchmark Analysis)"},
    'add_benchmark_data_hint_short': {'en': "Count must match asset data."},
    'add_benchmark_data_placeholder': {'en': "Enter benchmark return values..."},
    'add_benchmark_data_button': {'en': "Add Benchmark Data"},
    'clear_benchmark_data_button': {'en': "Clear Benchmark Data"},
    'benchmark_list_empty_option': {'en': "Benchmark data list is empty."},
    'tracking_error_label': {'en': "Tracking Error"},
    'information_ratio_label': {'en': "Information Ratio"},

    // Expected Market Return
    'expected_market_return_title': {'en': "Expected Market Return (% Annually):"},
    'expected_market_return_placeholder': {'en': "e.g., 8.0"},
    'expected_market_return_tooltip': {'en': "Expected return of the overall market, used for CAPM calculation."},


    // Tooltips for new metrics
    'tracking_error_tooltip': {  'en': "Standard deviation of the difference between portfolio and benchmark returns. Measures consistency of outperformance."},
    'information_ratio_tooltip': {  'en': "Active return (excess over benchmark) divided by tracking error. Measures risk-adjusted active return."},
    'capm_expected_return_tooltip': {  'en': "Expected return of the asset based on CAPM: ER = Rf + Beta * (Rm - Rf)."},
    'beta_tooltip': {  'en': "Beta measures the systematic risk of an asset relative to the overall market."},
    'alpha_tooltip': {  'en': "Alpha is the excess return of an investment after adjusting for systematic risk (beta)."},
    'rsquared_tooltip': {  'en': "R-squared (R²) is the percentage of an asset's return variability explained by market return variability."},
    'reg_stderr_tooltip': {  'en': "Standard Error of Regression shows the typical dispersion of actual data points around the fitted regression line."},
    'beta_t_stat_tooltip': {  'en': "Beta t-statistic tests the statistical significance of the beta coefficient."},
    'beta_p_value_tooltip': {  'en': "Beta p-value is the probability of observing the calculated t-statistic (or more extreme) if the true beta is zero."},
    'alpha_t_stat_tooltip': {  'en': "Alpha t-statistic tests the statistical significance of the alpha coefficient."},
    'alpha_p_value_tooltip': {  'en': "Alpha p-value is the probability of observing the calculated t-statistic for alpha (or more extreme) if the true alpha is zero."},

    // Plotting specific (Regression)
    'plot_regression_title': { 'en': 'Regression Plot (Asset vs. Market)'},
    'status_plot_error_no_paired_data': { 'en': "Paired asset and market data are required for regression plot." },
    'status_plot_error_no_regression_params': { 'en': "Regression parameters (alpha, beta) are not available for plotting." },
    'scatter_plot_legend_actual': { 'en': "Actual Returns" },
    'scatter_plot_legend_regression_line': { 'en': "Regression Line (α={alpha}%, β={beta})"}, // Added % to alpha
    'plot_axis_market_returns': { 'en': "Market Returns (%)" },
    'plot_axis_asset_returns': { 'en': "Asset Returns (%)" },

    // Equity Valuation
    'equity_valuation_title': {'en': "Equity Valuation"},
    'equity_valuation_hint': {'en': "Calculations related to equity valuation and fundamental analysis."},
    'current_dividend_label': {'en': "Current Dividend (D0):"},
    'current_dividend_tooltip': {'en': "The most recently paid dividend per share."},
    'dividend_growth_rate_label': {'en': "Dividend Growth Rate (g) %:"},
    'dividend_growth_rate_tooltip': {'en': "Expected constant growth rate of dividends."},
    'required_return_equity_label': {'en': "Required Rate of Return (r) %:"},
    'required_return_equity_tooltip': {'en': "The minimum rate of return an investor expects to receive."},
    'earnings_per_share_label': {'en': "Earnings Per Share (EPS):"},
    'earnings_per_share_tooltip': {'en': "A company's profit allocated to each outstanding share of common stock."},
    'current_share_price_label': {'en': "Current Share Price:"},
    'current_share_price_tooltip': {'en': "The current market price of one share of the company's stock."},
    'calculate_equity_button': {'en': "Calculate Equity Valuation"},
    'equity_results_title': {'en': "Equity Valuation Results"},
    'ddm_value_label': {'en': "DDM Value (P0):"},
    'ddm_value_tooltip': {'en': "Value per share using the Dividend Discount Model (D0 * (1+g) / (r-g))."},
    'ggm_value_label': {'en': "GGM Value (P0):"},
    'ggm_value_tooltip': {'en': "Value per share using the Gordon Growth Model (D1 / (r-g)). Assumes constant growth."},
    'pe_ratio_label': {'en': "P/E Ratio:"},
    'pe_ratio_tooltip': {'en': "Price-to-Earnings Ratio (Current Share Price / EPS)."},
    'equity_input_error': {'en': "Please enter valid numeric values for all equity valuation inputs."},
    'ddm_ggm_error': {'en': "Required return (r) must be greater than dividend growth rate (g) for DDM/GGM."},
    'eps_price_error': {'en': "EPS and Current Share Price must be positive for P/E Ratio."},

    // Fixed Income
    'fixed_income_title': {'en': "Fixed Income & Bonds"},
    'fixed_income_hint': {'en': "Calculations related to bonds, including yield to maturity, duration, and valuation."},
    'face_value_label': {'en': "Face Value:"},
    'face_value_tooltip': {'en': "The nominal value or par value of the bond, paid at maturity."},
    'coupon_rate_label': {'en': "Coupon Rate (% Annually):"},
    'coupon_rate_tooltip': {'en': "The annual interest rate paid on the bond's face value."},
    'years_to_maturity_label': {'en': "Years to Maturity:"},
    'years_to_maturity_tooltip': {'en': "The number of years remaining until the bond matures."},
    'market_price_bond_label': {'en': "Current Market Price:"},
    'market_price_bond_tooltip': {'en': "The current price at which the bond is trading in the market."},
    'ytm_input_label': {'en': "Yield to Maturity (YTM) %:"},
    'ytm_input_tooltip': {'en': "The total return an investor can expect to receive if they hold the bond until maturity."},
    'coupon_frequency_label': {'en': "Coupon Frequency:"},
    'coupon_frequency_tooltip': {'en': "How many times per year the coupon is paid."},
    'annual': {'en': "Annual"},
    'semi_annual': {'en': "Semi-Annual"},
    'quarterly': {'en': "Quarterly"},
    'monthly': {'en': "Monthly"},
    'calculate_bond_button': {'en': "Calculate Bond Metrics"},
    'fixed_income_results_title': {'en': "Fixed Income Results"},
    'bond_price_label': {'en': "Bond Price:"},
    'bond_price_tooltip': {'en': "The calculated present value of the bond's future cash flows."},
    'ytm_label': {'en': "Yield to Maturity (YTM):"},
    'ytm_tooltip': {'en': "The calculated yield to maturity of the bond."},
    'macaulay_duration_label': {'en': "Macaulay Duration:"},
    'macaulay_duration_tooltip': {'en': "The weighted average time until a bond's cash flows are received."},
    'modified_duration_label': {'en': "Modified Duration:"},
    'modified_duration_tooltip': {'en': "Measures the percentage change in a bond's price for a 1% change in yield."},
    'convexity_label': {'en': "Convexity:"},
    'convexity_tooltip': {'en': "Measures the curvature of a bond's price-yield relationship."},
    'plot_bond_price_yield_button': {'en': "Plot Bond Price-Yield Curve"},
    'bond_input_error': {'en': "Please enter valid numeric values for all bond inputs."},
    'bond_price_yield_plot_title': {'en': "Bond Price-Yield Relationship"},
    'plot_axis_yield': {'en': "Yield to Maturity (%)"},
    'plot_axis_bond_price': {'en': "Bond Price"},

    // Portfolio Management
    'portfolio_management_title': {'en': "Portfolio Management"},
    'portfolio_management_hint': {'en': "Calculations related to portfolio returns, risk, and correlation."},
    'add_portfolio_asset_button': {'en': "Add Asset to Portfolio"},
    'portfolio_asset_name_label': {'en': "Asset Name:"},
    'portfolio_asset_return_label': {'en': "Expected Return (%):"},
    'portfolio_asset_stddev_label': {'en': "Standard Deviation (%):"},
    'portfolio_asset_weight_label': {'en': "Weight (%):"},
    'portfolio_asset_correlation_label': {'en': "Correlation with Asset {id} (ρ):"},
    'remove_asset_button': {'en': "Remove"},
    'calculate_portfolio_button': {'en': "Calculate Portfolio Metrics"},
    'portfolio_results_title': {'en': "Portfolio Results"},
    'portfolio_expected_return_label': {'en': "Portfolio Expected Return:"},
    'portfolio_expected_return_tooltip': {'en': "The weighted average of the expected returns of the individual assets in the portfolio."},
    'portfolio_stddev_label': {'en': "Portfolio Standard Deviation:"},
    'portfolio_stddev_tooltip': {'en': "Measures the total risk of the portfolio, considering asset volatilities and their correlation."},
    'portfolio_variance_label': {'en': "Portfolio Variance:"},
    'portfolio_variance_tooltip': {'en': "The total variance of the portfolio, considering asset volatilities and their correlations."},
    'portfolio_variance_label': {'en': "Portfolio Variance:"},
    'portfolio_variance_tooltip': {'en': "The total variance of the portfolio, considering asset volatilities and their correlations."},
    'covariance_label': {'en': "Covariance (Pairwise):"}, // Keep for potential future use or if needed elsewhere
    'covariance_tooltip': {'en': "Measures the directional relationship between the returns of two assets."}, // Keep for potential future use or if needed elsewhere
    'portfolio_input_error': {'en': "Please enter valid numeric values for all portfolio inputs."},
    'portfolio_weights_error': {'en': "Asset weights must sum to 100%."},
    'correlation_range_error': {'en': "Correlation must be between -1 and 1."},
    'portfolio_min_assets_error': {'en': "Please add at least two assets to calculate portfolio metrics."},
    'portfolio_asset_removed': {'en': "Asset '{name}' removed from portfolio."},
    'portfolio_asset_added': {'en': "Asset '{name}' added to portfolio."},
    'portfolio_asset_updated': {'en': "Asset '{name}' updated."},
    'portfolio_asset_default_name': {'en': "Asset {id}"},
    'portfolio_asset_name_placeholder': {'en': "e.g., Stock A"},
    'portfolio_asset_return_placeholder': {'en': "e.g., 10"},
    'portfolio_asset_stddev_placeholder': {'en': "e.g., 15"},
    'portfolio_asset_weight_placeholder': {'en': "e.g., 50"},
    'portfolio_asset_correlation_placeholder': {'en': "e.g., 0.5"},
    'portfolio_rf_rate_label': {'en': "Risk-Free Rate (% Annually):"},


};

// English labels for the new workspace panels.
Object.assign(texts, {
    results_title:{en:'Risk & Return Summary',fa:'خلاصه ریسک و بازده'},add_market_data_hint_short:{en:'Use the same dates and order as the asset returns; the observation count must match.',fa:'تاریخ و ترتیب را با بازده دارایی یکسان کنید؛ تعداد مشاهدات باید برابر باشد.'},add_benchmark_data_hint_short:{en:'Use the same dates and order as the asset returns; the observation count must match.',fa:'تاریخ و ترتیب را با بازده دارایی یکسان کنید؛ تعداد مشاهدات باید برابر باشد.'},regression_results_title:{en:'Market Regression & CAPM',fa:'رگرسیون بازار و CAPM'},
    fundamental_nav_label:{en:'Jump to analysis section',fa:'رفتن به بخش تحلیل'},fundamental_side_nav_title:{en:'Fundamental analysis',fa:'بخش‌های تحلیل بنیادی'},fundamental_nav_brief:{en:'Research brief',fa:'خلاصه تحلیل'},fundamental_nav_peers:{en:'Company comparison',fa:'مقایسه شرکت‌ها'},fundamental_nav_dcf:{en:'Scenario DCF',fa:'ارزش‌گذاری DCF'},fundamental_nav_quality:{en:'Data quality',fa:'کیفیت داده'},fundamental_nav_import:{en:'Import data',fa:'ورود گروهی داده'},fundamental_nav_metrics:{en:'Metrics & chart',fa:'شاخص‌ها و نمودار'},
    dcf_nwc_placeholder:{en:'Derived from average receivables + inventory − payables',fa:'برآورد از میانگین دریافتنی + موجودی − پرداختنی'},
    dcf_caveat:{en:'FCFF = NOPAT + D&A − CapEx − change in operating NWC. NWC is forecast as a share of revenue; the opening proxy uses average trade receivables + inventory − trade payables when available, excluding cash and financing balances. Review seasonality, leases, taxes, and terminal value concentration.',fa:'FCFF = NOPAT + استهلاک − CapEx − تغییر سرمایه در گردش عملیاتی. سرمایه در گردش به‌صورت سهمی از فروش پیش‌بینی می‌شود؛ مبنای اولیه، در صورت وجود، میانگین دریافتنی تجاری + موجودی − پرداختنی تجاری است و وجه نقد و اقلام تأمین مالی را کنار می‌گذارد. فصل‌پذیری، اجاره، مالیات و تمرکز ارزش پایانی را بررسی کنید.'},
    return_frequency_label:{en:'Return observation frequency',fa:'تناوب مشاهدهٔ بازده'},return_frequency_note:{en:'Choose the interval represented by each return observation. Volatility and excess-return ratios are annualized; historical tail measures remain per observation.',fa:'تناوب هر مشاهدهٔ بازده را انتخاب کنید. نوسان و نسبت‌های بازده مازاد سالانه‌سازی می‌شوند؛ معیارهای دنبالهٔ تاریخی در سطح هر مشاهده باقی می‌مانند.'},return_frequency_help:{en:'Choose the interval represented by each return observation. The annual risk-free rate is converted to that interval; volatility and ratios are annualized using the selected frequency.',fa:'تناوب هر مشاهدهٔ بازده را انتخاب کنید. نرخ بدون ریسک سالانه به همان دوره تبدیل و نوسان و نسبت‌ها بر اساس تناوب انتخابی سالانه‌سازی می‌شوند.'},frequency_select:{en:'Select frequency…',fa:'تناوب را انتخاب کنید…'},return_frequency_required:{en:'Select the observation frequency before calculating annualized risk and return metrics.',fa:'برای محاسبهٔ سالانه‌شدهٔ بازده و ریسک، ابتدا تناوب مشاهده را انتخاب کنید.'},frequency_annual:{en:'Annual',fa:'سالانه'},frequency_quarterly:{en:'Quarterly',fa:'فصلی'},frequency_monthly:{en:'Monthly',fa:'ماهانه'},frequency_weekly:{en:'Weekly',fa:'هفتگی'},frequency_daily:{en:'Daily (252 trading days)',fa:'روزانه (۲۵۲ روز معاملاتی)'},
    brand_kicker:{en:'CFA ANALYTICS'}, close_button:{en:'Close'}, offline_workspace:{en:'Offline workspace'}, fundamental_workspace:{en:'FUNDAMENTAL WORKSPACE'}, manual_data_badge:{en:'Manual data'},
    financial_strategy_title:{en:'Fundamental Analysis'}, financial_guidance_heading:{en:'Interpretation & caveats'}, financial_guidance_expand:{en:'Analyst guidance'}, financial_input_hint:{en:'Use one currency and scale for all amounts. Enter income-statement flows for the reporting year and opening/closing balance-sheet values where requested. CFA-style ROA, ROE, turnover and cash-cycle ratios use average balances. Missing inputs or zero denominators display as N/A.'},
    calculate_financial_metrics:{en:'Calculate Financial Metrics'}, calculated_metrics_title:{en:'Calculated Metrics'}, cfa_framework_badge:{en:'CFA ratio framework'},
    financial_results_empty:{en:'Enter values and calculate to view the results.'}, financial_coverage_empty:{en:'Complete relevant inputs to calculate more metrics.'}, metric_chart_title:{en:'Metric Chart'}, chart_group_label:{en:'Chart group'},
    chart_returns:{en:'Returns and percentage ratios (%)'}, chart_per_share:{en:'Per-share values'}, chart_capital_structure:{en:'Capital structure and liquidity ratios'}, chart_debt_profile:{en:'Net debt and reconciliation values',fa:'بدهی خالص و مقادیر تطبیق'}, chart_debt_structure:{en:'Debt structure ratios (%)',fa:'نسبت‌های ساختار بدهی (درصد)'}, chart_cash_cycle:{en:'Cash conversion cycle (days)'}, chart_working_capital:{en:'Working capital'}, chart_investment:{en:'Investment'}, chart_profitability:{en:'Profitability and margins'}, chart_valuation:{en:'Valuation multiples'}, chart_efficiency:{en:'Operating efficiency'}, chart_cash_flow:{en:'Free cash flow'}, chart_cash_yield:{en:'Free cash flow yield'}, chart_cash_quality:{en:'Cash conversion ratios',fa:'نسبت‌های تبدیل وجه نقد'}, chart_cash_quality_percent:{en:'Cash quality ratios (%)',fa:'نسبت‌های کیفیت سود (درصد)'},
    quote_widget_kicker:{en:'OPTIONAL MARKET DATA'}, quote_widget_title:{en:'TradingView market snapshot'}, quote_on_demand_badge:{en:'On demand'}, quote_widget_hint:{en:'Fetch an indicative quote and selected market ratios by TradingView symbol. Financial statements remain user-entered.'}, quote_symbol_label:{en:'TradingView symbol'}, quote_missing_symbol:{en:'Enter an exchange-qualified symbol, for example NASDAQ:AAPL.'}, quote_fetch_button:{en:'Load quote'}, quote_use_price_button:{en:'Use last price'}, quote_idle:{en:'Manual analysis works offline. Start the local connector to load a market quote.'}, quote_server_required:{en:'Quote lookup needs the optional local Node connector. Run: node server.mjs. Manual financial analysis remains available offline.'}, quote_fetching:{en:'Requesting a quote…'}, quote_success:{en:'Snapshot loaded for {symbol}. Market data is indicative and may be delayed; supplied by the community TradingView API.'}, quote_error:{en:'Quote lookup failed: {error}'}, quote_fallback:{en:'Not reported'}, quote_field_price:{en:'Last price'}, quote_field_change:{en:'Daily change'}, quote_field_volume:{en:'Volume'}, quote_field_market_cap:{en:'Market capitalization'}, quote_field_ttm_eps:{en:'TTM EPS'}, quote_field_pe:{en:'P/E (TTM)'}, quote_field_dividend_yield:{en:'Dividend yield'}, quote_field_beta:{en:'Beta'}, quote_field_sector:{en:'Sector'}, quote_field_industry:{en:'Industry'}, quote_field_currency:{en:'Currency'}, quote_source_note:{en:'Unofficial community API · quote and selected ratios only · not investment advice'}
});

Object.assign(texts, {
    peer_workspace_kicker:{en:'MULTI-COMPANY WORKSPACE'}, peer_workspace_title:{en:'Company Financials & Peer Comparison'}, local_records_badge:{en:'Private local records'}, peer_workspace_intro:{en:'Build a multi-year financial history for each company. Compare aligned fiscal periods, inspect peer dispersion, and chart trends for any supported metric.'},
    peer_guidance_title:{en:'Analyst checks before comparing'}, peer_guidance_currency:{en:'Use the same currency and scale across companies; no FX or unit conversion is performed.'}, peer_guidance_period:{en:'Align fiscal year ends, reporting periods, and trailing versus annual data before interpreting peers.'}, peer_guidance_accounting:{en:'Check accounting policies, one-off items, leases, acquisitions, and restatements for comparability.'}, peer_guidance_direction:{en:'A higher ratio is not always better. Interpret valuation, leverage, liquidity, and cash-cycle measures in context.'}, comparison_step_one:{en:'Add each company once and set its reporting currency and scale.'}, comparison_step_two:{en:'For every company, save a consistent financial data set for each fiscal year.'}, comparison_step_three:{en:'Choose the same period label, metric family, and trend metric to compare peers.'},
    company_name_label:{en:'Company name'}, company_ticker_label:{en:'Ticker / identifier'}, company_currency_label:{en:'Reporting currency'}, company_scale_label:{en:'Financial scale'}, company_period_label:{en:'Fiscal period'}, company_select_label:{en:'Edit company'}, period_select_label:{en:'Load saved period'}, company_select_empty:{en:'Select a company'}, new_period_option:{en:'New period'}, scale_units:{en:'Units'}, scale_thousands:{en:'Thousands'}, scale_millions:{en:'Millions'},
    company_name_placeholder:{en:'e.g., Acme Corporation'}, company_ticker_placeholder:{en:'e.g., ACME'}, company_currency_placeholder:{en:'e.g., USD'}, company_period_placeholder:{en:'e.g., FY2025'},
    create_company_button:{en:'Add company'}, save_period_button:{en:'Save financial period'}, delete_company_button:{en:'Delete selected company'}, export_company_data_button:{en:'Export backup'}, import_company_data_button:{en:'Import backup'}, company_data_empty:{en:'No companies saved yet. Add a company to start a peer set.'},
    peer_analysis_kicker:{en:'PEER & TREND ANALYSIS'}, peer_analysis_title:{en:'Compare companies and track performance'}, compare_period_label:{en:'Comparison period'}, no_periods_option:{en:'No periods available'}, compare_group_label:{en:'Metric family'}, compare_group_dividend:{en:'Per share & shareholder returns'}, compare_group_profitability:{en:'Profitability'}, compare_group_valuation:{en:'Valuation'}, compare_group_leverage:{en:'Leverage'}, compare_group_liquidity:{en:'Liquidity'}, compare_group_efficiency:{en:'Efficiency & cash cycle'}, compare_group_cashflow:{en:'Cash flow & investment'}, compare_trend_metric_label:{en:'Trend chart metric'}, comparison_empty:{en:'Add at least one company and save a financial period to begin comparing.'}, peer_trend_chart_title:{en:'Multi-year peer trends'},
    comparison_metric_heading:{en:'Metric'}, comparison_unit_heading:{en:'Unit'}, comparison_company_heading:{en:'Company'}, comparison_unavailable:{en:'N/A'}, comparison_no_metric_data:{en:'No company has data for this metric and period.'}, comparison_currency_warning:{en:'Currency or scale is missing or differs among selected peers ({items}). Monetary values and per-share figures are not directly comparable until normalized.'}, comparison_period_note:{en:'Flow-based metrics and valuation multiples are annualized to 12 months using each saved period length. Compare period-end prices with care; forecast, assurance, and consolidation differences are flagged.'},
    report_basis_kicker:{en:'REPORT BASIS & QUALITY'}, report_basis_title:{en:'Period metadata and assurance'}, report_basis_hint:{en:'Record period length, statement scope, and assurance so comparisons remain on a like-for-like basis.'}, report_basis_caveat:{en:'A matching year label does not make periods comparable if their length, consolidation scope, accounting basis, or assurance differs.'}, period_months_label:{en:'Period length (months)'}, reporting_basis_label:{en:'Statement scope'}, basis_consolidated:{en:'Consolidated'}, basis_separate:{en:'Separate'}, assurance_status_label:{en:'Report status'}, assurance_audited:{en:'Audited'}, assurance_reviewed:{en:'Reviewed'}, assurance_unaudited:{en:'Unaudited'}, assurance_forecast:{en:'Management forecast'}, audit_opinion_label:{en:'Audit opinion'}, opinion_unmodified:{en:'Unmodified'}, opinion_qualified:{en:'Qualified'}, opinion_adverse:{en:'Adverse'}, opinion_disclaimer:{en:'Disclaimer'}, opinion_na:{en:'Not applicable / not stated'}, report_metadata_missing:{en:'Report metadata missing or differs across companies; verify period length, scope, and assurance before interpreting the peer set.'}, report_metadata_unknown:{en:'Report metadata missing'}, period_meta_badge:{en:'{months} mo · {basis} · {status} · {opinion}'},
    peer_insight_coverage:{en:'Reporting coverage'}, peer_insight_median:{en:'Peer median'}, peer_insight_spread:{en:'Peer range'}, peer_insight_values:{en:'{count} of {total} companies reported this metric for {period}.'}, peer_insight_median_text:{en:'The peer median for {metric} is {value}.'}, peer_insight_spread_text:{en:'Reported values span {low} to {high}. This is dispersion, not a quality ranking.'}, peer_insight_no_data:{en:'No comparable values are available for the selected metric.'}, peer_yoy_label:{en:'Change versus prior saved period'}, peer_yoy_value:{en:'{company}: {metric} changed by {change} versus {period}.'}, peer_yoy_missing:{en:'Save at least two periods for a company to see its trend.'},
    company_create_name_required:{en:'Enter a company name before adding it.'}, company_currency_required:{en:'Enter the reporting currency, such as USD, EUR, or IRR.'}, company_invalid_numeric:{en:'Correct or clear every non-numeric financial input before saving this period.'}, company_created:{en:'Company profile created. Add a fiscal period and save its financial data.'}, company_select_required:{en:'Select or add a company first.'}, company_period_required:{en:'Enter a fiscal period label, for example FY2025.'}, company_period_saved:{en:'Financial data saved for {company} · {period}.'}, company_delete_confirm:{en:'Delete {company} and all of its saved periods from this browser?'}, company_deleted:{en:'Company and saved periods deleted.'}, company_no_data_export:{en:'There are no company records to export.'}, company_export_done:{en:'Company data backup downloaded.'}, company_import_invalid:{en:'The selected file is not a valid company-data backup.'}, company_import_done:{en:'Imported {count} company records.'}, company_storage_error:{en:'Could not save company data in this browser. Check available local storage.'}, company_delete_button:{en:'Delete'}, company_cancel_button:{en:'Cancel'}, prefill_codal_report_button:{en:'Start from attached Codal report metadata'}, report_metadata_prefilled:{en:'Report profile fields are prefilled from the attached audited filing. Statement amounts are blank and must be entered from the PDF.'},
    trend_axis_period:{en:'Fiscal period'}, trend_axis_value:{en:'Calculated value'}, trend_no_data:{en:'Save company financial periods to draw multi-year trends.'}, comparison_scale_units_note:{en:'Values shown in {currency} · {scale}'}, yoy_change_caption:{en:'vs {period}'},
    advice_eps:{en:'Compare EPS growth with share-count changes; buybacks can raise EPS without equivalent operating growth.'}, advice_dps:{en:'Check dividend per share against free cash flow and payout sustainability.'}, advice_totalReturn:{en:'Total return combines price movement and dividends for the selected price period; reinvestment and timing are not modeled.'}, advice_roe:{en:'ROE can rise because equity shrank or leverage increased. Review ROA, debt, and average equity alongside it.'}, advice_dividendYield:{en:'A high yield may reflect a falling share price or an unsustainable dividend; review coverage and history.'}, advice_dpr:{en:'A high payout leaves less earnings retained. Interpret it against sector maturity and cash generation.'}, advice_pe:{en:'P/E is sensitive to cyclicality and negative or unusually low earnings; compare normalized earnings where possible.'}, advice_pb:{en:'P/B is most informative for asset-heavy businesses and depends on accounting book values.'}, advice_ps:{en:'P/S ignores margins and capital intensity; compare only with similar business models.'}, advice_de:{en:'Debt-to-equity depends on the debt definition and equity base; negative or very small equity makes it hard to interpret.'}, advice_debtRatio:{en:'Debt ratio uses total liabilities, including operating obligations; do not confuse it with interest-bearing debt.'}, advice_interestCoverage:{en:'Coverage below 1× means EBIT does not cover reported interest expense; assess cash flows and debt maturities.'}, advice_evEbitda:{en:'EV/EBITDA is not a cash-flow yield and omits capital expenditure, taxes, and working-capital needs.'}, advice_grossMargin:{en:'Gross margin reflects pricing and direct input costs; product mix and accounting classification matter.'}, advice_operatingMargin:{en:'Operating margin captures operating costs before financing and tax; normalize one-off items.'}, advice_netMargin:{en:'Net margin includes financing and tax effects, so compare capital structures and tax regimes carefully.'}, advice_roa:{en:'ROA depends on the asset base and business model; use average assets and check asset revaluations.'}, advice_assetTurnover:{en:'Asset turnover is model-dependent; compare asset-light firms with similar peers.'}, advice_inventoryTurnover:{en:'Very high turnover can signal efficient stock management or insufficient inventory and lost sales.'}, advice_receivablesTurnover:{en:'Review credit terms, factoring, and revenue quality when interpreting receivables turnover.'}, advice_workingCapital:{en:'Working capital is an absolute amount and should be scaled to revenue, assets, and seasonality.'}, advice_currentRatio:{en:'A high current ratio is not automatically safer; inspect receivable and inventory quality.'}, advice_quickRatio:{en:'Quick ratio excludes inventory but may still include slow or doubtful receivables.'}, advice_cashRatio:{en:'Cash ratio is a narrow liquidity measure; interpret alongside committed credit and upcoming obligations.'}, advice_dpo:{en:'Longer payment periods can support cash flow but may signal supplier stress or strained terms.'}, advice_dio:{en:'Long inventory days can indicate slow-moving stock, seasonality, or deliberate safety buffers.'}, advice_dso:{en:'Long collection periods can indicate looser credit, customer mix, or collection problems.'}, advice_ccc:{en:'A shorter cash conversion cycle can release cash, but compare the business model and supplier terms.'}, advice_capex:{en:'The balance-sheet change method is approximate and can be distorted by acquisitions, disposals, FX, and revaluations.'}, advice_fcf:{en:'FCF here equals CFO less estimated CapEx; confirm the company’s cash-flow classification and recurring investment needs.'}, advice_fcfYield:{en:'FCF yield is sensitive to share price and CapEx estimates; use a normalized multi-year FCF.'}, advice_pfcf:{en:'P/FCF is not meaningful when free cash flow is negative or unusually volatile.'}, advice_cfoNetIncome:{en:'Compare CFO with net income over several periods; working-capital timing can move this ratio sharply.'}
});

Object.assign(texts, {
    financial_input_hint:{en:'Use one currency and scale for all financial amounts. Enter share count in that same scale (for example, shares in millions when financials are in millions), but enter share prices per actual share. Use one reporting year for income and cash-flow statements; opening and closing balance-sheet values are used for average-balance ratios.'},
    trend_currency_warning:{en:'This metric uses currency units. The saved peer data use different currencies or scales, so the mixed-unit trend chart is hidden until the inputs are normalized.'}, peer_insight_advice:{en:'Analyst interpretation'}, company_records_loaded:{en:'{company}: {count} saved financial periods.'},
    company_import_confirm:{en:'Restoring this backup will replace all company records currently saved in this browser.'}, company_unsaved_status:{en:'Unsaved changes · save this period before leaving it.'}, company_unsaved_confirm:{en:'Discard unsaved changes to this company period?'}, company_copy_success:{en:'Current analysis values copied into the company period editor.'}, company_load_missing:{en:'Select a company and a saved fiscal period first.'}, copy_current_financials_button:{en:'Copy current analysis inputs'}, load_company_period_button:{en:'Load selected period into analysis'}, company_unsaved_discard_button:{en:'Discard changes'}, company_shares_scale_guidance:{en:'Enter share count in the same scale as statement amounts (for example, shares in millions when financials are in millions). Enter prices per actual share.'},
    metadata_months_invalid:{en:'Period length must be a whole number from 1 to 60 months.'}, annualized_metrics_note:{en:'Flow-based metrics and valuation multiples use a 12-month equivalent; reported balances and period-end prices are not annualized.'}
});
Object.assign(texts, { quote_widget_kicker:{en:'OPTIONAL LIVE DATA'}, quote_widget_hint:{en:'Look up an indicative TradingView market snapshot directly from this browser when online. Financial statement analysis and charts remain available offline.'}, quote_idle:{en:'Manual analysis works offline. Load quotes only when you have an internet connection.'}, quote_server_required:{en:'This browser could not reach the optional TradingView service. Check your internet connection or continue with manual inputs.'}, quote_no_data:{en:'No quote data was returned for this symbol.'}, quote_source_note:{en:'Unofficial TradingView community screener · may be delayed · no financial statements or investment advice'} });

// Persian localization for the full user interface (kept local for offline use).
Object.assign(texts,{quality_period_reported:{en:'flow items shown as reported for this period; peer comparisons remain annualized',fa:'اقلام جریانی به شکل گزارش‌شده این دوره نمایش داده می‌شوند؛ مقایسه همتایان همچنان سالانه‌سازی می‌شود'},analyst_stale:{en:'Inputs changed · recalculate the statement analysis',fa:'ورودی‌ها تغییر کرده‌اند · تحلیل صورت‌های مالی را دوباره محاسبه کنید'},analyst_basis_warning:{en:'Flow metrics are shown for a {months}-month period and should not be compared directly with an annual WACC.',fa:'شاخص‌های جریانی برای دوره {months}ماهه نمایش داده شده‌اند و نباید مستقیماً با WACC سالانه مقایسه شوند.'},dcf_stale:{en:'Assumptions or financial inputs changed · rerun the DCF model',fa:'مفروضات یا ورودی‌های مالی تغییر کرده‌اند · مدل DCF را دوباره اجرا کنید'},dcf_capex_sales:{en:'CapEx / sales (%)',fa:'مخارج سرمایه‌ای / فروش (٪)'},dcf_da_sales:{en:'D&A / sales (%)',fa:'استهلاک / فروش (٪)'},dcf_invalid:{en:'DCF unavailable. Confirm positive sales and shares, valid debt, cash and tax inputs, nonnegative CapEx and D&A intensity assumptions, working-capital data, and WACC greater than terminal growth.',fa:'DCF در دسترس نیست. فروش و تعداد سهام مثبت، بدهی و وجه نقد و مالیات معتبر، شدت غیرمنفی CapEx و استهلاک، داده سرمایه در گردش و WACC بزرگ‌تر از رشد پایدار را بررسی کنید.'},dcf_share_warning:{en:'Enter a positive share count; current share price is needed only to calculate implied change.',fa:'تعداد سهام مثبت لازم است؛ قیمت جاری سهم فقط برای محاسبه تغییر ضمنی نیاز است.'}});
Object.assign(texts,{report_source_missing:{en:'Source document, page/note, or local save timestamp is missing for one or more peer records.',fa:'برای یک یا چند رکورد همتا، سند منبع، صفحه/یادداشت یا زمان ذخیره محلی ثبت نشده است.'}});
const faTexts = {
    brand_kicker: 'تحلیل‌گری مالی CFA', close_button: 'بستن', app_title: 'تحلیلگر پیشرفته ریسک و بازده', results_title: 'نتایج تحلیل', advanced_metrics_title: 'شاخص‌های پیشرفته CFA',
    tab_asset_analysis: 'تحلیل دارایی', tab_equity_valuation: 'ارزش‌گذاری سهام', tab_fixed_income: 'درآمد ثابت', tab_portfolio_management: 'مدیریت پرتفوی', tab_financial_strategy: 'تحلیل بنیادی',
    lang_select_label: 'زبان', calculate_portfolio_button: 'محاسبه شاخص‌های پرتفوی', regression_results_title: 'تحلیل رگرسیون (CAPM)', max_gain_tooltip: 'بیشترین بازده منفرد مشاهده‌شده در داده‌ها.', variance_tooltip: 'میانگین مجذور فاصله بازده‌ها از میانگین.', skewness_tooltip: 'عدم تقارن توزیع بازده؛ چولگی منفی معمولاً به معنای دنباله زیان بلندتر است.', cv_tooltip: 'ریسک به‌ازای هر واحد بازده؛ برای مقایسه دارایی‌هایی با بازده میانگین متفاوت.', mdd_tooltip: 'بزرگ‌ترین افت از اوج ارزش تجمعی تا کف بعدی.', mdd_period_tooltip: 'طول دوره افت حداکثر، از اوج تا بازیابی یا پایان داده.', offline_workspace: 'محیط تحلیل آفلاین', fundamental_workspace: 'میزکار تحلیل بنیادی', manual_data_badge: 'ورود دستی داده', cfa_framework_badge: 'چارچوب نسبت‌های CFA',
    data_count: 'تعداد داده‌ها', mean_label: 'میانگین حسابی بازده', geo_mean_label: 'میانگین هندسی (CAGR)', std_dev_label: 'انحراف معیار (ریسک)', downside_dev_label: 'انحراف معیار نزولی', variance_label: 'واریانس', cv_label: 'ضریب تغییرات (CV)', mdd_label: 'حداکثر افت سرمایه', mdd_period_label: 'دوره حداکثر افت', skewness_label: 'چولگی', kurtosis_label: 'کشیدگی مازاد', var_label: 'ارزش در معرض ریسک (۵٪)', var_95_label: 'سود تاریخی (۹۵٪)', cvar_label: 'کسری مورد انتظار (۵٪)', max_gain_label: 'بیشترین بازده', sharpe_label: 'نسبت شارپ', sortino_label: 'نسبت سورتینو', omega_label: 'نسبت امگا', treynor_ratio_label: 'نسبت ترینور', calmar_ratio_label: 'نسبت کالمار', jensen_alpha_label: 'آلفای جنسن', m2_measure_label: 'معیار M²', beta_label: 'بتا', alpha_label: 'آلفا', rsquared_label: 'ضریب تعیین (R²)', capm_expected_return_label: 'بازده مورد انتظار CAPM', reg_stderr_label: 'خطای استاندارد رگرسیون', beta_t_stat_label: 'آماره t بتا', beta_p_value_label: 'مقدار p بتا', alpha_t_stat_label: 'آماره t آلفا', alpha_p_value_label: 'مقدار p آلفا', tracking_error_label: 'خطای پیگیری', information_ratio_label: 'نسبت اطلاعاتی',
    add_data_title: 'داده بازده دارایی (%)', add_data_hint: '(چند مقدار را با ویرگول، فاصله یا خط جدید جدا کنید)', add_data_placeholder: 'بازده دارایی را وارد کنید…', add_button: 'افزودن', edit_delete_title: 'ویرایش یا حذف داده دارایی', edit_placeholder: 'مقدار جدید', save_button: 'ذخیره', delete_button: 'حذف', rf_title: 'نرخ بدون ریسک (سالانه، ٪):', rf_placeholder: 'مثلاً ۲٫۵', data_list_title: 'فهرست داده‌های دارایی', clear_list_button: 'پاک‌کردن فهرست', calculate_button: 'محاسبه شاخص‌ها', plot_hist_button: 'نمودار هیستوگرام', plot_box_button: 'نمودار جعبه‌ای', plot_equity_button: 'منحنی ارزش تجمعی', plot_qq_button: 'نمودار Q-Q', plot_regression_button: 'نمودار رگرسیون', save_results_button_unified: 'ذخیره نتایج', drop_zone_prompt_dedicated_asset: 'فایل CSV، Excel یا TXT را اینجا بکشید و رها کنید', or_divider_text: 'یا', plot_modal_title: 'نمودار', list_empty_option: 'فهرست خالی است', select_option: 'انتخاب کنید…', data_option_format: 'داده {index} ({value}٪)',
    add_market_data_title: 'بازده بازار (%) برای CAPM', add_market_data_hint_short: 'تعداد مقادیر باید با داده دارایی برابر باشد.', add_market_data_placeholder: 'مقادیر بازده بازار را وارد کنید…', add_market_data_button: 'افزودن داده بازار', clear_market_data_button: 'پاک‌کردن داده بازار', market_list_empty_option: 'فهرست داده بازار خالی است', expected_market_return_title: 'بازده مورد انتظار بازار (سالانه، ٪):', expected_market_return_placeholder: 'مثلاً ۸', benchmark_analysis_title: 'تحلیل شاخص معیار', add_benchmark_data_title: 'بازده شاخص معیار (%)', add_benchmark_data_hint_short: 'تعداد مقادیر باید با داده دارایی برابر باشد.', add_benchmark_data_placeholder: 'مقادیر بازده شاخص معیار را وارد کنید…', add_benchmark_data_button: 'افزودن داده معیار', clear_benchmark_data_button: 'پاک‌کردن داده معیار', benchmark_list_empty_option: 'فهرست داده معیار خالی است',
    equity_valuation_title: 'ارزش‌گذاری سهام', equity_valuation_hint: 'محاسبات ارزش‌گذاری سهام و تحلیل بنیادی.', current_dividend_label: 'سود نقدی فعلی هر سهم (D₀):', dividend_growth_rate_label: 'نرخ رشد سود نقدی (g، ٪):', required_return_equity_label: 'بازده مورد انتظار سهام (r، ٪):', earnings_per_share_label: 'سود هر سهم (EPS):', current_share_price_label: 'قیمت فعلی سهم:', calculate_equity_button: 'محاسبه ارزش سهام', equity_results_title: 'نتایج ارزش‌گذاری سهام', ddm_value_label: 'ارزش مدل تنزیل سود نقدی (DDM):', ggm_value_label: 'ارزش مدل رشد گوردون (GGM):', pe_ratio_label: 'نسبت قیمت به سود (P/E):',
    fixed_income_title: 'اوراق با درآمد ثابت', fixed_income_hint: 'تحلیل ارزش‌گذاری اوراق، بازده تا سررسید و حساسیت نرخ بهره.', face_value_label: 'ارزش اسمی:', coupon_rate_label: 'نرخ کوپن سالانه (٪):', years_to_maturity_label: 'سال تا سررسید:', market_price_bond_label: 'قیمت روز اوراق:', ytm_input_label: 'بازده تا سررسید (YTM، ٪):', coupon_frequency_label: 'دفعات پرداخت کوپن:', annual: 'سالانه', semi_annual: 'شش‌ماهه', quarterly: 'فصلی', monthly: 'ماهانه', calculate_bond_button: 'محاسبه شاخص‌های اوراق', fixed_income_results_title: 'نتایج اوراق با درآمد ثابت', bond_price_label: 'قیمت اوراق:', ytm_label: 'بازده تا سررسید (YTM):', macaulay_duration_label: 'دیرش مکالی:', modified_duration_label: 'دیرش تعدیل‌شده:', convexity_label: 'محدبیت:', plot_bond_price_yield_button: 'رسم منحنی قیمت و بازده',
    portfolio_management_title: 'مدیریت پرتفوی', portfolio_management_hint: 'تحلیل بازده، ریسک و همبستگی دارایی‌های پرتفوی.', portfolio_results_title: 'نتایج پرتفوی', add_portfolio_asset_button: 'افزودن دارایی به پرتفوی', portfolio_expected_return_label: 'بازده مورد انتظار پرتفوی:', portfolio_stddev_label: 'انحراف معیار پرتفوی:', portfolio_variance_label: 'واریانس پرتفوی:',
    financial_strategy_title: 'تحلیل بنیادی', financial_input_hint: 'برای همه مبالغ از ارز و مقیاس یکسان استفاده کنید. جریان‌های صورت سود و زیان را برای دوره گزارش و مانده‌های آغاز و پایان دوره را در فیلدهای مربوط وارد کنید. در نسبت‌های ROA، ROE، گردش و چرخه نقد از مانده متوسط استفاده می‌شود؛ ورودی ناقص یا مخرج صفر به‌صورت نامعتبر نمایش داده می‌شود.', calculate_financial_metrics: 'محاسبه شاخص‌های بنیادی', calculated_metrics_title: 'شاخص‌های محاسبه‌شده', financial_results_empty: 'مقادیر را وارد و محاسبه کنید تا نتایج نمایش داده شوند.', financial_coverage_empty:'برای محاسبه شاخص‌های بیشتر، ورودی‌های مربوط را تکمیل کنید.', metric_chart_title: 'نمودار شاخص‌ها', chart_group_label: 'گروه نمودار', chart_returns: 'بازده و نسبت‌های درصدی', chart_per_share: 'شاخص‌های هر سهم', chart_capital_structure: 'ساختار سرمایه و نقدینگی', chart_cash_cycle: 'چرخه تبدیل وجه نقد (روز)', chart_working_capital: 'سرمایه در گردش', chart_investment: 'سرمایه‌گذاری', chart_profitability: 'سودآوری و حاشیه سود', chart_valuation: 'ضرایب ارزش‌گذاری', chart_efficiency: 'کارایی عملیاتی', chart_cash_flow: 'جریان نقد آزاد', chart_cash_yield: 'بازده جریان نقد آزاد', chart_cash_quality: 'کیفیت سود و جریان نقد', quote_widget_kicker:'داده بازار اختیاری', quote_widget_title:'نمای بازار TradingView', quote_on_demand_badge:'دریافت درخواستی', quote_widget_hint:'با نماد TradingView، قیمت تقریبی و چند نسبت بازار را دریافت کنید. صورت‌های مالی را همچنان خودتان وارد می‌کنید.', quote_symbol_label:'نماد TradingView', quote_missing_symbol:'نماد را همراه با نام بورس وارد کنید؛ برای نمونه NASDAQ:AAPL.', quote_fetch_button:'دریافت قیمت', quote_use_price_button:'استفاده از آخرین قیمت', quote_idle:'تحلیل دستی آفلاین کار می‌کند. برای دریافت قیمت بازار، رابط محلی را اجرا کنید.', quote_server_required:'دریافت قیمت به اتصال‌دهنده اختیاری Node نیاز دارد. دستور node server.mjs را اجرا کنید. تحلیل دستی آفلاین در دسترس است.', quote_fetching:'در حال دریافت قیمت…', quote_success:'نمای بازار {symbol} دریافت شد. داده تقریبی است و از API جامعه‌محور TradingView می‌آید.', quote_error:'دریافت قیمت ناموفق بود: {error}', quote_fallback:'گزارش نشده', quote_field_price:'آخرین قیمت', quote_field_change:'تغییر روزانه', quote_field_volume:'حجم', quote_field_market_cap:'ارزش بازار', quote_field_ttm_eps:'سود هر سهم (TTM)', quote_field_pe:'نسبت P/E (TTM)', quote_field_dividend_yield:'بازده سود تقسیمی', quote_field_beta:'بتا', quote_field_sector:'بخش', quote_field_industry:'صنعت', quote_field_currency:'ارز', quote_source_note:'دادهٔ screener جامعه‌محور TradingView · احتمال تأخیر · بدون صورت‌های مالی یا توصیه سرمایه‌گذاری',
    status_ready: 'آماده.', quote_price_applied:'قیمت دریافت‌شده در ورودی قیمت سهم قرار گرفت.', status_financial_calculated: 'شاخص‌های بنیادی محاسبه شدند.', status_calculating: 'در حال محاسبه شاخص‌ها…', status_calc_done: 'محاسبات کامل شد.', status_calc_error: 'خطا در محاسبه: {error}', status_plot_done: 'نمودار آماده شد.', status_plot_error: 'خطا در رسم نمودار: {error}', status_need_data_calc: 'داده دارایی کافی نیست (حداقل ۲ مقدار لازم است).', status_need_data_plot: 'داده‌ای برای رسم نمودار وجود ندارد.', status_no_results: 'نتیجه‌ای برای ذخیره وجود ندارد.', status_select_edit: 'ابتدا یک داده دارایی را برای ویرایش انتخاب کنید.', status_select_delete: 'ابتدا یک داده دارایی را برای حذف انتخاب کنید.', value_invalid: 'نامعتبر',
    mean_tooltip: 'میانگین حسابی بازده‌های واردشده.', geo_mean_tooltip: 'میانگین هندسی با درنظرگرفتن اثر ترکیب بازده‌ها؛ مناسب سنجش رشد بلندمدت.', std_dev_tooltip: 'پراکندگی بازده‌ها حول میانگین؛ معیاری از ریسک کل.', downside_dev_tooltip: 'پراکندگی بازده‌های پایین‌تر از صفر؛ معیاری از ریسک نزولی.', variance_tooltip: 'میانگین مجذور انحراف از میانگین.', cv_tooltip: 'ریسک به‌ازای هر واحد بازده؛ برای مقایسه دارایی‌هایی با میانگین بازده متفاوت.', mdd_tooltip: 'بزرگ‌ترین افت از اوج ارزش تجمعی تا کف بعدی.', mdd_period_tooltip: 'طول دوره افت حداکثر، از اوج تا بازیابی یا پایان داده.', skewness_tooltip: 'عدم تقارن توزیع بازده؛ چولگی منفی نشان‌دهنده دنباله زیان بلندتر است.', kurtosis_tooltip: 'کشیدگی مازاد؛ مقدار مثبت می‌تواند نشان‌دهنده احتمال بیشتر رخدادهای حدی باشد.', var_tooltip: 'صدک پنجم بازده‌های تاریخی؛ برآورد زیان در دنباله توزیع.', var_95_tooltip: 'صدک نودوپنجم بازده‌های تاریخی.', cvar_tooltip: 'میانگین بازده در بدترین پنج درصد مشاهدات.', sharpe_tooltip: 'بازده مازاد نسبت به نرخ بدون ریسک به‌ازای هر واحد ریسک کل.', sortino_tooltip: 'بازده مازاد نسبت به نرخ بدون ریسک به‌ازای هر واحد ریسک نزولی.', omega_tooltip: 'نسبت بازده‌های بالاتر از آستانه به بازده‌های پایین‌تر از آستانه.', rf_tooltip: 'نرخ سالانه سرمایه‌گذاری با ریسک بسیار پایین؛ برای محاسبه بازده مازاد استفاده می‌شود.', treynor_ratio_tooltip: 'بازده مازاد به‌ازای هر واحد ریسک سیستماتیک (بتا).', calmar_ratio_tooltip: 'بازده سالانه‌شده تقسیم بر قدرمطلق حداکثر افت سرمایه.', jensen_alpha_tooltip: 'بازده مازاد بر بازده پیش‌بینی‌شده توسط CAPM.', m2_measure_tooltip: 'بازده تعدیل‌شده با ریسک که به نوسان بازار مقیاس شده است.',
    current_dividend_tooltip: 'آخرین سود نقدی پرداخت‌شده به‌ازای هر سهم.', dividend_growth_rate_tooltip: 'نرخ رشد مورد انتظار سود نقدی.', required_return_equity_tooltip: 'حداقل بازده مورد انتظار سرمایه‌گذار از سهام.', earnings_per_share_tooltip: 'سود خالص تخصیص‌یافته به هر سهم عادی.', current_share_price_tooltip: 'قیمت بازار فعلی هر سهم.', ddm_value_tooltip: 'ارزش هر سهم با تنزیل سود نقدی مورد انتظار.', ggm_value_tooltip: 'مدل گوردون با فرض رشد ثابت سود نقدی.', pe_ratio_tooltip: 'قیمت سهم تقسیم بر سود هر سهم.',
    face_value_tooltip: 'مبلغ اسمی بازپرداخت‌شده در سررسید.', coupon_rate_tooltip: 'نرخ سالانه پرداخت کوپن نسبت به ارزش اسمی.', years_to_maturity_tooltip: 'زمان باقی‌مانده تا سررسید اوراق.', market_price_bond_tooltip: 'قیمت معاملاتی فعلی اوراق.', ytm_input_tooltip: 'بازده سالانه مورد انتظار در صورت نگهداری اوراق تا سررسید.', coupon_frequency_tooltip: 'تعداد پرداخت کوپن در هر سال.', bond_price_tooltip: 'ارزش فعلی جریان‌های نقدی آتی اوراق.', ytm_tooltip: 'نرخ بازده داخلی جریان‌های نقدی اوراق تا سررسید.', macaulay_duration_tooltip: 'میانگین موزون زمان دریافت جریان‌های نقدی اوراق.', modified_duration_tooltip: 'تقریب درصد تغییر قیمت اوراق برای تغییر یک‌درصدی بازده.', convexity_tooltip: 'انحنای رابطه قیمت اوراق و بازده.', portfolio_expected_return_tooltip: 'میانگین موزون بازده مورد انتظار دارایی‌های پرتفوی.', portfolio_stddev_tooltip: 'ریسک کل پرتفوی با درنظرگرفتن همبستگی دارایی‌ها.', portfolio_variance_tooltip: 'مجذور انحراف معیار پرتفوی.', beta_tooltip: 'حساسیت بازده دارایی نسبت به بازده بازار.', alpha_tooltip: 'بازده مازاد پس از تعدیل ریسک سیستماتیک.', rsquared_tooltip: 'سهم تغییرات بازده دارایی که با تغییرات بازار توضیح داده می‌شود.', expected_market_return_tooltip: 'برآورد بازده کل بازار برای محاسبات CAPM.', capm_expected_return_tooltip: 'بازده مورد انتظار بر اساس رابطه CAPM.', reg_stderr_tooltip: 'پراکندگی معمول نقاط حول خط رگرسیون.', beta_t_stat_tooltip: 'آزمون معناداری آماری ضریب بتا.', beta_p_value_tooltip: 'احتمال مشاهده این آماره در صورت صفر بودن بتای واقعی.', alpha_t_stat_tooltip: 'آزمون معناداری آماری ضریب آلفا.', alpha_p_value_tooltip: 'احتمال مشاهده این آماره در صورت صفر بودن آلفای واقعی.', tracking_error_tooltip: 'انحراف معیار تفاوت بازده دارایی و شاخص معیار.', information_ratio_tooltip: 'بازده فعال تقسیم بر خطای پیگیری؛ معیاری از عملکرد فعال تعدیل‌شده با ریسک.'
};

// Extended bilingual tooltips used across static and dynamically rendered controls.
const detailedHelpTexts = {
    meta_description:{en:'An offline-first financial analysis workspace for equity valuation, fixed income, portfolio risk, company comparison, financial ratios, and scenario DCF.',fa:'محیط تحلیل مالی آفلاین‌محور برای ارزش‌گذاری سهام، درآمد ثابت، ریسک پرتفوی، مقایسه شرکت‌ها، نسبت‌های مالی و DCF سناریویی.'},
    help_general_input:{en:'Enter the value exactly as reported and keep its currency, unit scale, and reporting period consistent with related inputs. The result is only as reliable as these source assumptions.',fa:'مقدار را مطابق گزارش وارد کنید و ارز، مقیاس واحد و دوره گزارش را با ورودی‌های مرتبط یکسان نگه دارید. اعتبار نتیجه به همین مفروضات و منبع داده وابسته است.'},
    help_section_asset_analysis:{en:'Analyze the observation series as periodic returns. Add asset, market, and benchmark observations in matching order and frequency; annualization and regression results depend on that alignment. Historical risk statistics do not forecast future losses.',fa:'سری داده را به‌عنوان بازده‌های دوره‌ای تحلیل کنید. مشاهدات دارایی، بازار و معیار را با ترتیب و تناوب یکسان وارد کنید؛ سالانه‌سازی و رگرسیون به این هم‌ترازی وابسته‌اند. ریسک تاریخی پیش‌بینی زیان آینده نیست.'},
    help_section_equity_valuation:{en:'Estimate equity value with dividend-based models and market multiples. DDM/Gordon growth is highly sensitive to required return and long-run growth; the model is invalid when growth is at or above required return. Compare assumptions with sustainable payouts and market evidence.',fa:'ارزش سهام را با مدل‌های سود تقسیمی و ضرایب بازار برآورد کنید. DDM و رشد گوردون به نرخ بازده موردنیاز و رشد بلندمدت بسیار حساس‌اند و در رشد مساوی یا بیشتر از نرخ بازده معتبر نیستند. مفروضات را با سود تقسیمی پایدار و شواهد بازار تطبیق دهید.'},
    help_section_fixed_income:{en:'Review bond price, yield, duration, and convexity using the selected coupon frequency. Yield-to-maturity assumes scheduled cash flows and reinvestment at the calculated yield; it is not a realized return forecast. Duration and convexity are local price-sensitivity estimates.',fa:'قیمت، بازده، دیرش و محدبیت اوراق را با تناوب کوپن انتخاب‌شده بررسی کنید. بازده تا سررسید، پرداخت‌های برنامه‌ریزی‌شده و سرمایه‌گذاری مجدد با همان نرخ را فرض می‌کند و پیش‌بینی بازده تحقق‌یافته نیست. دیرش و محدبیت، برآورد حساسیت موضعی قیمت‌اند.'},
    help_section_portfolio_management:{en:'Combine expected returns, volatilities, weights, and pairwise correlations. Weights should reflect a common valuation date and sum to 100% for a fully invested portfolio. Correlations are assumptions or historical estimates and can change sharply under stress.',fa:'بازده‌های موردانتظار، نوسان‌ها، وزن‌ها و همبستگی‌های دوتایی را ترکیب کنید. برای پرتفوی کاملاً سرمایه‌گذاری‌شده، وزن‌ها باید تاریخ ارزش‌گذاری مشترک داشته و جمعشان ۱۰۰٪ باشد. همبستگی‌ها فرض یا برآورد تاریخی‌اند و در تنش می‌توانند به‌سرعت تغییر کنند.'},
    help_section_financial_strategy:{en:'Enter aligned financial-statement data to calculate profitability, leverage, liquidity, efficiency, per-share, and cash-flow measures. Keep currency and scale consistent; use opening and closing balances for average-balance ratios. Review source notes, accounting policy, and period basis before interpretation.',fa:'داده‌های هم‌دوره صورت‌های مالی را برای محاسبه سودآوری، اهرم، نقدینگی، کارایی، شاخص‌های هر سهم و جریان نقد وارد کنید. ارز و مقیاس را یکسان نگه دارید و برای نسبت‌های مبتنی بر میانگین از مانده ابتدا و انتهای دوره استفاده کنید. پیش از تفسیر، یادداشت منبع، رویه حسابداری و مبنای دوره را بررسی کنید.'},
    help_section_analyst_dashboard:{en:'This summary surfaces selected return, cash-conversion, leverage, and valuation diagnostics from the current inputs. Signals prioritize analyst review; they are not a credit rating, audit opinion, or investment recommendation.',fa:'این خلاصه، چند عارضه‌یابی منتخب بازده، تبدیل وجه نقد، اهرم و ارزش‌گذاری را از ورودی‌های فعلی نشان می‌دهد. سیگنال‌ها فقط اولویت بررسی تحلیل‌گر را مشخص می‌کنند و رتبه اعتباری، نظر حسابرس یا توصیه سرمایه‌گذاری نیستند.'},
    help_section_company_comparison:{en:'Compare saved company-period records only after aligning fiscal year-end, statement scope, currency, scale, accounting basis, and period length. Missing metadata or non-comparable periods can make peer rankings misleading; no currency conversion is applied.',fa:'سوابق ذخیره‌شده شرکت‌ها را پس از هم‌ترازی پایان سال مالی، دامنه صورت‌ها، ارز، مقیاس، مبنای حسابداری و طول دوره مقایسه کنید. فراداده ناقص یا دوره‌های ناهمسان می‌تواند رتبه‌بندی همتایان را گمراه‌کننده کند؛ تبدیل ارز انجام نمی‌شود.'},
    help_section_dcf:{en:'The scenario DCF projects FCFF from editable operating drivers and discounts it at WACC. Terminal value can dominate enterprise value, so inspect the sensitivity grid and terminal-value share. Results are assumption-driven scenarios, not a price target.',fa:'DCF سناریویی، FCFF را با محرک‌های عملیاتی قابل‌ویرایش پیش‌بینی و با WACC تنزیل می‌کند. ارزش پایانی ممکن است بخش عمده ارزش بنگاه را تشکیل دهد؛ جدول حساسیت و سهم ارزش پایانی را بررسی کنید. خروجی، سناریوی مبتنی بر مفروضات است نه هدف قیمت.'},
    help_section_quality:{en:'These checks flag selected missing, inconsistent, or unusual relationships in the entered statements. A pass only means the configured test did not flag an issue; it does not validate source accuracy or detect every accounting problem.',fa:'این کنترل‌ها برخی روابط ناقص، ناسازگار یا نامتعارف صورت‌های واردشده را علامت می‌زنند. عبور فقط یعنی آزمون تعریف‌شده موردی نیافته است؛ دقت منبع را تأیید نمی‌کند و همه مسائل حسابداری را کشف نمی‌کند.'},
    help_section_workbook:{en:'Import one record per company, period, and field. Preview validation before applying; confirm units, reporting currency, field names, and duplicate-period treatment. Imported records are stored locally in this browser.',fa:'برای هر شرکت، دوره و قلم یک رکورد وارد کنید. پیش از ثبت، اعتبارسنجی پیش‌نمایش را ببینید و واحدها، ارز گزارش، نام فیلدها و نحوه برخورد با دوره تکراری را بررسی کنید. رکوردهای واردشده به‌صورت محلی در همین مرورگر ذخیره می‌شوند.'},
    help_fin_shares_outstanding:{en:'Use weighted-average diluted shares for per-share earnings where available; use the share count basis that matches the dividend and price inputs. Keep the share scale consistent with statement amounts when dividing totals by shares.',fa:'در صورت دسترسی، برای سود هر سهم از میانگین موزون سهام رقیق‌شده استفاده کنید؛ مبنای سهام را با سود تقسیمی و قیمت هماهنگ کنید. هنگام تقسیم اقلام کل بر تعداد سهام، مقیاس سهام را با مقیاس صورت‌ها یکسان نگه دارید.'},
    help_fin_net_income:{en:'Use net income attributable to common shareholders for EPS and equity-return analysis when available. Identify discontinued operations, noncontrolling interests, and material one-offs; the model does not normalize them automatically.',fa:'در صورت دسترسی، برای EPS و بازده حقوق صاحبان سهام از سود خالص قابل انتساب به سهام‌داران عادی استفاده کنید. عملیات متوقف‌شده، منافع فاقد کنترل و اقلام بااهمیت غیرتکراری را مشخص کنید؛ مدل آن‌ها را خودکار نرمال نمی‌کند.'},
    help_fin_dividends_paid:{en:'Enter total cash dividends for the same period and shareholder basis as net income. Special dividends and preferred distributions can distort DPS and payout ratios unless treated consistently.',fa:'کل سود نقدی پرداختی همان دوره و همان مبنای سود خالص را وارد کنید. سودهای ویژه و پرداخت به سهام ممتاز، اگر یکسان‌سازی نشوند، DPS و نسبت پرداخت را منحرف می‌کنند.'},
    help_fin_current_share_price:{en:'Enter the market price per actual share as of a clearly identified date. Do not scale the price with statement units; use a price date reasonably aligned with the financial period and valuation date.',fa:'قیمت بازار هر سهم واقعی را با تاریخ مشخص وارد کنید. قیمت را همراه با مقیاس صورت‌های مالی تغییر ندهید؛ تاریخ قیمت باید تا حد امکان با دوره مالی و تاریخ ارزش‌گذاری هماهنگ باشد.'},
    help_fin_initial_share_price:{en:'Use the beginning-of-period price per share for total-return calculations. Adjust for splits and other corporate actions, and align the price interval with the dividend measurement period.',fa:'برای بازده کل، قیمت هر سهم در ابتدای دوره را وارد کنید. تعدیلات تجزیه سهم و سایر اقدامات شرکتی را لحاظ و فاصله قیمت را با دوره اندازه‌گیری سود تقسیمی هماهنگ کنید.'},
    help_fin_shareholders_equity:{en:'Use common shareholders’ equity attributable to owners at period end for point-in-time leverage measures. For ROE and turnover analysis, the model may require both opening and closing balances to form an average.',fa:'برای نسبت‌های اهرمی مقطعی، حقوق صاحبان سهام عادی قابل انتساب به مالکان در پایان دوره را وارد کنید. برای ROE و گردش، مدل ممکن است هر دو مانده ابتدا و انتهای دوره را برای محاسبه میانگین لازم داشته باشد.'},
    help_fin_total_liabilities:{en:'Enter total liabilities from the same balance-sheet date as total assets and equity. This may include operating liabilities; distinguish it from interest-bearing debt when evaluating financing leverage.',fa:'مجموع بدهی‌ها را از همان تاریخ ترازنامه دارایی‌ها و حقوق صاحبان سهام وارد کنید. این رقم می‌تواند بدهی‌های عملیاتی را شامل شود؛ هنگام تحلیل اهرم تأمین مالی آن را از بدهی بهره‌دار تفکیک کنید.'},
    help_fin_total_assets_prior:{en:'Opening total assets support average-asset ratios and period alignment. Use the balance immediately before the reporting period, on the same consolidation and accounting basis as closing assets.',fa:'دارایی کل ابتدای دوره برای نسبت‌های مبتنی بر میانگین و هم‌ترازی دوره به‌کار می‌رود. مانده بلافاصله پیش از دوره را با همان مبنای تلفیق و حسابداری دارایی پایان دوره وارد کنید.'},
    help_fin_total_assets:{en:'Enter closing total assets from the balance sheet. Confirm consistency with liabilities and equity, and assess acquisitions, disposals, impairments, and revaluations that affect period-to-period ratios.',fa:'دارایی کل پایان دوره را از ترازنامه وارد کنید. سازگاری با بدهی و حقوق صاحبان سهام را کنترل و اثر تملک، واگذاری، کاهش ارزش و تجدید ارزیابی بر نسبت‌های دوره‌ای را بررسی کنید.'},
    help_fin_shareholders_equity_prior:{en:'Opening common equity is used to calculate average equity for ROE. Adjusted or restated comparatives should be used when available so numerator and denominator reflect a consistent entity and period.',fa:'حقوق صاحبان سهام عادی ابتدای دوره برای محاسبه میانگین حقوق در ROE استفاده می‌شود. در صورت دسترسی، ارقام مقایسه‌ای تعدیل‌شده یا تجدیدارائه‌شده را به‌کار ببرید تا صورت و مخرج مبنای یکسان داشته باشند.'},
    help_fin_interest_bearing_debt:{en:'Include funded borrowings that carry interest and document lease-liability treatment. Avoid mixing trade payables or provisions into this financing balance; match the date with cash for net-debt analysis.',fa:'تسهیلات و استقراض‌های بهره‌دار را وارد و نحوه برخورد با بدهی اجاره را مستند کنید. حساب‌های پرداختنی یا ذخایر را با بدهی تأمین مالی مخلوط نکنید؛ تاریخ آن را برای بدهی خالص با وجه نقد هماهنگ کنید.'},
    help_fin_interest_bearing_debt_prior:{en:'Opening interest-bearing debt supports average-debt and trend analysis. Apply the same inclusion policy for leases, current maturities, and other borrowings as the closing balance.',fa:'بدهی بهره‌دار ابتدای دوره برای تحلیل میانگین بدهی و روند به‌کار می‌رود. سیاست شمول اجاره، سررسید جاری و سایر استقراض‌ها را با مانده پایان دوره یکسان اعمال کنید.'},
    help_fin_short_term_interest_bearing_debt:{en:'Enter the current portion of funded, interest-bearing obligations due within the operating/current classification used by the issuer. Compare with cash and near-term maturities when assessing liquidity.',fa:'بخش جاری تعهدات تأمین مالی بهره‌دار را مطابق طبقه‌بندی جاری ناشر وارد کنید. برای سنجش نقدینگی آن را با وجه نقد و سررسیدهای نزدیک مقایسه کنید.'},
    help_fin_long_term_interest_bearing_debt:{en:'Enter funded interest-bearing obligations classified as non-current. Review maturity concentration, floating-rate exposure, covenants, and lease inclusion in the source notes.',fa:'تعهدات تأمین مالی بهره‌دار طبقه‌بندی‌شده به‌عنوان بلندمدت را وارد کنید. تمرکز سررسید، نرخ شناور، شروط و شمول اجاره را در یادداشت‌های منبع بررسی کنید.'},
    help_fin_ebit:{en:'Use operating profit before interest and tax for interest-coverage analysis. Check whether unusual items, capitalized interest, or issuer-specific subtotals make EBIT inconsistent across periods.',fa:'برای پوشش بهره از سود عملیاتی پیش از بهره و مالیات استفاده کنید. بررسی کنید اقلام غیرعادی، بهره سرمایه‌ای‌شده یا زیرجمع‌های اختصاصی ناشر، EBIT را بین دوره‌ها ناسازگار نکرده باشد.'},
    help_fin_interest_expense:{en:'Use interest expense corresponding to the same period as EBIT. Review capitalized interest, lease interest, and net-interest presentation; coverage can be distorted if these are treated inconsistently.',fa:'هزینه بهره همان دوره EBIT را وارد کنید. بهره سرمایه‌ای‌شده، بهره اجاره و نمایش خالص هزینه بهره را بررسی کنید؛ برخورد ناسازگار می‌تواند نسبت پوشش را منحرف کند.'},
    help_fin_tax_rate:{en:'Enter the effective tax rate as a percentage, using tax expense divided by pretax income when meaningful. Normalize discrete tax benefits and losses; an unusual effective rate may not represent a sustainable rate.',fa:'نرخ مؤثر مالیات را به درصد وارد کنید؛ در صورت معناداربودن از هزینه مالیات تقسیم بر سود پیش از مالیات استفاده کنید. مزایای مالیاتی مقطعی و زیان‌ها را بررسی کنید؛ نرخ غیرعادی الزاماً پایدار نیست.'},
    help_fin_current_assets:{en:'Enter balance-sheet current assets at period end. For quick or cash ratios, inventory and restricted cash may need separate treatment; confirm classification and liquidity from the notes.',fa:'دارایی‌های جاری پایان دوره را وارد کنید. برای نسبت سریع یا نقد، موجودی و وجه نقد محدودشده ممکن است به برخورد جداگانه نیاز داشته باشند؛ طبقه‌بندی و نقدشوندگی را از یادداشت‌ها بررسی کنید.'},
    help_fin_current_liabilities:{en:'Enter current liabilities at period end using the issuer’s stated classification. Review current debt maturities, contract liabilities, and seasonality before treating the balance as near-term cash claims.',fa:'بدهی‌های جاری پایان دوره را مطابق طبقه‌بندی ناشر وارد کنید. سررسید جاری بدهی، بدهی قراردادی و فصل‌پذیری را پیش از تلقی آن به‌عنوان مطالبه نقدی کوتاه‌مدت بررسی کنید.'},
    help_fin_cash_equivalents:{en:'Use cash and cash equivalents available to the entity; consider restricted balances and trapped cash separately. Match the date and currency to debt before calculating net debt.',fa:'وجه نقد و معادل‌های نقد در دسترس شرکت را وارد کنید؛ موجودی محدودشده یا محبوس را جداگانه بررسی کنید. پیش از محاسبه بدهی خالص، تاریخ و ارز را با بدهی هماهنگ کنید.'},
    help_fin_cogs:{en:'Use cost of revenue/COGS for the same reporting period and accounting scope as sales. Inventory-cost capitalization, write-downs, and gross-versus-net presentation affect turnover and DIO.',fa:'بهای تمام‌شده فروش همان دوره و دامنه حسابداری فروش را وارد کنید. سرمایه‌ای‌کردن بهای موجودی، کاهش ارزش و نمایش ناخالص یا خالص بر گردش موجودی و DIO اثر دارد.'},
    help_fin_accounts_payable:{en:'Use trade accounts payable at the period-end date for DPO. Exclude unrelated accruals where possible and use opening and closing balances to reduce distortion from seasonality or payment timing.',fa:'حساب‌های پرداختنی تجاری پایان دوره را برای DPO وارد کنید. تا حد امکان تعهدات متفرقه را کنار بگذارید و برای کاهش اثر فصل‌پذیری یا زمان پرداخت از مانده ابتدا و پایان استفاده کنید.'},
    help_fin_inventory:{en:'Use inventory net of relevant provisions at the reporting date for DIO. Check valuation method, obsolescence reserves, consignment stock, and seasonal build before comparing companies.',fa:'موجودی پس از ذخایر مربوط در تاریخ گزارش را برای DIO وارد کنید. روش ارزش‌گذاری، ذخیره اقلام راکد، موجودی امانی و انباشت فصلی را پیش از مقایسه شرکت‌ها بررسی کنید.'},
    help_fin_sales:{en:'Enter revenue for the same period as net income, COGS, and cash flows. Use the issuer’s consistent gross/net revenue presentation and align acquisitions, discontinued operations, and fiscal-period length.',fa:'درآمد همان دوره سود خالص، بهای تمام‌شده و جریان‌های نقد را وارد کنید. مبنای ناخالص/خالص ناشر را ثابت نگه دارید و تملک‌ها، عملیات متوقف‌شده و طول دوره مالی را هم‌تراز کنید.'},
    help_fin_accounts_receivable:{en:'Use trade receivables net of expected-credit-loss allowances at period end for DSO. Inspect factoring, contract assets, and revenue-recognition changes; these can make DSO incomparable.',fa:'مطالبات تجاری پس از ذخیره زیان اعتباری موردانتظار را برای DSO وارد کنید. فروش مطالبات، دارایی قراردادی و تغییر شناسایی درآمد را بررسی کنید؛ این اقلام می‌توانند DSO را غیرقابل‌مقایسه کنند.'},
    help_fin_fixed_assets_prior:{en:'Opening net fixed assets anchor the balance-sheet CapEx estimate. Acquisitions, disposals, foreign exchange, impairment, and revaluation can break the simple roll-forward relationship.',fa:'دارایی ثابت خالص ابتدای دوره مبنای برآورد ترازنامه‌ای CapEx است. تملک، واگذاری، ارز، کاهش ارزش و تجدید ارزیابی می‌توانند رابطه ساده تغییر مانده را مختل کنند.'},
    help_fin_fixed_assets_current:{en:'Enter closing net fixed assets on a consistent property, plant, and equipment basis. Do not mix right-of-use assets or construction in progress inconsistently across the opening and closing balances.',fa:'دارایی ثابت خالص پایان دوره را با مبنای یکسان اموال، ماشین‌آلات و تجهیزات وارد کنید. دارایی حق استفاده یا پروژه در جریان را بین مانده‌های ابتدا و پایان به‌طور ناسازگار مخلوط نکنید.'},
    help_fin_depreciation_current:{en:'Enter depreciation and amortization for the period used in CapEx estimation and FCFF. Confirm scope and whether impairment or disposal charges are excluded; these are not automatically separated.',fa:'استهلاک و amortization همان دوره را برای برآورد CapEx و FCFF وارد کنید. دامنه و حذف کاهش ارزش یا هزینه واگذاری را بررسی کنید؛ مدل آن‌ها را خودکار تفکیک نمی‌کند.'},
    help_fin_reported_capex:{en:'Enter cash capital expenditure as a positive spend from the cash-flow statement. Confirm purchases of property/equipment and software treatment, and keep acquisitions separate unless your definition explicitly includes them.',fa:'مخارج سرمایه‌ای نقدی را به‌صورت عدد مثبت از صورت جریان نقد وارد کنید. خرید دارایی و برخورد با نرم‌افزار را بررسی و تملک‌ها را جدا نگه دارید مگر آنکه تعریف شما صریحاً شاملشان باشد.'},
    help_fin_operating_cash_flow:{en:'Use net cash from operating activities for the same reporting period. Review interest/dividend classification, working-capital swings, and non-cash adjustments before interpreting cash conversion.',fa:'خالص وجه نقد حاصل از فعالیت‌های عملیاتی همان دوره را وارد کنید. طبقه‌بندی بهره و سود تقسیمی، نوسان سرمایه در گردش و تعدیلات غیرنقدی را پیش از تفسیر تبدیل سود به وجه نقد بررسی کنید.'},
    help_field_general:{en:'Use the same unit scale, currency, and period basis as the other inputs in this analysis. Prefer reported source values and document any adjustment or estimate.',fa:'مقیاس واحد، ارز و مبنای دوره را با سایر ورودی‌های تحلیل یکسان نگه دارید. مقادیر گزارش‌شده را ترجیح دهید و هر تعدیل یا برآورد را مستند کنید.'},
    help_dcf_growth:{en:'Annual revenue growth assumption applied across the explicit forecast. Consider industry maturity, pricing, volume, capacity, and nominal inflation; avoid extrapolating a short high-growth period indefinitely.',fa:'فرض رشد سالانه درآمد در دوره پیش‌بینی صریح است. بلوغ صنعت، قیمت، حجم، ظرفیت و تورم اسمی را بسنجید و رشد کوتاه‌مدت بالا را بی‌پایان تعمیم ندهید.'},
    help_dcf_margin:{en:'Forecast EBIT margin before interest and tax. Anchor it in historical normalized margins and an explicit operating bridge; changes in mix, utilization, and exceptional costs matter.',fa:'حاشیه EBIT پیش از بهره و مالیات را پیش‌بینی کنید. آن را به حاشیه تاریخی نرمال‌شده و پل عملیاتی روشن متصل کنید؛ ترکیب فروش، بهره‌برداری از ظرفیت و هزینه‌های استثنایی مهم‌اند.'},
    help_dcf_wacc:{en:'Weighted average cost of capital used to discount FCFF. Keep it consistent with cash-flow currency, inflation basis, and capital structure; it must exceed terminal growth for a finite Gordon terminal value.',fa:'هزینه متوسط موزون سرمایه برای تنزیل FCFF است. آن را با ارز جریان نقد، مبنای تورم و ساختار سرمایه سازگار کنید؛ برای ارزش پایانی گوردون محدود باید از رشد پایدار بیشتر باشد.'},
    help_dcf_terminal:{en:'Perpetual growth assumption after the explicit forecast. It should reflect a mature long-run rate consistent with the model currency and economy; small changes can materially alter terminal value.',fa:'فرض رشد دائمی پس از دوره پیش‌بینی صریح است. باید نرخ بلندمدت بلوغ‌یافته و سازگار با ارز مدل و اقتصاد باشد؛ تغییر کوچک آن می‌تواند ارزش پایانی را به‌طور معنادار تغییر دهد.'},
    help_dcf_horizon:{en:'Number of explicit forecast years. Use a horizon long enough for margins and reinvestment to approach a defensible steady state, while avoiding unsupported precision.',fa:'تعداد سال‌های پیش‌بینی صریح است. افقی انتخاب کنید که حاشیه سود و سرمایه‌گذاری مجدد به وضعیت پایدار قابل‌دفاع برسند، اما از دقت‌نمایی بی‌پشتوانه پرهیز کنید.'},
    help_dcf_tax:{en:'Tax rate applied to forecast operating profit to estimate NOPAT. Use a normalized marginal cash-tax assumption where appropriate; statutory, effective, and cash rates can differ.',fa:'نرخ مالیات برای برآورد NOPAT از سود عملیاتی پیش‌بینی‌شده است. در صورت اقتضا فرض نرمال‌شده نرخ نقدی نهایی را به‌کار ببرید؛ نرخ قانونی، مؤثر و نقدی می‌توانند متفاوت باشند.'},
    help_dcf_nwc_sales:{en:'Operating net working capital as a share of revenue. This ratio drives the change in NWC deducted from FCFF; exclude financing cash/debt and review seasonality and business mix.',fa:'سرمایه در گردش خالص عملیاتی به‌عنوان سهمی از درآمد است. این نسبت تغییر NWC کاهنده FCFF را می‌سازد؛ وجه نقد و بدهی تأمین مالی را کنار بگذارید و فصل‌پذیری و ترکیب کسب‌وکار را بررسی کنید.'},
    help_dcf_capex_sales:{en:'Capital expenditure intensity relative to revenue, applied to forecast sales. Include maintenance and growth investment consistently; a low assumption can overstate cash available to investors.',fa:'شدت مخارج سرمایه‌ای نسبت به درآمد است که روی فروش پیش‌بینی‌شده اعمال می‌شود. سرمایه‌گذاری نگهداری و رشد را یکسان لحاظ کنید؛ فرض پایین می‌تواند وجه نقد در دسترس سرمایه‌گذاران را بیش‌برآورد کند.'},
    help_dcf_da_sales:{en:'Depreciation and amortization intensity relative to revenue. D&A is added back to NOPAT but is not free cash flow; compare it with asset life and required replacement CapEx.',fa:'شدت استهلاک نسبت به درآمد است. استهلاک به NOPAT اضافه می‌شود اما جریان نقد آزاد نیست؛ آن را با عمر دارایی و CapEx جایگزینی موردنیاز مقایسه کنید.'},
    help_dcf_risk_free:{en:'Risk-free rate used in CAPM cost of equity. Match the currency and duration to the valuation cash flows and valuation horizon; use a current, defensible government benchmark.',fa:'نرخ بدون ریسک برای هزینه حقوق صاحبان سهام در CAPM است. ارز و سررسید را با جریان‌های نقد و افق ارزش‌گذاری هماهنگ و از معیار دولتی به‌روز و قابل‌دفاع استفاده کنید.'},
    help_dcf_beta:{en:'Levered equity beta estimates systematic equity risk relative to the market. Check regression window, benchmark, leverage changes, and whether a bottom-up peer beta is more representative.',fa:'بتای اهرمی، ریسک سیستماتیک سهام نسبت به بازار را برآورد می‌کند. پنجره رگرسیون، معیار بازار، تغییر اهرم و مناسب‌بودن بتای همتایان پایین‌به‌بالا را بررسی کنید.'},
    help_dcf_erp:{en:'Expected market risk premium over the risk-free rate used in CAPM. State the market and estimation method; premiums are assumptions, not directly observable constants.',fa:'صرف ریسک موردانتظار بازار نسبت به نرخ بدون ریسک در CAPM است. بازار و روش برآورد را مشخص کنید؛ صرف ریسک فرض است و ثابت مشاهده‌پذیر مستقیم نیست.'},
    help_dcf_cost_debt:{en:'Pre-tax marginal borrowing cost for the debt component of WACC. Prefer a market-based current rate for comparable maturity and credit risk, not merely historical coupon expense.',fa:'هزینه نهایی استقراض پیش از مالیات برای بخش بدهی WACC است. نرخ جاری بازار با سررسید و ریسک اعتباری مشابه را ترجیح دهید، نه صرفاً هزینه کوپن تاریخی.'},
    help_rf_rate:{en:'Annual risk-free rate used to convert asset returns into excess returns and in CAPM. Enter a percentage and align the tenor, currency, and observation date with the return series.',fa:'نرخ سالانه بدون ریسک برای محاسبه بازده مازاد و CAPM است. درصد وارد کنید و سررسید، ارز و تاریخ مشاهده را با سری بازده هماهنگ کنید.'},
    help_market_return:{en:'Annual expected return for the market proxy in CAPM. It must represent the same market and currency as the asset; the implied premium is market return minus risk-free rate.',fa:'بازده سالانه موردانتظار نماینده بازار در CAPM است. بازار و ارز باید با دارایی یکسان باشد؛ صرف ضمنی بازار برابر بازده بازار منهای نرخ بدون ریسک است.'},
    help_portfolio_return:{en:'Expected annual return assumption for this asset, entered on the same horizon as all other assets and the risk-free rate. It is an input estimate, not a forecast generated by the model.',fa:'فرض بازده سالانه موردانتظار این دارایی است؛ افق آن را با سایر دارایی‌ها و نرخ بدون ریسک یکسان کنید. این مقدار برآورد ورودی است و مدل آن را پیش‌بینی نمی‌کند.'},
    help_portfolio_stddev:{en:'Annualized standard deviation assumption for this asset. Use the same return frequency and annualization convention across assets; volatility is not a complete measure of tail risk.',fa:'فرض انحراف معیار سالانه‌شده این دارایی است. تناوب بازده و روش سالانه‌سازی را بین دارایی‌ها یکسان کنید؛ نوسان معیار کامل ریسک دنباله‌ای نیست.'},
    help_portfolio_weight:{en:'Portfolio allocation weight for this asset. Enter weights in a consistent percentage or decimal convention as indicated by the field, and verify the total weight sums to the intended invested exposure.',fa:'وزن تخصیص این دارایی در پرتفوی است. درصد یا اعشار را مطابق واحد فیلد و یکسان وارد و جمع وزن‌ها را با میزان مواجهه سرمایه‌گذاری‌شده موردنظر تطبیق دهید.'},
    help_portfolio_correlation:{en:'Pairwise correlation between two asset return series, bounded from −1 to +1. Use aligned observations and a representative regime; diversification estimates weaken when correlations rise in market stress.',fa:'همبستگی دوتایی دو سری بازده بین ۱− و ۱+ است. مشاهدات هم‌تراز و رژیم نماینده استفاده کنید؛ در تنش بازار ممکن است همبستگی‌ها افزایش یابند و مزیت تنوع کاهش یابد.'},
    help_company_currency:{en:'Three-letter or clearly identified reporting currency for the saved statements. Peer currency conversion is not performed; mixed currencies make monetary comparisons and trends invalid.',fa:'ارز گزارش صورت‌ها را به‌صورت کد سه‌حرفی یا نام روشن ثبت کنید. ارز همتایان تبدیل نمی‌شود؛ ارزهای متفاوت مقایسه اقلام پولی و روند را نامعتبر می‌کنند.'},
    help_company_scale:{en:'Unit scale used for all monetary statement values in this company-period, such as units, thousands, or millions. Share count should use a consistent scale for per-share calculations.',fa:'مقیاس همه اقلام پولی این دوره شرکت را مانند واحد، هزار یا میلیون ثبت کنید. تعداد سهام نیز برای محاسبه هر سهم باید مقیاس سازگار داشته باشد.'},
    help_company_period:{en:'Use a stable fiscal-period label such as FY2025 or 2025-Q2. Comparisons align exact period labels; align fiscal year ends and period lengths before comparing companies.',fa:'برچسب ثابت دوره مالی مانند FY2025 یا 2025-Q2 وارد کنید. مقایسه برچسب‌های دقیق دوره را هم‌تراز می‌کند؛ پیش از مقایسه، پایان سال مالی و طول دوره را هماهنگ کنید.'},
    help_company_source:{en:'Record the original report filename and page/note reference so figures can be traced to source evidence. Selecting a PDF records its filename only; the application does not extract or verify figures.',fa:'نام فایل گزارش اصلی و شماره صفحه/یادداشت را برای ردیابی ارقام ثبت کنید. انتخاب PDF فقط نام فایل را ذخیره می‌کند؛ برنامه ارقام را استخراج یا تأیید نمی‌کند.'},
    help_company_assurance:{en:'Identify whether the saved figures are audited, reviewed, unaudited, or management forecasts. Assurance level changes evidence quality; it does not guarantee absence of error.',fa:'مشخص کنید ارقام حسابرسی‌شده، بررسی‌شده، حسابرسی‌نشده یا پیش‌بینی مدیریت‌اند. سطح اطمینان کیفیت شواهد را تغییر می‌دهد اما نبود خطا را تضمین نمی‌کند.'},
    help_company_scope:{en:'Record consolidated or separate statements. Do not compare a consolidated group with a parent-only statement unless the scope difference is intentionally analyzed.',fa:'صورت تلفیقی یا جداگانه را ثبت کنید. صورت تلفیقی گروه را با صورت جداگانه شرکت اصلی مقایسه نکنید مگر آنکه تفاوت دامنه عمداً تحلیل شود.'},
    help_company_restated:{en:'Mark periods when comparative figures were restated. Use the latest comparable restated series consistently and document material accounting changes or reclassifications.',fa:'دوره‌هایی را که ارقام مقایسه‌ای تجدیدارائه شده‌اند علامت بزنید. سری تجدیدارائه‌شده قابل‌مقایسه را یکسان به‌کار ببرید و تغییر حسابداری یا طبقه‌بندی بااهمیت را مستند کنید.'},
    help_compare_period:{en:'Select the same fiscal-period label across the peer set. A common label alone does not ensure aligned fiscal year ends, duration, seasonality, or trailing/annual basis.',fa:'برچسب دوره مالی یکسان را برای مجموعه همتا انتخاب کنید. برچسب مشترک به‌تنهایی پایان سال مالی، طول دوره، فصل‌پذیری یا مبنای سالانه/شناور یکسان را تضمین نمی‌کند.'},
    help_compare_metric:{en:'Choose a metric family or trend measure that is economically comparable across the selected firms. Verify denominator definitions and sign conventions before ranking values.',fa:'خانواده شاخص یا معیار روندی را انتخاب کنید که از نظر اقتصادی بین شرکت‌ها قابل‌مقایسه باشد. پیش از رتبه‌بندی، تعریف مخرج و قرارداد علامت را بررسی کنید.'},
    help_chart_group:{en:'Select a related family of calculated metrics for the chart. Bars can have different economic meanings and scales; compare like units and inspect the table for exact values.',fa:'خانواده مرتبط شاخص‌های محاسبه‌شده را برای نمودار انتخاب کنید. ستون‌ها ممکن است معنا و مقیاس اقتصادی متفاوتی داشته باشند؛ واحدهای مشابه را مقایسه و مقدار دقیق را در جدول ببینید.'},
    help_quote_symbol:{en:'Enter the exchange-qualified symbol expected by the optional TradingView screener connector, for example NASDAQ:AAPL. Quotes require internet access and may be delayed; all manual analysis remains available offline.',fa:'نماد همراه با نام بورس را مطابق اتصال‌دهنده اختیاری screener تریدینگ‌ویو وارد کنید؛ مانند NASDAQ:AAPL. دریافت قیمت به اینترنت نیاز دارد و ممکن است با تأخیر باشد؛ تحلیل دستی آفلاین در دسترس می‌ماند.'},
    help_help_icon:{en:'Open the detailed definition, calculation basis, interpretation guidance, and key comparability limitations for this item.',fa:'تعریف کامل، مبنای محاسبه، راهنمای تفسیر و محدودیت‌های اصلی مقایسه این مورد را باز می‌کند.'}
};

// Persian messages used by confirmations, file operations, and chart labels.
Object.assign(faTexts, {
    error_title: 'خطا',
    bond_input_error:'لطفاً همه ورودی‌های اوراق را با مقادیر عددی معتبر تکمیل کنید.', bond_price_yield_plot_title:'رابطه قیمت اوراق و بازده تا سررسید',
    boxplot_hover_max:'بیشینه (کران بالا)', boxplot_hover_mean:'میانگین', boxplot_hover_median:'میانه', boxplot_hover_min:'کمینه (کران پایین)', boxplot_hover_q1:'چارک اول (صدک ۲۵)', boxplot_hover_q3:'چارک سوم (صدک ۷۵)', boxplot_hover_stats:'آمار توصیفی', boxplot_hover_std:'انحراف معیار',
    cancel_button:'انصراف', clear_list_confirm:'کل فهرست {listName} پاک شود؟', cleared_title:'پاک شد', col_return:'بازده (٪)', confirm_clear_text:'این عمل قابل بازگشت نیست.', confirm_delete_text:'از حذف این داده مطمئن هستید؟', correlation_range_error:'همبستگی باید بین ۱- و ۱+ باشد.',
    ddm_ggm_error:'برای محاسبه DDM و GGM، بازده مورد انتظار باید از نرخ رشد سود نقدی بیشتر باشد.', deleted_title:'حذف شد', drawdown_from_hwm_label:'افت از اوج تاریخی', eps_price_error:'EPS و قیمت سهم باید برای نسبت P/E مثبت باشند.', equity_curve_label:'منحنی ارزش پرتفوی', equity_input_error:'لطفاً همه ورودی‌های ارزش‌گذاری سهام را با اعداد معتبر تکمیل کنید.', equity_value_label:'ارزش پرتفوی',
    error_lib_missing:'کتابخانه لازم ({lib}) برای این نمودار در دسترس نیست.', excel_sheet_raw_data_title:'داده خام', export_excel:'فایل اکسل (.xlsx)', export_format_title:'قالب خروجی را انتخاب کنید', export_txt:'فایل متنی (.txt)', hist_hover_value:'مقدار', hist_label_main:'داده بازده', hwm_label:'اوج تاریخی ارزش', hwm_trace_label:'خط اوج تاریخی',
    info_title:'اطلاعات', invalid_format_msg:'قالب فایل نامعتبر است. از CSV، Excel یا TXT استفاده کنید.', noDataPlot:'داده‌ای برای رسم نمودار وجود ندارد.', ok_button:'تأیید', period_label:'دوره', plotFailed:'رسم نمودار ناموفق بود.',
    plot_axis_asset_returns:'بازده دارایی (٪)', plot_axis_bond_price:'قیمت اوراق', plot_axis_market_returns:'بازده بازار (٪)', plot_axis_yield:'بازده تا سررسید (٪)', plot_box_title:'نمودار جعبه‌ای بازده‌ها', plot_equity_title:'منحنی ارزش تجمعی', plot_gain_label:'سود تاریخی ۹۵٪: {val}٪', plot_hist_title:'توزیع بازده‌ها', plot_kde_label:'برآورد چگالی هسته‌ای (KDE)', plot_mean_val_label:'میانگین: {val}٪', plot_median_val_label:'میانه: {val}٪', plot_norm_label:'برازش نرمال (μ={mean}٪، σ={std}٪)', plot_qq_title:'نمودار Q-Q در برابر توزیع نرمال', plot_qq_xlabel:'چارک‌های نظری (نرمال استاندارد)', plot_qq_ylabel:'چارک‌های نمونه (درصد بازده)', plot_regression_title:'رگرسیون بازده دارایی و بازار', plot_var_label:'VaR تاریخی ۵٪: {val}٪', plot_xlabel:'بازده (٪) / مقدار', plot_xlabel_equity:'دوره زمانی / مشاهده', plot_ylabel_box:'مقادیر بازده (٪)', plot_ylabel_equity_value:'ارزش تجمعی (مقدار آغازین = ۱۰۰)', plot_ylabel_hist_density:'چگالی',
    portfolio_asset_correlation_placeholder:'مثلاً ۰٫۵', portfolio_asset_default_name:'دارایی {id}', portfolio_asset_removed:'دارایی حذف شد.', portfolio_asset_return_placeholder:'مثلاً ۱۰', portfolio_asset_stddev_placeholder:'مثلاً ۱۵', portfolio_asset_weight_placeholder:'مثلاً ۵۰', portfolio_input_error:'لطفاً ورودی‌های پرتفوی را بررسی کنید؛ مقادیر باید عددی و معتبر باشند.', portfolio_min_assets_error:'برای محاسبه پرتفوی حداقل دو دارایی لازم است.', portfolio_weights_error:'مجموع وزن‌ها باید برابر ۱۰۰٪ باشد.',
    qq_data_quantiles_label:'چارک‌های داده', qq_hover_point:'نقطه چارکی', qq_hover_sample:'چارک نمونه (داده)', qq_hover_theoretical:'چارک نظری (نرمال)', qq_norm_ref_line_label:'خط مرجع نرمال', scatter_plot_legend_actual:'بازده‌های مشاهده‌شده', scatter_plot_legend_regression_line:'خط رگرسیون (α={alpha}٪، β={beta})',
    status_data_deleted:'داده دارایی {index} ({val}٪) حذف شد.', status_delete_index_error:'خطا هنگام حذف داده (شماره ردیف نامعتبر).', status_edit_empty:'مقدار جدید نمی‌تواند خالی باشد.', status_edit_index_error:'خطا هنگام ذخیره داده (شماره ردیف نامعتبر).', status_edit_invalid:'مقدار واردشده معتبر نیست.', status_expected_market_return_error:'بازده مورد انتظار بازار معتبر نیست.', status_import_error:'خواندن فایل داده {dataType} ناموفق بود.', status_import_no_numeric:'ستون عددی برای {dataType} در فایل پیدا نشد.', status_import_no_valid:'در ستون یا فایل داده عددی معتبری برای {dataType} یافت نشد.', status_list_cleared:'فهرست {listName} پاک شد.', status_no_valid_data:'داده معتبری برای {dataType} وارد نشده است.', status_plot_error_no_paired_data:'برای رگرسیون، داده‌های دارایی و بازار باید هم‌تعداد باشند.', status_plot_error_no_regression_params:'پارامترهای رگرسیون (آلفا و بتا) در دسترس نیستند.', status_qq_insufficient_points:'برای رسم نمودار Q-Q داده معتبر کافی نیست.', status_rf_error:'نرخ بدون ریسک معتبر نیست.', warning_title:'هشدار'
});

Object.assign(faTexts, {
    financial_guidance_heading:'تفسیر و ملاحظات', financial_guidance_expand:'راهنمای تحلیلگر',
    peer_workspace_kicker:'مقایسهٔ چندشرکتی', peer_workspace_title:'صورت‌های مالی و مقایسهٔ شرکت‌ها', local_records_badge:'ذخیرهٔ خصوصی در همین مرورگر', peer_workspace_intro:'برای هر شرکت سابقهٔ چندساله بسازید، دوره‌های مالی هم‌تراز را مقایسه کنید، پراکندگی همتایان را ببینید و روند هر شاخص را رسم کنید.',
    peer_guidance_title:'پیش از مقایسه، این موارد را بررسی کنید', peer_guidance_currency:'ارز و مقیاس همهٔ شرکت‌ها را یکسان وارد کنید؛ تبدیل ارز یا واحد انجام نمی‌شود.', peer_guidance_period:'پایان سال مالی، دورهٔ گزارش و تفاوت دادهٔ سالانه با دوازده‌ماههٔ شناور را هم‌تراز کنید.', peer_guidance_accounting:'رویه‌های حسابداری، اقلام غیرتکراری، اجاره‌ها، تملک‌ها و تجدید ارائهٔ صورت‌ها را بررسی کنید.', peer_guidance_direction:'نسبت بیشتر همیشه بهتر نیست؛ ارزش‌گذاری، اهرم، نقدینگی و چرخهٔ نقد را در بستر کسب‌وکار تفسیر کنید.', comparison_step_one:'هر شرکت را یک‌بار اضافه و ارز و مقیاس گزارشگری آن را تعیین کنید.', comparison_step_two:'برای هر شرکت، داده‌های مالی هم‌مبنا را برای هر سال مالی وارد و ذخیره کنید.', comparison_step_three:'برای مقایسه، برچسب دوره، گروه شاخص و شاخص روند یکسانی انتخاب کنید.',
    company_name_label:'نام شرکت', company_ticker_label:'نماد / شناسه', company_currency_label:'ارز گزارشگری', company_scale_label:'مقیاس ارقام', company_period_label:'دورهٔ مالی', company_select_label:'ویرایش شرکت', period_select_label:'بارگذاری دورهٔ ذخیره‌شده', company_select_empty:'انتخاب شرکت', new_period_option:'دورهٔ جدید', scale_units:'واحد', scale_thousands:'هزار', scale_millions:'میلیون',
    create_company_button:'افزودن شرکت', save_period_button:'ذخیرهٔ دورهٔ مالی', delete_company_button:'حذف شرکت انتخاب‌شده', export_company_data_button:'دریافت نسخهٔ پشتیبان', import_company_data_button:'بازیابی نسخهٔ پشتیبان', company_data_empty:'هنوز شرکتی ذخیره نشده؛ برای ساخت مجموعهٔ همتایان یک شرکت اضافه کنید.',
    peer_analysis_kicker:'مقایسه و تحلیل روند', peer_analysis_title:'مقایسهٔ شرکت‌ها و پایش عملکرد', compare_period_label:'دورهٔ مقایسه', no_periods_option:'دوره‌ای موجود نیست', compare_group_label:'گروه شاخص‌ها', compare_group_dividend:'هر سهم و بازده سهام‌دار', compare_group_profitability:'سودآوری', compare_group_valuation:'ارزش‌گذاری', compare_group_leverage:'اهرم مالی', compare_group_liquidity:'نقدینگی', compare_group_efficiency:'کارایی و چرخهٔ نقد', compare_group_cashflow:'جریان نقد و سرمایه‌گذاری', compare_trend_metric_label:'شاخص نمودار روند', comparison_empty:'برای شروع، دست‌کم یک شرکت اضافه و یک دورهٔ مالی ذخیره کنید.', peer_trend_chart_title:'روند چندسالهٔ شرکت‌های همتا',
    comparison_metric_heading:'شاخص', comparison_unit_heading:'واحد', comparison_company_heading:'شرکت', comparison_unavailable:'ناموجود', comparison_no_metric_data:'برای این شاخص و دوره، داده‌ای از شرکت‌ها ثبت نشده است.', comparison_currency_warning:'ارز یا مقیاس میان شرکت‌های منتخب نامشخص یا متفاوت است ({items}). مبالغ و شاخص‌های هر سهم تا زمان همسان‌سازی مستقیماً قابل مقایسه نیستند.', comparison_period_note:'شاخص‌های مبتنی بر جریان و ضرایب ارزش‌گذاری با استفاده از طول هر دوره به معادل ۱۲ماهه تبدیل می‌شوند. قیمت پایان دوره را با احتیاط مقایسه کنید؛ تفاوت پیش‌بینی، حسابرسی و تلفیقی/جداگانه مشخص می‌شود.',
    report_basis_kicker:'مبنای گزارش و کیفیت داده', report_basis_title:'مشخصات دوره و اطمینان‌بخشی', report_basis_hint:'طول دوره، دامنه صورت‌ها و وضعیت اطمینان‌بخشی را ثبت کنید تا مقایسه هم‌مبنا بماند.', report_basis_caveat:'یکسان بودن برچسب سال کافی نیست؛ طول دوره، دامنه تلفیق، مبنای حسابداری و وضعیت حسابرسی نیز باید هم‌خوان باشد.', period_months_label:'طول دوره (ماه)', reporting_basis_label:'دامنه صورت‌ها', basis_consolidated:'تلفیقی', basis_separate:'جداگانه', assurance_status_label:'وضعیت گزارش', assurance_audited:'حسابرسی‌شده', assurance_reviewed:'بررسی اجمالی‌شده', assurance_unaudited:'حسابرسی‌نشده', assurance_forecast:'پیش‌بینی مدیریت', audit_opinion_label:'اظهارنظر حسابرس', opinion_unmodified:'مقبول', opinion_qualified:'مشروط', opinion_adverse:'مردود', opinion_disclaimer:'عدم اظهارنظر', opinion_na:'قابل اعمال نیست / اعلام نشده', report_metadata_missing:'مشخصات گزارش موجود نیست یا بین شرکت‌ها متفاوت است؛ پیش از تفسیر مجموعهٔ همتایان، طول دوره، دامنه و اطمینان‌بخشی را بررسی کنید.', report_metadata_unknown:'مشخصات گزارش وارد نشده', period_meta_badge:'{months} ماه · {basis} · {status} · {opinion}',
    peer_insight_coverage:'پوشش گزارش‌دهی', peer_insight_median:'میانهٔ همتایان', peer_insight_spread:'دامنهٔ مقادیر', peer_insight_values:'برای {period}، {count} شرکت از {total} شرکت این شاخص را گزارش کرده‌اند.', peer_insight_median_text:'میانهٔ همتایان برای {metric} برابر {value} است.', peer_insight_spread_text:'مقادیر گزارش‌شده از {low} تا {high} هستند؛ این پراکندگی است، نه رتبه‌بندی کیفیت.', peer_insight_no_data:'برای شاخص انتخاب‌شده مقدار قابل مقایسه‌ای موجود نیست.', peer_yoy_label:'تغییر نسبت به دورهٔ ذخیره‌شدهٔ قبل', peer_yoy_value:'{metric} در {company} نسبت به {period} به‌اندازهٔ {change} تغییر کرده است.', peer_yoy_missing:'برای مشاهدهٔ روند، دست‌کم دو دوره برای یک شرکت ذخیره کنید.',
    company_create_name_required:'برای افزودن شرکت، نام آن را وارد کنید.', company_currency_required:'ارز گزارشگری را وارد کنید؛ مانند USD، EUR یا IRR.', company_invalid_numeric:'پیش از ذخیره، ورودی‌های مالی غیرعددی را اصلاح یا خالی کنید.', company_created:'مشخصات شرکت ساخته شد؛ یک دورهٔ مالی وارد و ذخیره کنید.', company_select_required:'ابتدا یک شرکت انتخاب یا اضافه کنید.', company_period_required:'برچسب دورهٔ مالی را وارد کنید؛ مثلاً FY2025.', company_period_saved:'داده‌های مالی {company} برای دورهٔ {period} ذخیره شد.', company_delete_confirm:'شرکت {company} و تمام دوره‌های ذخیره‌شدهٔ آن از این مرورگر حذف شود؟', company_deleted:'شرکت و دوره‌های ذخیره‌شده حذف شدند.', company_no_data_export:'داده‌ای برای پشتیبان‌گیری وجود ندارد.', company_export_done:'نسخهٔ پشتیبان داده‌های شرکت دانلود شد.', company_import_invalid:'فایل انتخاب‌شده نسخهٔ پشتیبان معتبر داده‌های شرکت نیست.', company_import_done:'{count} پروندهٔ شرکت بازیابی شد.', company_storage_error:'ذخیرهٔ داده‌ها در این مرورگر ممکن نشد؛ فضای ذخیره‌سازی محلی را بررسی کنید.', company_delete_button:'حذف', company_cancel_button:'انصراف', prefill_codal_report_button:'شروع از مشخصات گزارش کدال پیوست‌شده', report_metadata_prefilled:'مشخصات گزارش از فایل حسابرسی‌شده پر شد. مبلغ‌های صورت‌های مالی خالی هستند و باید از PDF وارد شوند.',
    trend_axis_period:'دورهٔ مالی', trend_axis_value:'مقدار محاسبه‌شده', trend_no_data:'برای رسم روند چندساله، دوره‌های مالی شرکت را ذخیره کنید.', comparison_scale_units_note:'مقادیر بر حسب {currency} · {scale}', yoy_change_caption:'نسبت به {period}',
    advice_eps:'رشد EPS را کنار تغییر تعداد سهام بررسی کنید؛ بازخرید سهام می‌تواند بدون رشد مشابه عملیات، EPS را بالا ببرد.', advice_dps:'پایداری DPS را با جریان نقد آزاد و توان پرداخت سود نقدی بسنجید.', advice_totalReturn:'بازده کل تغییر قیمت و سود تقسیمی را در دورهٔ قیمت انتخاب‌شده ترکیب می‌کند؛ سرمایه‌گذاری مجدد و زمان‌بندی سود مدل نشده‌اند.', advice_roe:'افزایش ROE ممکن است از کاهش حقوق صاحبان سهام یا افزایش اهرم ناشی شود؛ ROA، بدهی و میانگین حقوق صاحبان سهام را هم ببینید.', advice_dividendYield:'بازده تقسیمی بالا ممکن است حاصل افت قیمت یا سود نقدی ناپایدار باشد؛ پوشش و سابقهٔ پرداخت را بررسی کنید.', advice_dpr:'نسبت پرداخت بالا سهم کمتری برای سود انباشته باقی می‌گذارد؛ آن را با بلوغ صنعت و تولید نقد بسنجید.', advice_pe:'P/E به چرخهٔ سود حساس است و برای سود منفی یا غیرعادی پایین معنادار نیست؛ در صورت امکان سود نرمال‌شده را مقایسه کنید.', advice_pb:'P/B برای کسب‌وکارهای دارایی‌محور مفیدتر است و به ارزش دفتری حسابداری وابسته است.', advice_ps:'P/S حاشیهٔ سود و شدت سرمایه را نادیده می‌گیرد؛ فقط مدل‌های کسب‌وکار مشابه را مقایسه کنید.', advice_de:'D/E به تعریف بدهی و پایهٔ حقوق صاحبان سهام وابسته است؛ حقوق صاحبان سهام منفی یا بسیار کم تفسیر را دشوار می‌کند.', advice_debtRatio:'نسبت بدهی از کل بدهی‌ها، شامل تعهدات عملیاتی، استفاده می‌کند؛ آن را با بدهی بهره‌دار یکی نگیرید.', advice_interestCoverage:'پوشش کمتر از ۱ برابر یعنی EBIT هزینهٔ بهرهٔ گزارش‌شده را پوشش نمی‌دهد؛ جریان نقد و سررسید بدهی را نیز بررسی کنید.', advice_evEbitda:'EV/EBITDA بازده جریان نقد نیست و مخارج سرمایه‌ای، مالیات و نیاز سرمایه در گردش را لحاظ نمی‌کند.', advice_grossMargin:'حاشیهٔ ناخالص از قیمت‌گذاری و هزینهٔ مستقیم اثر می‌گیرد؛ ترکیب محصول و طبقه‌بندی حسابداری مهم است.', advice_operatingMargin:'حاشیهٔ عملیاتی هزینه‌های عملیات را پیش از تأمین مالی و مالیات منعکس می‌کند؛ اقلام غیرتکراری را تعدیل کنید.', advice_netMargin:'حاشیهٔ خالص آثار تأمین مالی و مالیات را هم دارد؛ ساختار سرمایه و نظام مالیاتی را در مقایسه لحاظ کنید.', advice_roa:'ROA به مدل کسب‌وکار و پایهٔ دارایی وابسته است؛ از میانگین دارایی استفاده و تجدید ارزیابی را بررسی کنید.', advice_assetTurnover:'گردش دارایی به مدل کسب‌وکار وابسته است؛ شرکت‌های کم‌دارایی را با همتای مشابه مقایسه کنید.', advice_inventoryTurnover:'گردش خیلی بالا می‌تواند نشانهٔ مدیریت کارا یا کمبود موجودی و فروش ازدست‌رفته باشد.', advice_receivablesTurnover:'در تفسیر گردش دریافتنی، شرایط اعتبار، واگذاری مطالبات و کیفیت درآمد را بررسی کنید.', advice_workingCapital:'سرمایه در گردش مبلغی مطلق است؛ آن را نسبت به فروش، دارایی و فصل‌پذیری بسنجید.', advice_currentRatio:'نسبت جاری بالا الزاماً به معنای ایمنی بیشتر نیست؛ کیفیت دریافتنی و موجودی را بررسی کنید.', advice_quickRatio:'نسبت آنی موجودی را کنار می‌گذارد، اما ممکن است مطالبات دیر وصول یا مشکوک را شامل شود.', advice_cashRatio:'نسبت نقد، معیار محدودی از نقدینگی است؛ اعتبار تعهدشده و تعهدات پیش‌رو را هم ببینید.', advice_dpo:'مهلت پرداخت طولانی‌تر می‌تواند نقد را حفظ کند، اما ممکن است نشانهٔ فشار بر تأمین‌کنندگان یا شرایط دشوار باشد.', advice_dio:'روزهای بالای موجودی ممکن است از کالای کم‌گردش، فصل‌پذیری یا ذخیرهٔ احتیاطی ناشی شود.', advice_dso:'دورهٔ وصول بالا می‌تواند به شرایط اعتباری آسان‌تر، ترکیب مشتریان یا مشکل وصول اشاره کند.', advice_ccc:'کاهش چرخهٔ تبدیل نقد می‌تواند وجه نقد آزاد کند؛ مدل کسب‌وکار و شرایط تأمین‌کننده را مقایسه کنید.', advice_capex:'روش تغییر ترازنامه تقریبی است و تملک، واگذاری، ارز و تجدید ارزیابی می‌توانند آن را منحرف کنند.', advice_fcf:'در اینجا FCF برابر CFO منهای CapEx برآوردی است؛ طبقه‌بندی جریان نقد و نیاز سرمایه‌گذاری تکرارشونده را بررسی کنید.', advice_fcfYield:'بازده FCF به قیمت سهم و برآورد CapEx حساس است؛ FCF نرمال‌شدهٔ چندساله را ببینید.', advice_pfcf:'وقتی جریان نقد آزاد منفی یا بسیار پرنوسان است، P/FCF معنای محدودی دارد.', advice_cfoNetIncome:'CFO و سود خالص را در چند دوره مقایسه کنید؛ زمان‌بندی سرمایه در گردش می‌تواند این نسبت را شدیداً جابه‌جا کند.'
});

Object.assign(faTexts, {
    financial_input_hint:'برای همهٔ مبالغ مالی از ارز و مقیاس یکسان استفاده کنید و تعداد سهام را نیز هم‌مقیاس با مبالغ وارد کنید؛ مثلاً صورت‌های مالی و تعداد سهام هر دو به میلیون باشند. قیمت هر سهم را به واحد واقعی وارد کنید. داده‌های سود و جریان نقد را برای یک سال گزارش و ماندهٔ ابتدا و انتهای دوره را برای نسبت‌های مبتنی بر میانگین وارد کنید.',
    company_name_placeholder:'مثلاً شرکت نمونه', company_ticker_placeholder:'مثلاً نماد', company_currency_placeholder:'مثلاً IRR', company_period_placeholder:'مثلاً FY2025',
    trend_currency_warning:'این شاخص واحد پولی دارد. ارز یا مقیاس داده‌های همتایان یکسان نیست؛ نمودار ترکیبی تا همسان‌سازی ورودی‌ها نمایش داده نمی‌شود.', peer_insight_advice:'راهنمای تفسیر تحلیلگر', company_records_loaded:'{company}: {count} دورهٔ مالی ذخیره‌شده.',
    company_import_confirm:'بازیابی این نسخه، همهٔ پرونده‌های شرکت ذخیره‌شده در این مرورگر را جایگزین می‌کند.', company_unsaved_status:'تغییرات ذخیره‌نشده است؛ پیش از خروج از این دوره آن را ذخیره کنید.', company_unsaved_confirm:'تغییرات ذخیره‌نشدهٔ این دورهٔ مالی کنار گذاشته شود؟', company_copy_success:'ورودی‌های تحلیل فعلی در فرم دورهٔ مالی شرکت کپی شدند.', company_load_missing:'ابتدا یک شرکت و دورهٔ مالی ذخیره‌شده انتخاب کنید.', copy_current_financials_button:'کپی ورودی‌های تحلیل فعلی', load_company_period_button:'بارگذاری دوره در تحلیل تک‌شرکتی', company_unsaved_discard_button:'کنارگذاشتن تغییرات', company_shares_scale_guidance:'تعداد سهام را هم‌مقیاس با مبالغ صورت‌ها وارد کنید؛ مثلاً اگر ارقام مالی به میلیون است، تعداد سهام هم به میلیون باشد. قیمت هر سهم را به واحد واقعی وارد کنید.', metadata_months_invalid:'طول دوره باید عدد صحیحی بین ۱ تا ۶۰ ماه باشد.', annualized_metrics_note:'شاخص‌های جریانی و ضرایب ارزش‌گذاری به معادل ۱۲ماهه تبدیل می‌شوند؛ مانده‌های ترازنامه و قیمت‌های پایان دوره سالانه‌سازی نمی‌شوند.'
});
Object.assign(faTexts, { quote_widget_kicker:'داده زندهٔ اختیاری', quote_widget_hint:'در زمان اتصال اینترنت، نمای بازار TradingView مستقیماً از همین مرورگر دریافت می‌شود. تحلیل صورت‌های مالی و نمودارهای محلی آفلاین می‌مانند.', quote_idle:'تحلیل دستی آفلاین است؛ دریافت قیمت فقط به اینترنت نیاز دارد.', quote_server_required:'این مرورگر به سرویس اختیاری TradingView دسترسی نداشت. اتصال اینترنت را بررسی کنید یا داده‌ها را دستی وارد کنید.', quote_no_data:'برای این نماد دادهٔ قیمتی برنگشت.', quote_source_note:'دادهٔ screener جامعه‌محور و غیررسمی TradingView · احتمال تأخیر · بدون صورت مالی یا توصیه سرمایه‌گذاری' });

Object.assign(texts, {
    tab_financial_models:{en:'Financial Models',fa:'مدل‌های مالی'}, help_tab_financial_models:{en:'Use the dedicated model workspace for time value of money (FV/PV/PMT), CAPM, APT, and an advanced formula reference. Results use only your entered assumptions.',fa:'در فضای مستقل مدل‌ها، ارزش زمانی پول (FV/PV/PMT)، CAPM، APT و مرجع فرمول‌های پیشرفته را بررسی کنید. نتایج فقط بر پایه مفروضات واردشده‌اند.'},
    models_kicker:{en:'QUANTITATIVE TOOLKIT',fa:'جعبه‌ابزار کمی'},models_title:{en:'Financial Models & Formula Library',fa:'مدل‌های مالی و کتابخانه فرمول'},models_offline_badge:{en:'Local calculations',fa:'محاسبات محلی'},models_intro:{en:'A focused workspace for time value of money, asset-pricing models, and core valuation relationships. Enter assumptions explicitly and review the formula and limitations beside each result.',fa:'فضایی متمرکز برای ارزش زمانی پول، مدل‌های قیمت‌گذاری دارایی و روابط اصلی ارزش‌گذاری. مفروضات را شفاف وارد کنید و فرمول و محدودیت هر نتیجه را کنار آن ببینید.'},models_nav_tvm:{en:'Time Value of Money',fa:'ارزش زمانی پول'},models_nav_pricing:{en:'CAPM & APT',fa:'CAPM و APT'},models_nav_formula:{en:'Advanced formulas',fa:'فرمول‌های پیشرفته'},models_nav_label:{en:'Financial model sections',fa:'بخش‌های مدل مالی'},
    tvm_kicker:{en:'TIME VALUE OF MONEY',fa:'ارزش زمانی پول'},tvm_title:{en:'Future Value, Present Value & Annuities',fa:'ارزش آتی، ارزش فعلی و مستمری‌ها'},tvm_description:{en:'Solve for FV, PV, periodic PMT, number of periods, or nominal annual rate. Use the same currency unit for all cash-flow inputs. Payments occur at the end or beginning of each period; the annual nominal rate is converted using the selected frequency.',fa:'FV، PV، پرداخت دوره‌ای، تعداد دوره‌ها یا نرخ اسمی سالانه را حل کنید. واحد پول همه جریان‌های نقدی باید یکسان باشد. پرداخت در ابتدا یا انتهای هر دوره انجام می‌شود و نرخ اسمی سالانه بر اساس تناوب انتخابی تبدیل می‌شود.'},tvm_target_label:{en:'Solve for',fa:'محاسبه کدام مقدار'},tvm_target_fv:{en:'Future Value (FV)',fa:'ارزش آتی (FV)'},tvm_target_pv:{en:'Present Value (PV)',fa:'ارزش فعلی (PV)'},tvm_target_pmt:{en:'Periodic Payment (PMT)',fa:'پرداخت دوره‌ای (PMT)'},tvm_target_n:{en:'Number of periods (N)',fa:'تعداد دوره‌ها (N)'},tvm_target_rate:{en:'Nominal annual rate (I/Y)',fa:'نرخ اسمی سالانه (I/Y)'},tvm_pv_label:{en:'Present value (PV)',fa:'ارزش فعلی (PV)'},tvm_pmt_label:{en:'Periodic contribution (PMT)',fa:'واریز دوره‌ای (PMT)'},tvm_fv_label:{en:'Future value target (FV)',fa:'ارزش آتی هدف (FV)'},tvm_rate_label:{en:'Nominal annual rate (%)',fa:'نرخ اسمی سالانه (٪)'},tvm_years_label:{en:'Investment horizon (years)',fa:'افق سرمایه‌گذاری (سال)'},tvm_frequency_label:{en:'Compounding / payment frequency',fa:'تناوب ترکیب / پرداخت'},freq_annual:{en:'Annual',fa:'سالانه'},freq_semiannual:{en:'Semi-annual',fa:'شش‌ماهه'},freq_quarterly:{en:'Quarterly',fa:'فصلی'},freq_monthly:{en:'Monthly',fa:'ماهانه'},freq_daily:{en:'Daily (365)',fa:'روزانه (۳۶۵)'},tvm_timing_label:{en:'Payment timing',fa:'زمان پرداخت'},tvm_ordinary:{en:'End of period (ordinary annuity)',fa:'انتهای دوره (مستمری عادی)'},tvm_due:{en:'Beginning of period (annuity due)',fa:'ابتدای دوره (مستمری پیش‌پرداخت)'},calculate_model_button:{en:'Calculate model',fa:'محاسبه مدل'},reset_model_button:{en:'Reset example',fa:'بازنشانی مثال'},tvm_result_label:{en:'Calculated result',fa:'نتیجه محاسبه'},tvm_result_hint:{en:'Enter assumptions and calculate to see the result.',fa:'مفروضات را وارد و محاسبه کنید تا نتیجه نمایش داده شود.'},tvm_period_suffix:{en:'periods',fa:'دوره'},tvm_solve_formulas:{en:'PV and PMT are rearranged from the FV equation; N and I/Y are solved numerically.',fa:'PV و PMT با بازآرایی معادله FV به‌دست می‌آیند؛ N و I/Y با روش عددی حل می‌شوند.'},tvm_formula_summary:{en:'Formula & assumptions',fa:'فرمول و مفروضات'},tvm_formula_note:{en:'Periodic rate i = nominal annual rate / m; number of periods n = years × m. FV = PV(1+i)^n + PMT × [((1+i)^n − 1)/i], adjusted by (1+i) for annuity due. Rate and period targets are solved numerically. No taxes, fees, inflation, or changing rates are modeled.',fa:'نرخ دوره‌ای i = نرخ اسمی سالانه / m؛ تعداد دوره‌ها n = سال × m. ارزش آتی = PV(1+i)^n + PMT × [((1+i)^n − 1)/i]؛ برای مستمری پیش‌پرداخت در (1+i) ضرب می‌شود. نرخ و تعداد دوره‌ها به‌صورت عددی حل می‌شوند. مالیات، کارمزد، تورم و تغییر نرخ در مدل نیست.'},tvm_invalid:{en:'Check the inputs: horizon must be positive, the periodic rate must be above −100%, and all non-target cash-flow inputs must be valid.',fa:'ورودی‌ها را بررسی کنید: افق باید مثبت، نرخ دوره‌ای بیشتر از ۱۰۰٪− و ورودی‌های جریان نقدی غیرهدف معتبر باشند.'},tvm_result_detail_fv:{en:'Future value includes the opening PV and equal periodic contributions. No taxes, fees, inflation, or changing rates are included.',fa:'ارزش آتی شامل PV اولیه و واریزهای دوره‌ای برابر است. مالیات، کارمزد، تورم و تغییر نرخ لحاظ نشده‌اند.'},tvm_result_detail_pv:{en:'Present value is the amount today equivalent to the target FV net of the assumed periodic contributions.',fa:'ارزش فعلی، مبلغ امروز معادل FV هدف پس از کسر اثر واریزهای دوره‌ای فرض‌شده است.'},tvm_result_detail_pmt:{en:'Required equal contribution each period to reach the target FV from the opening PV.',fa:'واریز برابر موردنیاز در هر دوره برای رسیدن از PV اولیه به FV هدف است.'},tvm_result_detail_n:{en:'Number of compounding/payment periods required to reach the target future value. Divide by the selected annual frequency to express the answer in years.',fa:'تعداد دوره‌های ترکیب/پرداخت لازم برای رسیدن به ارزش آتی هدف. برای تبدیل به سال، پاسخ را بر تناوب سالانه انتخاب‌شده تقسیم کنید.'},tvm_result_detail_rate:{en:'Implied nominal annual rate, found by numerically solving the periodic return consistent with the cash flows and target value.',fa:'نرخ اسمی سالانه ضمنی که با حل عددی بازده دوره‌ای سازگار با جریان‌های نقد و ارزش هدف به‌دست آمده است.'},
    pricing_kicker:{en:'EXPECTED RETURN FRAMEWORKS',fa:'چارچوب‌های بازده موردانتظار'},pricing_title:{en:'CAPM & Arbitrage Pricing Theory (APT)',fa:'CAPM و نظریه قیمت‌گذاری آربیتراژ (APT)'},pricing_description:{en:'Compare a single-factor CAPM estimate with a multi-factor APT estimate. Factor risk premiums are entered directly in percentage points and betas measure sensitivity to each factor.',fa:'برآورد تک‌عاملی CAPM را با برآورد چندعاملی APT مقایسه کنید. صرف ریسک عامل‌ها را مستقیم به درصد وارد کنید و بتا حساسیت به هر عامل را نشان می‌دهد.'},pricing_rf:{en:'Risk-free rate (%)',fa:'نرخ بدون ریسک (٪)'},pricing_market:{en:'Expected market return (%)',fa:'بازده موردانتظار بازار (٪)'},pricing_market_beta:{en:'Market beta (βm)',fa:'بتای بازار (βm)'},apt_factor_title:{en:'APT factor exposures and premia',fa:'مواجهه‌ها و صرف ریسک عامل‌های APT'},apt_factor_one:{en:'Factor 1: market premium (%)',fa:'عامل ۱: صرف ریسک بازار (٪)'},apt_beta_one:{en:'Factor 1 beta',fa:'بتای عامل ۱'},apt_factor_two:{en:'Factor 2: size premium (%)',fa:'عامل ۲: صرف ریسک اندازه (٪)'},apt_beta_two:{en:'Factor 2 beta',fa:'بتای عامل ۲'},apt_factor_three:{en:'Factor 3: value premium (%)',fa:'عامل ۳: صرف ریسک ارزش (٪)'},apt_beta_three:{en:'Factor 3 beta',fa:'بتای عامل ۳'},capm_expected_label:{en:'CAPM expected return',fa:'بازده موردانتظار CAPM'},apt_expected_label:{en:'APT expected return',fa:'بازده موردانتظار APT'},capm_formula_short:{en:'Rf + βm × (Rm − Rf)',fa:'Rf + βm × (Rm − Rf)'},apt_formula_short:{en:'Rf + Σ(βk × factor premiumk)',fa:'Rf + Σ(βk × صرف ریسک عاملk)'},apt_capm_spread:{en:'APT − CAPM spread',fa:'فاصله APT − CAPM'},spread_interpretation:{en:'Model estimate difference; investigate factor definitions and sample.',fa:'اختلاف برآورد مدل‌ها؛ تعریف عامل‌ها و نمونه را بررسی کنید.'},pricing_formula_summary:{en:'Interpretation and model risk',fa:'تفسیر و ریسک مدل'},pricing_formula_note:{en:'CAPM is a one-factor equilibrium model. APT is a linear factor model; factor selection and premia are not uniquely determined by this calculator. These expected returns are assumptions, not guaranteed outcomes. Do not treat CAPM and APT estimates as interchangeable without checking horizon, currency, factor construction, and estimation method.',fa:'CAPM مدل تعادلی تک‌عاملی است. APT مدل خطی چندعاملی است؛ انتخاب عامل و صرف ریسک در این محاسبه‌گر یکتا تعیین نمی‌شود. بازده‌ها فرض‌اند و تضمین‌شده نیستند. بدون تطبیق افق، ارز، ساخت عامل‌ها و روش برآورد، خروجی CAPM و APT را قابل‌جایگزینی ندانید.'},pricing_ready:{en:'Inputs are valid; estimates use the assumptions above.',fa:'ورودی‌ها معتبرند؛ برآوردها بر اساس مفروضات بالا محاسبه شده‌اند.'},pricing_invalid:{en:'Enter valid numeric values for the risk-free rate, market return, market beta, and all factor betas and premiums.',fa:'برای نرخ بدون ریسک، بازده بازار، بتای بازار و همه بتاها و صرف ریسک عامل‌ها مقادیر عددی معتبر وارد کنید.'},
    formula_kicker:{en:'QUICK REFERENCE',fa:'مرجع سریع'},formula_title:{en:'Advanced Financial Formula Library',fa:'کتابخانه فرمول‌های پیشرفته مالی'},formula_description:{en:'Review the structure, inputs, and interpretation limits of common CFA-style models. Expand a card for the formula and analytical checks.',fa:'ساختار، ورودی‌ها و محدودیت تفسیر مدل‌های متداول مالی را مرور کنید. برای دیدن فرمول و کنترل‌های تحلیلی، هر کارت را باز کنید.'},formula_wacc_name:{en:'Weighted average cost of capital',fa:'هزینه متوسط موزون سرمایه'},formula_wacc_note:{en:'Use market-value weights and marginal after-tax debt cost; match nominal/real basis and currency to FCFF.',fa:'از وزن‌های ارزش بازار و هزینه نهایی بدهی پس از مالیات استفاده کنید؛ مبنای اسمی/واقعی و ارز باید با FCFF سازگار باشد.'},formula_fcff_name:{en:'Free cash flow to the firm',fa:'جریان نقد آزاد بنگاه'},formula_fcff_note:{en:'Discount FCFF at WACC to estimate enterprise value; subtract net debt and other claims for equity value.',fa:'برای برآورد ارزش بنگاه FCFF را با WACC تنزیل کنید؛ برای ارزش سهام، بدهی خالص و سایر مطالبات را کسر کنید.'},formula_eva_name:{en:'Economic value added',fa:'ارزش افزوده اقتصادی'},formula_eva_note:{en:'Consistent operating scope, tax treatment, and invested-capital definition are essential.',fa:'سازگاری دامنه عملیاتی، نحوه مالیات و تعریف سرمایه به‌کارگرفته‌شده ضروری است.'},formula_dupont_name:{en:'Three-factor decomposition',fa:'تجزیه سه‌عاملی'},formula_dupont_note:{en:'Separate profitability, operating efficiency, and leverage to explain changes in ROE.',fa:'برای توضیح تغییر ROE، سودآوری، کارایی عملیاتی و اهرم را جداگانه بررسی کنید.'},formula_gordon_name:{en:'Dividend discount model',fa:'مدل تنزیل سود تقسیمی'},formula_gordon_note:{en:'Requires r > g and sustainable constant growth; value becomes highly sensitive as r approaches g.',fa:'به r بزرگ‌تر از g و رشد ثابت پایدار نیاز دارد؛ با نزدیک‌شدن r به g ارزش بسیار حساس می‌شود.'},formula_ccc_name:{en:'Cash conversion cycle',fa:'چرخه تبدیل وجه نقد'},formula_ccc_note:{en:'Use average receivables, inventory, and payables with aligned sales/COGS periods; seasonality can distort point estimates.',fa:'از میانگین دریافتنی، موجودی و پرداختنی با دوره فروش/COGS هم‌تراز استفاده کنید؛ فصل‌پذیری برآورد مقطعی را منحرف می‌کند.'},formula_duration_name:{en:'Modified duration and convexity',fa:'دیرش اصلاح‌شده و محدبیت'},formula_duration_note:{en:'Local approximation for small parallel yield changes; embedded options and curve shifts require more advanced treatment.',fa:'تقریب موضعی برای تغییرات کوچک و موازی بازده است؛ اختیارهای ضمنی و تغییر شکل منحنی به روش پیشرفته‌تری نیاز دارند.'},formula_sharpe_name:{en:'Excess return per unit of total risk',fa:'بازده مازاد به‌ازای ریسک کل'},formula_sharpe_note:{en:'Returns and risk-free rate must share a frequency; standard deviation treats upside and downside volatility symmetrically.',fa:'تناوب بازده و نرخ بدون ریسک باید یکسان باشد؛ انحراف معیار نوسان صعودی و نزولی را متقارن در نظر می‌گیرد.'}
});

Object.assign(faTexts, { results_title:'خلاصه ریسک و بازده', regression_results_title:'رگرسیون بازار و CAPM', add_market_data_hint_short:'تاریخ و ترتیب را با بازده دارایی یکسان کنید؛ تعداد مشاهدات باید برابر باشد.', add_benchmark_data_hint_short:'تاریخ و ترتیب را با بازده دارایی یکسان کنید؛ تعداد مشاهدات باید برابر باشد.', dcf_caveat:'FCFF = NOPAT + استهلاک − CapEx − تغییر سرمایه در گردش عملیاتی. سرمایه در گردش به‌صورت سهمی از فروش پیش‌بینی می‌شود؛ مبنای اولیه، در صورت وجود، میانگین دریافتنی تجاری + موجودی − پرداختنی تجاری است و وجه نقد و اقلام تأمین مالی را کنار می‌گذارد. فصل‌پذیری، اجاره، مالیات و تمرکز ارزش پایانی را بررسی کنید.' });
Object.assign(texts,{dcf_wacc_derived:{en:'CAPM cost of equity {coe}% · common-equity weight {equityWeight}% · debt weight {debtWeight}% · preferred-equity weight {preferredWeight}% · derived WACC {wacc}%.',fa:'هزینه حقوق صاحبان سهام CAPM برابر {coe}٪ · وزن حقوق صاحبان سهام عادی {equityWeight}٪ · وزن بدهی {debtWeight}٪ · وزن سهام ممتاز {preferredWeight}٪ · WACC برآوردی {wacc}٪.'}});
Object.assign(faTexts,{dcf_wacc_derived:'هزینه حقوق صاحبان سهام CAPM برابر {coe}٪ · وزن حقوق صاحبان سهام عادی {equityWeight}٪ · وزن بدهی {debtWeight}٪ · وزن سهام ممتاز {preferredWeight}٪ · WACC برآوردی {wacc}٪.'});
Object.assign(texts, { skip_to_workspace:{en:'Skip to workspace',fa:'رفتن به فضای کاری'},dcf_claims_deducted:{en:'Claims deducted',fa:'مطالبات کسرشده'},dcf_claims_title:{en:'Other claims in the enterprise-to-equity bridge',fa:'سایر مطالبات در تبدیل EV به ارزش سهام'},dcf_preferred_claim:{en:'Preferred equity value',fa:'ارزش سهام ممتاز'},dcf_preferred_cost:{en:'Preferred cost (%)',fa:'هزینه سهام ممتاز (٪)'},dcf_minority_claim:{en:'Non-controlling interest',fa:'منافع فاقد کنترل'},dcf_other_claim:{en:'Other senior claims',fa:'سایر مطالبات مقدم'},dcf_claims_note:{en:'Use the same currency and scale as the statements. These claims are deducted from enterprise value; preferred equity is included in derived WACC only when its value and cost are supplied.',fa:'از ارز و مقیاس یکسان با صورت‌ها استفاده کنید. این مطالبات از ارزش بنگاه کسر می‌شوند؛ سهام ممتاز فقط وقتی با ارزش و هزینه آن وارد شود در WACC برآوردی لحاظ می‌شود.'},correlation_matrix_invalid:{en:'The pairwise correlations do not form a valid positive-semidefinite correlation matrix. Review all pair inputs.',fa:'همبستگی‌های دوتایی یک ماتریس همبستگی مثبت نیمه‌معین معتبر نمی‌سازند؛ همه ورودی‌های جفتی را بازبینی کنید.'},formula_fcfe_name:{en:'Free cash flow to equity',fa:'جریان نقد آزاد سهام‌داران'},formula_fcfe_note:{en:'Discount at cost of equity. Net borrowing and reinvestment assumptions must match the forecast capital structure.',fa:'با هزینه حقوق صاحبان سهام تنزیل کنید. استقراض خالص و سرمایه‌گذاری مجدد باید با ساختار سرمایه پیش‌بینی‌شده سازگار باشند.'},formula_residual_name:{en:'Equity value from book value and excess returns',fa:'ارزش سهام بر پایه ارزش دفتری و بازده مازاد'},formula_residual_note:{en:'Useful when dividends or free cash flows are difficult to forecast; book value and clean-surplus assumptions matter.',fa:'وقتی پیش‌بینی سود تقسیمی یا جریان نقد دشوار است کاربرد دارد؛ فرض ارزش دفتری و رابطه سود انباشته اهمیت دارند.'},formula_factor_name:{en:'Market, size, and value factor model',fa:'مدل عامل بازار، اندازه و ارزش'},formula_factor_note:{en:'Factor returns must be aligned in time and currency; exposures are estimated, not prescribed by this formula.',fa:'بازده عامل‌ها باید از نظر زمان و ارز هم‌تراز باشند؛ مواجهه‌ها برآورد می‌شوند و در این فرمول از پیش تعیین نشده‌اند.'} });

Object.assign(texts, {
  models_nav_capital:{en:'Capital budgeting',fa:'بودجه‌بندی سرمایه'},models_nav_wacc:{en:'Cost of capital',fa:'هزینه سرمایه'},models_nav_options:{en:'Options & Greeks',fa:'اختیار معامله و یونانی‌ها'},
  capital_invalid:{en:'Enter at least two finite cash flows, including one inflow and one outflow. Rates must be greater than −100%.',fa:'حداقل دو جریان نقد محدود شامل یک ورودی و یک خروجی وارد کنید. نرخ‌ها باید بیشتر از ۱۰۰−٪ باشند.'},capital_no_irr:{en:'No root found',fa:'ریشه‌ای یافت نشد'},capital_no_irr_hint:{en:'No IRR was bracketed in the searched range; NPV remains the primary decision metric.',fa:'در دامنه جست‌وجو ریشه‌ای برای IRR پیدا نشد؛ NPV معیار اصلی تصمیم باقی می‌ماند.'},capital_multiple_irr:{en:'{count} IRR solutions found. Non-conventional cash flows can make IRR ambiguous; use NPV and review every root.',fa:'{count} جواب IRR پیدا شد. جریان نقد نامتعارف ممکن است IRR را مبهم کند؛ NPV و همه ریشه‌ها را بررسی کنید.'},capital_calculated:{en:'Metrics calculated from equally spaced cash flows. Compare projects only on a consistent horizon and risk basis.',fa:'شاخص‌ها از جریان‌های نقد با فاصله زمانی برابر محاسبه شدند. پروژه‌ها را فقط با افق و مبنای ریسک سازگار مقایسه کنید.'},capital_t:{en:'Period',fa:'دوره'},capital_flow:{en:'Cash flow',fa:'جریان نقد'},capital_cumulative:{en:'Cumulative cash flow',fa:'جریان نقد انباشته'},capital_cumulative_pv:{en:'Cumulative discounted cash flow',fa:'جریان نقد تنزیل‌شده انباشته'},capital_not_recovered:{en:'Not recovered',fa:'بازیافت‌نشده'},capital_period_1:{en:'years',fa:'سال'},capital_period_4:{en:'quarters',fa:'فصل'},capital_period_12:{en:'months',fa:'ماه'},
  wacc_invalid:{en:'Capital values must be nonnegative, total capital must be positive, and tax must be between 0% and 100%.',fa:'ارزش اجزای سرمایه باید نامنفی، کل سرمایه مثبت و نرخ مالیات بین صفر تا ۱۰۰٪ باشد.'},wacc_calculated:{en:'WACC uses market-value weights and the after-tax cost of debt. Match currency, inflation basis, and cash-flow definition.',fa:'WACC از وزن‌های ارزش بازار و هزینه بدهی پس از مالیات استفاده می‌کند. ارز، مبنای تورم و تعریف جریان نقد را هم‌تراز کنید.'},
  options_invalid:{en:'Enter positive spot, strike, maturity, and volatility; all rate inputs must be finite.',fa:'قیمت دارایی، قیمت اعمال، سررسید و نوسان مثبت و نرخ‌ها محدود باشند.'},options_calculated:{en:'Black–Scholes–Merton values and Greeks calculated under the assumptions below.',fa:'ارزش اختیار و یونانی‌ها با مدل بلک–شولز–مرتون و مفروضات زیر محاسبه شد.'},option_intrinsic_call:{en:'Call intrinsic value at expiry',fa:'ارزش ذاتی خرید در سررسید'},option_intrinsic_put:{en:'Put intrinsic value at expiry',fa:'ارزش ذاتی فروش در سررسید'},option_value:{en:'Option value',fa:'ارزش اختیار'}
});
Object.assign(texts,{
 model_local_badge:{en:'Calculated locally',fa:'محاسبه محلی'},capital_kicker:{en:'INVESTMENT DECISIONS',fa:'تصمیم‌های سرمایه‌گذاری'},capital_title:{en:'Capital Budgeting & Project Returns',fa:'بودجه‌بندی سرمایه و بازده پروژه'},capital_description:{en:'Enter time 0 first, then one cash flow per equal period. NPV, IRR, MIRR, profitability index and payback metrics share this timeline.',fa:'ابتدا جریان نقد زمان صفر و سپس یک مقدار برای هر دوره هم‌فاصله وارد کنید. NPV، IRR، MIRR، شاخص سودآوری و دوره بازگشت بر همین مبنا محاسبه می‌شوند.'},capital_cashflows_label:{en:'Cash flows (t₀ first; one per line)',fa:'جریان‌های نقد (ابتدا t₀؛ هر مقدار در یک خط)'},capital_discount_label:{en:'Discount / finance rate (% annual)',fa:'نرخ تنزیل / تأمین مالی (سالانه ٪)'},capital_reinvest_label:{en:'MIRR reinvestment rate (% annual)',fa:'نرخ سرمایه‌گذاری مجدد MIRR (سالانه ٪)'},capital_period_label:{en:'Cash-flow interval',fa:'تناوب جریان نقد'},capital_annual:{en:'Annual',fa:'سالانه'},capital_quarterly:{en:'Quarterly',fa:'فصلی'},capital_monthly:{en:'Monthly',fa:'ماهانه'},capital_reset:{en:'Reset example',fa:'بازنشانی مثال'},capital_npv:{en:'Net present value (NPV)',fa:'ارزش فعلی خالص (NPV)'},capital_irr:{en:'Internal rate of return (IRR)',fa:'نرخ بازده داخلی (IRR)'},capital_mirr:{en:'Modified IRR (MIRR)',fa:'نرخ بازده داخلی تعدیل‌شده (MIRR)'},capital_pi:{en:'Profitability index (PI)',fa:'شاخص سودآوری (PI)'},capital_payback:{en:'Payback period',fa:'دوره بازگشت سرمایه'},capital_discounted_payback:{en:'Discounted payback',fa:'دوره بازگشت تنزیل‌شده'},capital_eaa:{en:'Equivalent annual annuity (EAA)',fa:'سالانه معادل (EAA)'},capital_waiting:{en:'Enter at least one inflow and one outflow.',fa:'حداقل یک جریان ورودی و یک جریان خروجی وارد کنید.'},capital_method_summary:{en:'Method & interpretation',fa:'روش و تفسیر'},capital_method_note:{en:'IRR may have multiple or no real solutions for non-conventional cash flows. MIRR separates finance and reinvestment rates. Payback assumes linear recovery within a period; taxes, fees, and mid-period timing are excluded.',fa:'برای جریان نقد نامتعارف ممکن است IRR چندجوابی یا بدون ریشه باشد. MIRR نرخ تأمین مالی و سرمایه‌گذاری مجدد را جدا می‌کند. دوره بازگشت، بازیافت خطی درون هر دوره را فرض می‌کند؛ مالیات، کارمزد و زمان‌بندی میان‌دوره‌ای لحاظ نشده‌اند.'},
 wacc_kicker:{en:'CAPITAL STRUCTURE',fa:'ساختار سرمایه'},wacc_title:{en:'Weighted Average Cost of Capital',fa:'میانگین موزون هزینه سرمایه'},wacc_description:{en:'Use market-value capital weights, marginal financing costs and a tax rate consistent with currency and nominal/real basis.',fa:'از وزن‌های ارزش بازار، هزینه نهایی تأمین مالی و نرخ مالیات سازگار با ارز و مبنای اسمی/واقعی استفاده کنید.'},wacc_equity_value:{en:'Market value of common equity',fa:'ارزش بازار حقوق صاحبان سهام عادی'},wacc_debt_value:{en:'Market value of debt',fa:'ارزش بازار بدهی'},wacc_preferred_value:{en:'Market value of preferred equity',fa:'ارزش بازار سهام ممتاز'},wacc_cost_equity:{en:'Cost of common equity (%)',fa:'هزینه حقوق صاحبان سهام عادی (٪)'},wacc_cost_debt:{en:'Pre-tax cost of debt (%)',fa:'هزینه بدهی پیش از مالیات (٪)'},wacc_cost_preferred:{en:'Cost of preferred equity (%)',fa:'هزینه سهام ممتاز (٪)'},wacc_tax:{en:'Marginal tax rate (%)',fa:'نرخ نهایی مالیات (٪)'},wacc_result:{en:'Weighted average cost of capital',fa:'میانگین موزون هزینه سرمایه'},wacc_equity_weight:{en:'Common equity weight',fa:'وزن حقوق صاحبان سهام عادی'},wacc_debt_weight:{en:'Debt weight',fa:'وزن بدهی'},wacc_preferred_weight:{en:'Preferred equity weight',fa:'وزن سهام ممتاز'},wacc_waiting:{en:'Enter positive total capital and valid financing costs.',fa:'کل سرمایه مثبت و هزینه‌های تأمین مالی معتبر وارد کنید.'},wacc_method_summary:{en:'Formula & analyst checks',fa:'فرمول و کنترل‌های تحلیل‌گر'},wacc_method_note:{en:'WACC = wE·rE + wD·rD·(1−T) + wP·rP. Weights use market values. Tax shields assume deductible interest; distress, issuance costs, and changing capital structure are excluded.',fa:'WACC = wE·rE + wD·rD·(1−T) + wP·rP. وزن‌ها بر اساس ارزش بازار هستند. سپر مالیاتی، قابلیت کسر بهره را فرض می‌کند؛ هزینه درماندگی، انتشار و تغییر ساختار سرمایه لحاظ نشده است.'},
 options_kicker:{en:'DERIVATIVES & RISK',fa:'مشتقه و ریسک'},options_title:{en:'Black–Scholes–Merton & Greeks',fa:'بلک–شولز–مرتون و یونانی‌ها'},options_european_badge:{en:'European options',fa:'اختیار اروپایی'},options_description:{en:'Estimate European call and put values using continuous compounding and dividend yield. Review sensitivities to spot, volatility, time and rates.',fa:'ارزش اختیار خرید و فروش اروپایی را با ترکیب پیوسته و بازده نقدی محاسبه کنید و حساسیت به قیمت، نوسان، زمان و نرخ را ببینید.'},option_spot:{en:'Underlying spot price (S)',fa:'قیمت لحظه‌ای دارایی پایه (S)'},option_strike:{en:'Strike price (K)',fa:'قیمت اعمال (K)'},option_maturity:{en:'Time to expiration (years)',fa:'زمان تا سررسید (سال)'},option_rate:{en:'Continuously compounded risk-free rate (%)',fa:'نرخ بدون ریسک پیوسته (٪)'},option_dividend:{en:'Continuous dividend yield (%)',fa:'بازده نقدی پیوسته (٪)'},option_volatility:{en:'Annualized volatility (%)',fa:'نوسان سالانه (٪)'},option_call:{en:'European call value',fa:'ارزش اختیار خرید اروپایی'},option_put:{en:'European put value',fa:'ارزش اختیار فروش اروپایی'},option_call_delta:{en:'Call delta',fa:'دلتا اختیار خرید'},option_put_delta:{en:'Put delta',fa:'دلتا اختیار فروش'},option_gamma:{en:'Gamma',fa:'گاما'},option_vega:{en:'Vega (per 1% volatility)',fa:'وگا (به‌ازای ۱٪ نوسان)'},option_call_theta:{en:'Call theta (annual)',fa:'تتا خرید (سالانه)'},option_put_theta:{en:'Put theta (annual)',fa:'تتا فروش (سالانه)'},option_call_rho:{en:'Call rho (per 1% rate)',fa:'رو خرید (به‌ازای ۱٪ نرخ)'},option_put_rho:{en:'Put rho (per 1% rate)',fa:'رو فروش (به‌ازای ۱٪ نرخ)'},options_ready:{en:'Illustrative values assume constant volatility and rates.',fa:'مقادیر نمونه، نوسان و نرخ ثابت را فرض می‌کنند.'},options_method_summary:{en:'Model assumptions',fa:'مفروضات مدل'},options_method_note:{en:'European exercise, lognormal prices, constant volatility and rates, frictionless trading, continuous dividend yield, and no early exercise. American options, discrete dividends, skew, and stochastic volatility are not modeled.',fa:'اعمال اروپایی، قیمت لگ‌نرمال، نوسان و نرخ ثابت، بازار بدون اصطکاک و بازده نقدی پیوسته فرض شده و اعمال زودهنگام لحاظ نشده است. اختیار آمریکایی، سود نقدی گسسته، چولگی و نوسان تصادفی مدل نشده‌اند.'}
});

// --- DOM Element Selectors ---
// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Asset Data
const valueEntry = document.getElementById('value-entry');
const addButton = document.getElementById('add-button');
const editSelect = document.getElementById('edit-select');
const editValueEntry = document.getElementById('edit-value-entry');
const saveEditButton = document.getElementById('save-edit-button');
const deleteButton = document.getElementById('delete-button');
const dataDisplay = document.getElementById('data-display');
const clearListButton = document.getElementById('clear-list-button');
const dedicatedFileDropAreaAsset = document.getElementById('dedicated-file-drop-area');
const fileImporterInputAsset = document.getElementById('file-importer-input-asset');

// Market Data
const marketValueEntry = document.getElementById('market-value-entry');
const addMarketDataButton = document.getElementById('add-market-data-button');
const marketDataDisplay = document.getElementById('market-data-display');
const clearMarketDataButton = document.getElementById('clear-market-data-button');

// Benchmark Data
const benchmarkValueEntry = document.getElementById('benchmark-value-entry');
const addBenchmarkDataButton = document.getElementById('add-benchmark-data-button');
const benchmarkDataDisplay = document.getElementById('benchmark-data-display');
const clearBenchmarkDataButton = document.getElementById('clear-benchmark-data-button');

// Equity Valuation
const currentDividendInput = document.getElementById('current-dividend');
const dividendGrowthRateInput = document.getElementById('dividend-growth-rate');
const requiredReturnEquityInput = document.getElementById('required-return-equity');
const earningsPerShareInput = document.getElementById('earnings-per-share');
const currentSharePriceInput = document.getElementById('current-share-price');
const calculateEquityButton = document.getElementById('calculate-equity-button');
const equityResultsDisplay = document.getElementById('equity-results-display');

// Fixed Income
const faceValueInput = document.getElementById('face-value');
const couponRateInput = document.getElementById('coupon-rate');
const yearsToMaturityInput = document.getElementById('years-to-maturity');
const marketPriceBondInput = document.getElementById('market-price-bond');
const ytmInputBond = document.getElementById('ytm-input');
const couponFrequencySelect = document.getElementById('coupon-frequency');
const calculateBondButton = document.getElementById('calculate-bond-button');
const fixedIncomeResultsDisplay = document.getElementById('fixed-income-results-display');
const plotBondPriceYieldButton = document.getElementById('plot-bond-price-yield-button');

// Portfolio Management
const portfolioAssetsContainer = document.getElementById('portfolio-assets-container');
const addPortfolioAssetButton = document.getElementById('add-portfolio-asset-button');
const portfolioRfRateInput = document.getElementById('portfolio-rf-rate');
const calculatePortfolioButton = document.getElementById('calculate-portfolio-button');
const portfolioResultsDisplay = document.getElementById('portfolio-results-display');


// General & Controls

const rfRateInput = document.getElementById('rf-rate'); // This is for Asset Analysis tab
const expectedMarketReturnInput = document.getElementById('expected-market-return');
const calculateButton = document.getElementById('calculate-button');
const plotHistButton = document.getElementById('plot-hist-button');
const plotBoxButton = document.getElementById('plot-box-button');
const plotEquityButton = document.getElementById('plot-equity-button');
const plotQqButton = document.getElementById('plot-qq-button');
const plotRegressionButton = document.getElementById('plot-regression-button');
const exportResultsButton = document.getElementById('export-results-button');
const statusBar = document.getElementById('status-bar');
const resultsDisplayDiv = document.getElementById('results-display');

// Plot Modal
const plotModal = document.getElementById('plotModal');
const plotModalLabel = document.getElementById('plotModalLabel');
const plotContainer = document.getElementById('plot-container');
const plotModalCloseButton = document.getElementById('plotModalCloseButton');


// --- Utility Functions ---
function parseLocalizedNumber(value) {
    if (typeof value === 'number') return value;
    const normalized = String(value ?? '').trim()
        .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
        .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
        .replace(/[٬,\s]/g, '')
        .replace(/[٫]/g, '.')
        .replace(/[−–]/g, '-')
        .replace(/٪|%/g, '');
    if (!normalized) return NaN;
    const result = Number(normalized);
    return Number.isFinite(result) ? result : NaN;
}

function _t(key, args = {}) {
    const langTexts = texts[key];
    let text = detailedHelpTexts[key]?.[currentLang] || (currentLang === 'fa' && faTexts[key] ? faTexts[key] : key);
    if (text === key && langTexts) text = currentLang === 'fa' ? (langTexts.fa || langTexts.en || key) : (langTexts.en || key);
    if (args && typeof args === 'object') {
        for (const argKey in args) {
            const regex = new RegExp(`\\{${argKey}\\}`, 'g'); // Simpler regex
            text = text.replace(regex, args[argKey]);
        }
    }
    return text;
}

function setAppTheme(theme) {
    currentTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = currentTheme;
    document.body.classList.toggle('theme-dark', currentTheme === 'dark');
    document.body.classList.toggle('theme-light', currentTheme === 'light');
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const labelKey = targetTheme === 'light' ? 'theme_switch_light' : 'theme_switch_dark';
    button.setAttribute('aria-pressed', String(currentTheme === 'dark'));
    button.setAttribute('aria-label', _t(labelKey));
    button.innerHTML = `<i class="fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i><span>${_t(labelKey)}</span>`;
}

function updateStatus(key, args = {}, type = 'info') {
    const message = _t(key, args);
    if (statusBar) {
        statusBar.dataset.statusKey = key; statusBar.dataset.statusType = type;
        statusBar.textContent = message;
        statusBar.className = 'status-bar p-2 rounded text-sm text-center'; // Reset classes
        switch (type) {
            case 'success': statusBar.classList.add('bg-green-500', 'text-white'); break;
            case 'error': statusBar.classList.add('bg-red-500', 'text-white'); break;
            case 'warning': statusBar.classList.add('bg-yellow-500', 'text-black'); break;
            case 'info': default: statusBar.classList.add('bg-dark-card', 'text-dark-text-muted'); break;
        }
    }
    console.log(`Status (${type}):`, message);
}

function updateLanguageUI() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const value = currentLang === 'fa' ? (faTexts[key] || texts[key]?.fa || texts[key]?.en) : texts[key]?.en;
        if (value) element.textContent = value;
    });

    
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const value = currentLang === 'fa' ? (faTexts[key] || texts[key]?.fa || texts[key]?.en) : texts[key]?.en;
        if (value) element.placeholder = value;
    });

    
    document.querySelectorAll('[data-tooltip-key]').forEach(element => {
        const key = element.getAttribute('data-tooltip-key');
        const value = _t(key);
        if (value) element.title = value;
    });

    document.querySelectorAll('[data-aria-label-key]').forEach(element => {
        const key = element.getAttribute('data-aria-label-key');
        const value = currentLang === 'fa' ? (faTexts[key] || texts[key]?.fa || texts[key]?.en) : texts[key]?.en;
        if (value) element.setAttribute('aria-label', value);
    });

    
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    
    document.body.classList.toggle('rtl', currentLang === 'fa');
    document.body.classList.toggle('ltr', currentLang === 'en');
    document.querySelectorAll('.tab-button[data-compact-en][data-compact-fa]').forEach(button => {
        button.dataset.compactLabel = currentLang === 'fa' ? button.dataset.compactFa : button.dataset.compactEn;
    });
    document.body.style.fontFamily = currentLang === 'fa' ? 'Tahoma, Arial, sans-serif' : 'Arial, sans-serif';
    document.title = _t('app_title');
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.content = _t('meta_description');
    if (ogTitle) ogTitle.content = _t('app_title');
    if (ogDescription) ogDescription.content = _t('meta_description');
    setAppTheme(currentTheme);
}





updateLanguageUI();

function formatNumber(value, digits = 2, addPercent = false) {
    if (value === Infinity) return "∞";
    if (value === -Infinity) return "-∞";
    if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
        return _t('value_invalid');
    }
    digits = Math.max(0, Math.floor(digits));
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const options = {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    };
    let formatted = new Intl.NumberFormat(locale, options).format(value);
    if (addPercent) {
        formatted = `${formatted}%`;
    }
    return formatted;
}

// --- Data Handling Functions (Generic for Asset, Market, Benchmark) ---
function addDataPointsToList(rawInput, targetList, listNameKey, dataTypeTextKey) {
    if (!rawInput) {
        updateStatus('status_empty_input', { dataType: _t(dataTypeTextKey) }, 'info');
        return 0; // No data added
    }
    const potentialValues = rawInput.split(/[\s,;\\n\t]+/).filter(val => val);
    let addedCount = 0;
    const invalidEntries = [];
    const newlyAddedData = [];

    potentialValues.forEach(rawVal => {
        const cleanedValue = rawVal.replace(/%/g, '').trim();
        if (!cleanedValue) return;
        const valueStr = cleanedValue.replace(',', '.'); // Handle comma as decimal separator
        const value = parseLocalizedNumber(valueStr);

        if (!isNaN(value) && isFinite(value) && value > -100) {
            newlyAddedData.push(value);
            addedCount++;
        } else {
            invalidEntries.push(rawVal);
        }
    });

    if (addedCount > 0) {
        targetList.push(...newlyAddedData);
        let statusKey = 'status_data_added';
        let statusArgs = { count: addedCount, dataType: _t(dataTypeTextKey) };
        let statusType = 'success';

        if (invalidEntries.length > 0) {
            statusKey = 'status_data_invalid';
            const entriesStr = `${invalidEntries.slice(0, 3).join(', ')}${invalidEntries.length > 3 ? '...' : ''}`;
            statusArgs['entries'] = entriesStr;
            statusType = 'warning';
            console.warn(_t(statusKey, statusArgs));
        }
        updateStatus(statusKey, statusArgs, statusType);
    } else if (invalidEntries.length > 0) {
        Swal.fire(_t('error_title'), _t('status_no_valid_data', { dataType: _t(dataTypeTextKey) }), 'error');
        updateStatus('status_no_valid_data', { dataType: _t(dataTypeTextKey) }, 'error');
    }
    return addedCount; // Return how many were actually added
}

function updateGenericDataDisplay(list, displayElement, emptyListOptionKey, itemPrefixKey) {
    const placeholder = displayElement ? displayElement.querySelector('.data-placeholder') : null;

    if (displayElement) {
        // Clear previous entries, keeping placeholder if it exists
        while (displayElement.firstChild && displayElement.firstChild !== placeholder) {
            displayElement.removeChild(displayElement.firstChild);
        }
         if (placeholder) placeholder.style.display = 'none';

        if (list.length === 0) {
            if (placeholder) {
                placeholder.textContent = _t(emptyListOptionKey);
                placeholder.style.display = 'block';
                if (!displayElement.contains(placeholder)) {
                    displayElement.appendChild(placeholder);
                }
            } else { // Create placeholder if it doesn't exist
                const p = document.createElement('p');
                p.className = 'text-dark-text-muted text-center p-1 data-placeholder';
                p.textContent = _t(emptyListOptionKey);
                displayElement.appendChild(p);
            }
        } else {
            if (placeholder) placeholder.style.display = 'none';
            const fragment = document.createDocumentFragment();
            list.forEach((p, i) => {
                const item = document.createElement('div');
                item.className = 'py-1 px-2 border-b border-dark-border last:border-b-0 flex justify-between items-center text-xs'; // Smaller text
                item.innerHTML = `<span class="text-dark-text-muted mr-1">${formatNumber(i + 1, 0)}.</span> <span class="font-mono text-dark-text">${formatNumber(p, 4)}%</span>`;
                fragment.appendChild(item);
            });
            displayElement.appendChild(fragment);
        }
    }
}

function clearGenericDataList(list, listNameKey, displayFunction, clearButtonElement) {
    if (list.length === 0) return;
    Swal.fire({
        title: _t('clear_list_confirm', {listName: _t(listNameKey)}),
        text: _t('confirm_clear_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('ok_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            list.length = 0; // Clears the array in place
            displayFunction();
            if (clearButtonElement) clearButtonElement.disabled = true;
            updateStatus('status_list_cleared', { listName: _t(listNameKey) }, 'success');
            Swal.fire(_t('cleared_title'), _t('status_list_cleared', { listName: _t(listNameKey) }), 'success');
        }
    });
}

// --- Asset Data Specific ---
function addAssetDataPoint() {
    const rawInput = valueEntry.value.trim();
    const added = addDataPointsToList(rawInput, dataPoints, 'data_list_title', 'add_data_title');
    if (added > 0) {
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateActionButtonsState();
    }
    valueEntry.value = '';
    valueEntry.focus();
}

function updateDataDisplay() {
    updateGenericDataDisplay(dataPoints, dataDisplay, 'list_empty_option', 'data_option_format');
    if(clearListButton) clearListButton.disabled = dataPoints.length === 0;
    updateActionButtonsState();
}

function updateEditOptions() {
    if (!editSelect) return;
    const currentSelectedIndexStr = editSelect.value;
    editSelect.innerHTML = `<option value="" data-translate="select_option">${_t('select_option')}</option>`;

    if (dataPoints.length === 0) {
        editSelect.options[0].textContent = _t('list_empty_option');
        editSelect.disabled = true;
    } else {
        dataPoints.forEach((p, i) => {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = _t('data_option_format', { index: formatNumber(i + 1, 0), value: formatNumber(p, 2) });
            editSelect.appendChild(option);
        });
        if (currentSelectedIndexStr !== "" && parseInt(currentSelectedIndexStr) < dataPoints.length) {
            editSelect.value = currentSelectedIndexStr;
            selectedEditIndex = parseInt(currentSelectedIndexStr);
        } else {
            selectedEditIndex = -1;
            editSelect.value = "";
        }
        editSelect.disabled = false;
    }
    updateEditControlsState();
}

function updateEditControlsState() {
    const hasData = dataPoints.length > 0;
    const itemSelected = selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length;

    if (editSelect) editSelect.disabled = !hasData;
    if (editValueEntry) editValueEntry.disabled = !itemSelected;
    if (saveEditButton) saveEditButton.disabled = !itemSelected;
    if (deleteButton) deleteButton.disabled = !itemSelected;

    if (!itemSelected && editValueEntry) editValueEntry.value = "";
}

function loadValueForEditFromMenu(event) {
    selectedEditIndex = event.target.value !== "" ? parseInt(event.target.value, 10) : -1;
     if (selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length) {
        editValueEntry.value = dataPoints[selectedEditIndex].toString(); // No formatting for edit
        editValueEntry.focus();
        editValueEntry.select();
    } else {
         editValueEntry.value = "";
    }
    updateEditControlsState();
}

function saveEditedValue() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        Swal.fire(_t('warning_title'), _t('status_select_edit'), 'warning');
        updateStatus('status_select_edit', {}, 'warning'); return;
    }
    const newValStr = editValueEntry.value.trim().replace(/%/g, '');
    if (!newValStr) {
        Swal.fire(_t('warning_title'), _t('status_edit_empty'), 'warning');
        updateStatus('status_edit_empty', {}, 'warning'); return;
    }
    const newVal = parseLocalizedNumber(newValStr.replace(',', '.'));

    if (isNaN(newVal) || !isFinite(newVal)) {
        Swal.fire(_t('error_title'), _t('status_edit_invalid'), 'error');
        updateStatus('status_edit_invalid', {}, 'error'); return;
    }
    try {
        const oldVal = dataPoints[selectedEditIndex];
        dataPoints[selectedEditIndex] = newVal;
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateActionButtonsState();
        updateStatus('status_data_edited', { index: formatNumber(selectedEditIndex + 1, 0), old_val: formatNumber(oldVal, 2), new_val: formatNumber(newVal, 2) }, 'success');
        editValueEntry.focus();
    } catch (e) {
        console.error("Error saving edited value:", e);
        Swal.fire(_t('error_title'), _t('status_edit_index_error'), 'error');
        updateStatus('status_edit_index_error', {}, 'error');
        selectedEditIndex = -1;
        updateEditOptions();
        updateEditControlsState();
    }
}

function deleteSelectedData() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        Swal.fire(_t('warning_title'), _t('status_select_delete'), 'warning');
        updateStatus('status_select_delete', {}, 'warning'); return;
    }
    Swal.fire({
        title: _t('delete_button') + ` data point ${formatNumber(selectedEditIndex + 1, 0)}?`,
        text: _t('data_option_format', {index: formatNumber(selectedEditIndex+1,0), value: formatNumber(dataPoints[selectedEditIndex], 2)}) + " " + _t('confirm_delete_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('delete_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const deletedVal = dataPoints.splice(selectedEditIndex, 1)[0];
                const deletedIndexHuman = selectedEditIndex + 1;
                selectedEditIndex = -1; if(editValueEntry) editValueEntry.value = '';
                updateDataDisplay(); updateEditOptions(); resetResultsDisplay(); updateEditControlsState(); updateActionButtonsState();
                updateStatus('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }, 'success');
                Swal.fire(_t('deleted_title'), _t('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }), 'success');
            } catch (e) {
                console.error("Error deleting data:", e);
                Swal.fire(_t('error_title'), _t('status_delete_index_error'), 'error');
                updateStatus('status_delete_index_error', {}, 'error');
                selectedEditIndex = -1; updateEditOptions(); updateEditControlsState();
            }
        }
    });
}

function clearAssetDataList() {
    clearGenericDataList(dataPoints, 'data_list_title', updateDataDisplay, clearListButton);
    resetResultsDisplay();
    updateActionButtonsState();
    updateEditOptions(); // Also reset edit options
}

// --- Market Data Specific ---
function addMarketDataPoint() {
    const rawInput = marketValueEntry.value.trim();
    const added = addDataPointsToList(rawInput, marketDataPoints, 'add_market_data_title', 'add_market_data_title');
    if (added > 0) {
        updateMarketDataDisplay();
        resetResultsDisplay(); // Market data change invalidates old results
        updateActionButtonsState();
    }
    marketValueEntry.value = '';
    marketValueEntry.focus();
}

function updateMarketDataDisplay() {
    updateGenericDataDisplay(marketDataPoints, marketDataDisplay, 'market_list_empty_option', 'market_data_item_prefix');
    if(clearMarketDataButton) clearMarketDataButton.disabled = marketDataPoints.length === 0;
}

function clearMarketDataPoints() {
    clearGenericDataList(marketDataPoints, 'add_market_data_title', updateMarketDataDisplay, clearMarketDataButton);
    resetResultsDisplay();
    updateActionButtonsState();
}

// --- Benchmark Data Specific ---
function addBenchmarkDataPoint() {
    const rawInput = benchmarkValueEntry.value.trim();
    const added = addDataPointsToList(rawInput, benchmarkDataPoints, 'add_benchmark_data_title', 'add_benchmark_data_title');
    if (added > 0) {
        updateBenchmarkDataDisplay();
        resetResultsDisplay(); // Benchmark data change invalidates old results
        updateActionButtonsState();
    }
    benchmarkValueEntry.value = '';
    benchmarkValueEntry.focus();
}

function updateBenchmarkDataDisplay() {
    updateGenericDataDisplay(benchmarkDataPoints, benchmarkDataDisplay, 'benchmark_list_empty_option', 'benchmark_data_item_prefix');
    if(clearBenchmarkDataButton) clearBenchmarkDataButton.disabled = benchmarkDataPoints.length === 0;
}

function clearBenchmarkDataPoints() {
    clearGenericDataList(benchmarkDataPoints, 'add_benchmark_data_title', updateBenchmarkDataDisplay, clearBenchmarkDataButton);
    resetResultsDisplay();
    updateActionButtonsState();
}

// --- File Import ---
let spreadsheetLibraryPromise = null;
function ensureSpreadsheetLibrary() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (spreadsheetLibraryPromise) return spreadsheetLibraryPromise;
    spreadsheetLibraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL('vendor/xlsx.full.min.js', document.baseURI).href;
        script.onload = () => {
            if (window.XLSX) resolve(window.XLSX);
            else { spreadsheetLibraryPromise = null; reject(new Error('xlsx-unavailable')); }
        };
        script.onerror = () => { spreadsheetLibraryPromise = null; reject(new Error('xlsx-unavailable')); };
        document.head.appendChild(script);
    });
    return spreadsheetLibraryPromise;
}

async function processImportedFile(file, targetList, listNameKey, dataTypeTextKey, displayUpdateFunction) {
    if (!file) {
        updateStatus('status_import_cancel', {}, 'warning');
        return;
    }
    updateStatus('status_importing', { filename: file.name, dataType: _t(dataTypeTextKey) }, 'info');

    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/plain'];
    const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.txt)$/i;
    const fileNameLower = file.name.toLowerCase();
    const fileType = file.type;
    const isAllowed = allowedTypes.includes(fileType) || allowedExtensions.test(fileNameLower);

    if (!isAllowed) {
        Swal.fire({ title: _t('error_title'), html: _t('invalid_format_msg'), icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_format_error', {}, 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const fileData = e.target.result;
            let importedData = [];

            if (fileNameLower.endsWith('.txt') || fileType === 'text/plain') {
                const textContent = new TextDecoder().decode(new Uint8Array(fileData));
                const lines = textContent.split(/\r?\n/);
                lines.forEach((line) => {
                    const cleanedLine = line.replace(/%/g, '').trim();
                    if (cleanedLine !== '') {
                        const valueStr = cleanedLine.replace(',', '.');
                        const val = parseLocalizedNumber(valueStr);
                        if (!isNaN(val) && isFinite(val)) importedData.push(val);
                    }
                });
            } else { // CSV or Excel
                await ensureSpreadsheetLibrary();
                let workbook;
                if (fileNameLower.endsWith('.csv')) {
                    const csvStr = new TextDecoder().decode(new Uint8Array(fileData));
                    workbook = XLSX.read(csvStr, { type: 'string', cellDates: false });
                } else {
                    workbook = XLSX.read(fileData, { type: 'array', cellDates: false });
                }
                if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) throw new Error("Cannot read workbook.");
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
                if (jsonData.length === 0) throw new Error("Sheet is empty.");

                let numericColumnFound = false;
                const numCols = jsonData[0]?.length || 0;
                if (numCols > 0) {
                    for (let j = 0; j < numCols; j++) { // Iterate columns
                        let tempColData = [];
                        let numericCount = 0;
                        for (let i = 0; i < jsonData.length; i++) { // Iterate rows
                            if (jsonData[i] && jsonData[i][j] !== null && jsonData[i][j] !== undefined) {
                                let val;
                                if (typeof jsonData[i][j] === 'number' && isFinite(jsonData[i][j])) {
                                    val = jsonData[i][j];
                                } else if (typeof jsonData[i][j] === 'string') {
                                    const cleanedValue = jsonData[i][j].replace(/%/g, '').trim();
                                    if (cleanedValue !== '') val = parseLocalizedNumber(cleanedValue.replace(',', '.'));
                                }
                                if (val !== undefined && !isNaN(val) && isFinite(val) && val > -100) {
                                    tempColData.push(val);
                                    numericCount++;
                                }
                            }
                        }
                        // Heuristic: if more than half the non-empty cells in a column are numeric, use it.
                        const nonEmptyCellsInCol = jsonData.filter(row => row && row[j] !== null && row[j] !== undefined).length;
                        if (nonEmptyCellsInCol > 0 && numericCount >= nonEmptyCellsInCol / 2 && tempColData.length > 0) {
                            importedData = tempColData;
                            numericColumnFound = true;
                            break;
                        }
                    }
                }
                if (!numericColumnFound) throw new Error(_t('status_import_no_numeric', { dataType: _t(dataTypeTextKey) }));
            }

            importedData = importedData.filter(value => Number.isFinite(value) && value > -100);
            if (importedData.length > 0) {
                targetList.push(...importedData);
                displayUpdateFunction();
                resetResultsDisplay();
                updateActionButtonsState();
                updateStatus('status_import_success', { count: importedData.length, dataType: _t(dataTypeTextKey) }, 'success');
            } else {
                updateStatus('status_import_no_valid', { dataType: _t(dataTypeTextKey) }, 'error');
                Swal.fire(_t('error_title'), _t('status_import_no_valid', { dataType: _t(dataTypeTextKey) }), 'error');
            }
        } catch (error) {
            console.error(`Error processing file for ${listNameKey}:`, error);
            Swal.fire({ title: _t('error_title'), text: _t('status_import_error', { dataType: _t(dataTypeTextKey) }) + `\n${error.message}`, icon: 'error', confirmButtonText: _t('ok_button') });
            updateStatus('status_import_error', { error: error.message, dataType: _t(dataTypeTextKey) }, 'error');
        }
    };
    reader.onerror = function() {
        Swal.fire({ title: _t('error_title'), text: _t('status_import_error', { dataType: _t(dataTypeTextKey) }), icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_error', { dataType: _t(dataTypeTextKey) }, 'error');
    };
    reader.readAsArrayBuffer(file);
}

function setupDragAndDrop(dropAreaElement, fileInputElement, targetList, listNameKey, dataTypeTextKey, displayUpdateFunction) {
    if (!dropAreaElement) {
        console.warn(`Drop area for ${listNameKey} not found.`);
        return;
    }
    dropAreaElement.addEventListener('click', () => {
        if (fileInputElement) fileInputElement.click();
    });

    if (fileInputElement) {
        fileInputElement.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                await processImportedFile(files[0], targetList, listNameKey, dataTypeTextKey, displayUpdateFunction);
                event.target.value = null; // Reset file input
            } else {
                updateStatus('status_import_cancel', {}, 'warning');
            }
        });
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropAreaElement.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });
    dropAreaElement.addEventListener('dragenter', () => dropAreaElement.classList.add('drag-over-active'));
    dropAreaElement.addEventListener('dragover', (event) => {
        dropAreaElement.classList.add('drag-over-active');
        event.dataTransfer.dropEffect = 'copy';
    });
    dropAreaElement.addEventListener('dragleave', (event) => {
        if (!dropAreaElement.contains(event.relatedTarget)) {
            dropAreaElement.classList.remove('drag-over-active');
        }
    });
    dropAreaElement.addEventListener('drop', async (event) => {
        dropAreaElement.classList.remove('drag-over-active');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            await processImportedFile(files[0], targetList, listNameKey, dataTypeTextKey, displayUpdateFunction);
        } else {
            updateStatus('status_import_cancel', {}, 'warning');
        }
    });
}


// --- Calculation Functions ---
function calculateMean(data) { if (!data || data.length === 0) return NaN; const sum = data.reduce((acc, val) => acc + val, 0); return sum / data.length; }
function calculateExtrema(data) { if (!data || data.length === 0) return { min: NaN, max: NaN }; return data.reduce((result, value) => ({ min: Math.min(result.min, value), max: Math.max(result.max, value) }), { min: Infinity, max: -Infinity }); }
function calculateStdDev(data, isSample = true) { if (!data || data.length < (isSample ? 2 : 1)) return NaN; const mean = calculateMean(data); if (isNaN(mean)) return NaN; const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - (isSample ? 1 : 0)); return Math.sqrt(variance); }
function calculatePercentile(data, percentile) { if (!data || data.length === 0 || percentile < 0 || percentile > 100) return NaN; const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; if (percentile === 0) return sortedData[0]; if (percentile === 100) return sortedData[n - 1]; const index = (percentile / 100) * (n - 1); const lowerIndex = Math.floor(index); const upperIndex = Math.ceil(index); const weight = index - lowerIndex; if (lowerIndex === upperIndex) return sortedData[lowerIndex]; else { const lowerValue = sortedData[lowerIndex] ?? sortedData[0]; const upperValue = sortedData[upperIndex] ?? sortedData[n-1]; return lowerValue * (1 - weight) + upperValue * weight; }}
function logGamma(value) {
    const coefficients=[676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];
    if(value<0.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*value))-logGamma(1-value);
    const z=value-1;let x=0.9999999999998099;
    for(let i=0;i<coefficients.length;i++)x+=coefficients[i]/(z+i+1);
    const t=z+7.5;
    return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
}
function betaContinuedFraction(a,b,x) {
    const maxIterations=200,epsilon=3e-14,tiny=1e-300;
    const qab=a+b,qap=a+1,qam=a-1;let c=1,d=1-qab*x/qap;
    if(Math.abs(d)<tiny)d=tiny;d=1/d;let h=d;
    for(let m=1;m<=maxIterations;m++){
        const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));
        d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;h*=d*c;
        aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<tiny)d=tiny;c=1+aa/c;if(Math.abs(c)<tiny)c=tiny;d=1/d;const delta=d*c;h*=delta;
        if(Math.abs(delta-1)<epsilon)break;
    }
    return h;
}
function regularizedIncompleteBeta(x,a,b) {
    if(!(a>0&&b>0)||x<0||x>1)return NaN;
    if(x===0)return 0;if(x===1)return 1;
    const factor=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
    return x<(a+1)/(a+b+2)?factor*betaContinuedFraction(a,b,x)/a:1-factor*betaContinuedFraction(b,a,1-x)/b;
}
function twoSidedStudentTPValue(tStatistic,degreesOfFreedom) {
    if(!Number.isFinite(tStatistic)||!Number.isInteger(degreesOfFreedom)||degreesOfFreedom<1)return NaN;
    const x=degreesOfFreedom/(degreesOfFreedom+tStatistic*tStatistic);
    return Math.max(0,Math.min(1,regularizedIncompleteBeta(x,degreesOfFreedom/2,0.5)));
}

function calculateRegression(assetReturns, marketReturns) {
    if (!assetReturns || !marketReturns || assetReturns.length !== marketReturns.length || assetReturns.length < 2) {
        console.warn("Regression: Insufficient or mismatched data.");
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
    if (typeof ss === 'undefined') {
        console.error("simple-statistics (ss) is not loaded. Cannot perform regression.");
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
    const n = assetReturns.length;
    const pairedData = assetReturns.map((assetRet, i) => [marketReturns[i], assetRet]);

    try {
        const regression = ss.linearRegression(pairedData);
        const beta = regression.m;
        const alpha = regression.b;
        const lineFunc = ss.linearRegressionLine(regression);
        const rSquared = ss.rSquared(pairedData, lineFunc);

        if (n <= 2) { // Not enough data for significance tests (df = n-2)
            return { beta, alpha, rSquared, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const residuals = assetReturns.map((y, i) => y - lineFunc(marketReturns[i]));
        const sumSqResiduals = residuals.reduce((sum, r) => sum + r * r, 0);
        const stdErrRegression = Math.sqrt(sumSqResiduals / (n - 2));

        const meanMarket = ss.mean(marketReturns);
        const sumSqDevMarket = marketReturns.reduce((sum, x) => sum + Math.pow(x - meanMarket, 2), 0);

        if (sumSqDevMarket < 1e-9) { // Avoid division by zero if market returns are constant
            return { beta, alpha, rSquared, stdErrRegression, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const stdErrBeta = stdErrRegression / Math.sqrt(sumSqDevMarket);
        const tStatBeta = beta / stdErrBeta;
        const stdErrAlpha = stdErrRegression * Math.sqrt((1/n) + (Math.pow(meanMarket, 2) / sumSqDevMarket));
        const tStatAlpha = alpha / stdErrAlpha;

        const degreesOfFreedom=n-2;
        return { beta, alpha, rSquared, stdErrRegression, tStatBeta, pValBeta: twoSidedStudentTPValue(tStatBeta,degreesOfFreedom), tStatAlpha, pValAlpha: twoSidedStudentTPValue(tStatAlpha,degreesOfFreedom) };
    } catch (e) {
        console.error("Error during regression calculation:", e);
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
}

function calculateTrackingError(assetReturns, benchmarkReturns) {
    if (!assetReturns || !benchmarkReturns || assetReturns.length !== benchmarkReturns.length || assetReturns.length === 0) return NaN;
    const diffReturns = assetReturns.map((ar, i) => ar - benchmarkReturns[i]);
    return calculateStdDev(diffReturns);
}

function calculateInformationRatio(assetReturns, benchmarkReturns) {
    if (!assetReturns || !benchmarkReturns || assetReturns.length !== benchmarkReturns.length || assetReturns.length === 0) return NaN;
    const meanAssetReturn = calculateMean(assetReturns);
    const meanBenchmarkReturn = calculateMean(benchmarkReturns);
    const activeReturn = meanAssetReturn - meanBenchmarkReturn;
    const trackingError = calculateTrackingError(assetReturns, benchmarkReturns);
    if (isNaN(activeReturn) || isNaN(trackingError) || Math.abs(trackingError) < 1e-9) return NaN;
    return activeReturn / trackingError;
}

function calculateCAPMExpectedReturn(rf, beta, expectedMarketReturn) {
    if (isNaN(rf) || isNaN(beta) || isNaN(expectedMarketReturn)) return NaN;
    return rf + beta * (expectedMarketReturn - rf);
}

// --- Equity Valuation Calculations ---
function calculateDDM(D0, g, r) {
    // D0: Current Dividend, g: Growth Rate (%), r: Required Return (%), all as percentages
    // Convert g and r to decimals
    const g_dec = g / 100;
    const r_dec = r / 100;

    if (r_dec <= g_dec) {
        return NaN; // Required return must be greater than growth rate
    }
    if (D0 < 0) return NaN; // Dividend cannot be negative for this model
    return D0 * (1 + g_dec) / (r_dec - g_dec);
}

function calculateGGM(D1, r, g) {
    // D1: Next Expected Dividend, r: Required Return (%), g: Growth Rate (%), all as percentages
    // Convert r and g to decimals
    const r_dec = r / 100;
    const g_dec = g / 100;

    if (r_dec <= g_dec) {
        return NaN; // Required return must be greater than growth rate
    }
    if (D1 < 0) return NaN; // Dividend cannot be negative for this model
    return D1 / (r_dec - g_dec);
}

function calculatePERatio(currentSharePrice, EPS) {
    if (EPS <= 0 || currentSharePrice <= 0) {
        return NaN; // EPS must be positive for a meaningful P/E ratio
    }
    return currentSharePrice / EPS;
}

// --- Fixed Income Calculations ---
function calculateBondPrice(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    // faceValue: bond's face value
    // couponRate: annual coupon rate as percentage
    // yearsToMaturity: years
    // ytm: yield to maturity as percentage
    // couponFrequency: payments per year (1, 2, 4, 12)

    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm <= -100 * couponFrequency || couponFrequency <= 0 || !Number.isInteger(yearsToMaturity * couponFrequency)) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let bondPrice = 0;

    // Present value of coupon payments (annuity)
    if (ratePerPeriod === 0) { // Handle zero interest rate
        bondPrice += couponPayment * numPeriods;
    } else {
        bondPrice += couponPayment * (1 - Math.pow(1 + ratePerPeriod, -numPeriods)) / ratePerPeriod;
    }

    // Present value of face value (lump sum)
    bondPrice += faceValue / Math.pow(1 + ratePerPeriod, numPeriods);

    return bondPrice;
}

function calculateYTM(faceValue, couponRate, yearsToMaturity, marketPrice, couponFrequency) {
    if (![faceValue,couponRate,yearsToMaturity,marketPrice,couponFrequency].every(Number.isFinite) || faceValue<=0 || couponRate<0 || yearsToMaturity<=0 || marketPrice<=0 || couponFrequency<=0 || !Number.isInteger(yearsToMaturity*couponFrequency)) return NaN;
    const maxIterations = 1000;
    const tolerance = 0.0001; // 0.01% difference in price

    let lowYTM = -couponFrequency + 1e-9;
    let highYTM = 10;
    const lowPrice=calculateBondPrice(faceValue,couponRate,yearsToMaturity,lowYTM*100,couponFrequency);
    const highPrice=calculateBondPrice(faceValue,couponRate,yearsToMaturity,highYTM*100,couponFrequency);
    if(!Number.isFinite(lowPrice)||!Number.isFinite(highPrice)||lowPrice<marketPrice||highPrice>marketPrice)return NaN;
    let currentYTM = (lowYTM + highYTM) / 2;

    for (let i = 0; i < maxIterations; i++) {
        const priceAtCurrentYTM = calculateBondPrice(faceValue, couponRate, yearsToMaturity, currentYTM * 100, couponFrequency);
        const diff = priceAtCurrentYTM - marketPrice;

        if (Math.abs(diff) < tolerance) {
            return currentYTM * 100; // Return as percentage
        }

        if (diff > 0) { // Price at current YTM is too high, so YTM must be higher
            lowYTM = currentYTM;
        } else { // Price at current YTM is too low, so YTM must be lower
            highYTM = currentYTM;
        }
        currentYTM = (lowYTM + highYTM) / 2;

        if (lowYTM >= highYTM - 1e-9) { // Prevent infinite loop if bounds converge too slowly
            break;
        }
    }
    return NaN; // Could not converge
}

function calculateMacaulayDuration(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm <= -100 * couponFrequency || couponFrequency <= 0 || !Number.isInteger(yearsToMaturity * couponFrequency)) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let sumPVofCF_times_t = 0;
    let bondPrice = 0;

    for (let t = 1; t <= numPeriods; t++) {
        const cashFlow = (t === numPeriods) ? (couponPayment + faceValue) : couponPayment;
        const pv_cf = cashFlow / Math.pow(1 + ratePerPeriod, t);
        sumPVofCF_times_t += pv_cf * t;
        bondPrice += pv_cf; // Summing up PVs to get bond price
    }

    if (bondPrice === 0) return NaN;
    return (sumPVofCF_times_t / bondPrice) / couponFrequency; // Convert back to years
}

function calculateModifiedDuration(macaulayDuration, ytm, couponFrequency) {
    if (isNaN(macaulayDuration) || ytm <= -100 * couponFrequency || couponFrequency <= 0) return NaN;
    const ytm_dec = ytm / 100;
    return macaulayDuration / (1 + (ytm_dec / couponFrequency));
}

function calculateConvexity(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm <= -100 * couponFrequency || couponFrequency <= 0 || !Number.isInteger(yearsToMaturity * couponFrequency)) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let sum_t_tplus1_PVofCF = 0;
    let bondPrice = 0;

    for (let t = 1; t <= numPeriods; t++) {
        const cashFlow = (t === numPeriods) ? (couponPayment + faceValue) : couponPayment;
        const pv_cf = cashFlow / Math.pow(1 + ratePerPeriod, t);
        sum_t_tplus1_PVofCF += pv_cf * t * (t + 1);
        bondPrice += pv_cf;
    }

    if (bondPrice === 0) return NaN;
    return (sum_t_tplus1_PVofCF / (bondPrice * Math.pow(1 + ratePerPeriod, 2))) / Math.pow(couponFrequency, 2);
}

// --- Portfolio Management Calculations ---
// --- Portfolio Management Specific Functions ---

function addPortfolioAsset() {
    const newAsset = {
        id: nextAssetId++,
        name: _t('portfolio_asset_default_name', { id: nextAssetId - 1 }),
        return: NaN,
        stdDev: NaN,
        weight: NaN,
        correlations: {} // Store correlations with other assets by their ID
    };
    portfolioAssets.push(newAsset);
    updatePortfolioAssetUI();
    updateStatus('portfolio_asset_added', { name: newAsset.name }, 'success');
    resetPortfolioResultsDisplay();
}

function removePortfolioAsset(assetId) {
    Swal.fire({
        title: _t('confirm_delete_text'),
        text: _t('portfolio_asset_removed', { name: portfolioAssets.find(a => a.id === assetId)?.name || `ID ${assetId}` }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('delete_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            const initialLength = portfolioAssets.length;
            portfolioAssets = portfolioAssets.filter(asset => asset.id !== assetId);
            // Also remove correlations involving the deleted asset
            portfolioAssets.forEach(asset => {
                delete asset.correlations[assetId];
            });
            if (portfolioAssets.length < initialLength) {
                updatePortfolioAssetUI();
                resetPortfolioResultsDisplay();
                updateStatus('portfolio_asset_removed', { name: `ID ${assetId}` }, 'success');
            }
        }
    });
}

function updatePortfolioAssetUI() {
    if (!portfolioAssetsContainer) return;
    portfolioAssetsContainer.innerHTML = ''; // Clear existing assets

    portfolioAssets.forEach((asset, index) => {
        const assetDiv = document.createElement('div');
        assetDiv.id = `portfolio-asset-${asset.id}`;
        assetDiv.className = 'bg-dark-card p-4 rounded-lg shadow-md border border-dark-border relative';
        assetDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-3 text-primary">${_t('portfolio_asset_default_name', { id: index + 1 })}</h3>
            <button type="button" class="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xl" data-remove-portfolio-asset="${asset.id}" aria-label="${_t('portfolio_remove_asset')}" data-tooltip-key="help_portfolio_remove" title="${_t('help_portfolio_remove')}">&times;</button>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="asset-${asset.id}-name" class="text-base font-semibold" data-translate="portfolio_asset_name_label"></label>
                    <input type="text" id="asset-${asset.id}-name" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" value="${escapeCompanyHtml(asset.name)}" data-translate-placeholder="portfolio_asset_name_placeholder" data-portfolio-asset-id="${asset.id}" data-portfolio-field="name">
                </div>
                <div>
                    <label for="asset-${asset.id}-return" class="text-base font-semibold" data-translate="portfolio_asset_return_label"></label>
                    <input type="number" id="asset-${asset.id}-return" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_return_placeholder')}" value="${isNaN(asset.return) ? '' : asset.return}" data-portfolio-asset-id="${asset.id}" data-portfolio-field="return">
                </div>
                <div>
                    <label for="asset-${asset.id}-stddev" class="text-base font-semibold" data-translate="portfolio_asset_stddev_label"></label>
                    <input type="number" id="asset-${asset.id}-stddev" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_stddev_placeholder')}" value="${isNaN(asset.stdDev) ? '' : asset.stdDev}" data-portfolio-asset-id="${asset.id}" data-portfolio-field="stdDev">
                </div>
                <div class="md:col-span-3">
                    <label for="asset-${asset.id}-weight" class="text-base font-semibold" data-translate="portfolio_asset_weight_label"></label>
                    <input type="number" id="asset-${asset.id}-weight" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_weight_placeholder')}" value="${isNaN(asset.weight) ? '' : asset.weight}" data-portfolio-asset-id="${asset.id}" data-portfolio-field="weight">
                </div>
            </div>
            <div class="mt-4 border-t border-dark-border pt-4">
                <h4 class="text-md font-semibold mb-2" data-translate="correlations_title"></h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="asset-${asset.id}-correlations-container">
                    <!-- Correlations will be added here -->
                </div>
            </div>
        `;
        portfolioAssetsContainer.appendChild(assetDiv);

        const correlationsContainer = assetDiv.querySelector(`#asset-${asset.id}-correlations-container`);
        portfolioAssets.forEach(otherAsset => {
            if (otherAsset.id !== asset.id) {
                const correlationDiv = document.createElement('div');
                correlationDiv.className = 'flex items-center gap-2';
                correlationDiv.innerHTML = `
                    <label for="corr-${asset.id}-with-${otherAsset.id}" class="text-sm text-dark-text-muted whitespace-nowrap" data-translate="portfolio_asset_correlation_label"></label>
                    <input type="number" id="corr-${asset.id}-with-${otherAsset.id}" class="flex-grow bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" step="0.01" min="-1" max="1" placeholder="${_t('portfolio_asset_correlation_placeholder')}" value="${isNaN(asset.correlations[otherAsset.id]) ? '' : asset.correlations[otherAsset.id]}" data-portfolio-correlation="${asset.id}:${otherAsset.id}">
                `;
                correlationsContainer.appendChild(correlationDiv);
            }
        });
    });
    updateLanguageUI(); // Re-apply translations for new elements
    decorateResearchTooltips(portfolioAssetsContainer);
}

function updatePortfolioAssetData(assetId, field, value) {
    const asset = portfolioAssets.find(a => a.id === assetId);
    if (asset) {
        if (field === 'name') {
            asset[field] = value;
        } else {
            const parsedValue = parseLocalizedNumber(value);
            asset[field] = isNaN(parsedValue) ? NaN : parsedValue;
        }
        // updateStatus('portfolio_asset_updated', { name: asset.name }, 'info'); // Too chatty
        resetPortfolioResultsDisplay();
    }
}

function updatePortfolioAssetCorrelation(assetId1, assetId2, value) {
    const asset1 = portfolioAssets.find(a => a.id === assetId1);
    const asset2 = portfolioAssets.find(a => a.id === assetId2);
    if (asset1 && asset2) {
        const parsedValue = parseLocalizedNumber(value);
        const correlation = isNaN(parsedValue) ? NaN : parsedValue;

        if (correlation < -1 || correlation > 1) {
            Swal.fire(_t('error_title'), _t('correlation_range_error'), 'error');
            // Reset input field if invalid
            document.getElementById(`corr-${assetId1}-with-${assetId2}`).value = isNaN(asset1.correlations[assetId2]) ? '' : asset1.correlations[assetId2];
            return;
        }

        asset1.correlations[asset2.id] = correlation;
        asset2.correlations[asset1.id] = correlation; // Ensure symmetry
        // updateStatus('portfolio_asset_updated', { name: `${asset1.name}-${asset2.name} correlation` }, 'info'); // Too chatty
        resetPortfolioResultsDisplay();
    }
}

// --- Main Calculation Orchestration ---
function calculateMetrics() {
    updateStatus('status_calculating', { dataType: _t('tab_asset_analysis') }, 'info');
    calculatedResults = {}; // Reset results

    if (dataPoints.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }
    if (dataPoints.length < 2) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }

    const rfRate = parseLocalizedNumber(rfRateInput.value);
    const expectedMarketReturn = parseLocalizedNumber(expectedMarketReturnInput.value);

    if (isNaN(rfRate) || rfRate <= -100) {
        Swal.fire(_t('error_title'), _t('status_rf_error'), 'error');
        updateStatus('status_rf_error', {}, 'error');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }
    if (isNaN(expectedMarketReturn)) {
        Swal.fire(_t('error_title'), _t('status_expected_market_return_error'), 'error');
        updateStatus('status_expected_market_return_error', {}, 'error');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }

    const frequency = Number(document.getElementById('return-frequency')?.value);
    if (!Number.isFinite(frequency) || frequency <= 0) {
        Swal.fire(_t('warning_title'), _t('return_frequency_required'), 'warning');
        updateStatus('return_frequency_required', {}, 'warning');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }

    const n = dataPoints.length;
    const periodsPerYear = frequency;
    const periodScale = Math.sqrt(periodsPerYear);
    const periodicRf = (Math.pow(1 + rfRate / 100, 1 / periodsPerYear) - 1) * 100;
    const mean = calculateMean(dataPoints) * periodsPerYear;
    const stdDev = calculateStdDev(dataPoints) * periodScale;
    const geoMeanPeriod = calculateGeometricMean(dataPoints);
    const geoMean = Number.isFinite(geoMeanPeriod) && geoMeanPeriod > -100 ? (Math.pow(1 + geoMeanPeriod / 100, periodsPerYear) - 1) * 100 : NaN;
    const downsideDev = calculateDownsideDeviation(dataPoints) * periodScale;
    const variance = Math.pow(stdDev, 2);
    const cv = mean === 0 ? NaN : stdDev / Math.abs(mean);
    const mddResult = calculateMaxDrawdown(dataPoints);
    const skewness = calculateSkewness(dataPoints);
    const kurtosis = calculateKurtosis(dataPoints);
    const var5 = calculatePercentile(dataPoints, 5);
    const var95 = calculatePercentile(dataPoints, 95);
    const cvar5 = calculateCVaR(dataPoints, 5);
    const maxGain = calculateExtrema(dataPoints).max;

    // Regression Analysis (CAPM)
    let regressionParams = { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    if (marketDataPoints.length === dataPoints.length && dataPoints.length >= 2) {
        regressionParams = calculateRegression(dataPoints.map(value => value * periodsPerYear), marketDataPoints.map(value => value * periodsPerYear));
    }
    const capmExpectedReturn = calculateCAPMExpectedReturn(rfRate, regressionParams.beta, expectedMarketReturn);

    // Benchmark Analysis
    let trackingError = NaN;
    let informationRatio = NaN;
    if (benchmarkDataPoints.length === dataPoints.length && dataPoints.length >= 2) {
        trackingError = calculateTrackingError(dataPoints, benchmarkDataPoints) * periodScale;
        informationRatio = calculateInformationRatio(dataPoints, benchmarkDataPoints) * periodScale;
    }

    // CFA Metrics
    const sharpeRatio = calculateSharpeRatio(dataPoints, periodicRf) * periodScale;
    const sortinoRatio = calculateSortinoRatio(dataPoints, periodicRf, periodicRf) * periodScale;
    const omegaRatio = calculateOmegaRatio(dataPoints, periodicRf);

    const treynorRatio = calculateTreynorRatio(mean, rfRate, regressionParams.beta);
    const calmarRatio = calculateCalmarRatio(geoMean, mddResult.maxDrawdown);
    const jensenAlpha = calculateJensenAlpha(mean, rfRate, expectedMarketReturn, regressionParams.beta);
    const m2Measure = calculateM2Measure(mean, stdDev, calculateStdDev(marketDataPoints) * periodScale, rfRate);
    const alphaTStat = regressionParams.tStatAlpha;

    calculatedResults = {
        n: n,
        data: dataPoints, // Store data for plotting
        rf: rfRate,
        expectedMarketReturn: expectedMarketReturn,
        mean: mean,
        stdDev: stdDev,
        geoMean: geoMean,
        downsideDev: downsideDev,
        variance: variance,
        cv: cv,
        mdd: mddResult.maxDrawdown,
        mdd_period: mddResult.duration,
        skewness: skewness,
        kurtosis: kurtosis,
        var5: var5,
        var95: var95,
        cvar5: cvar5,
        maxGain: maxGain,
        sharpeRatio: sharpeRatio,
        sortinoRatio: sortinoRatio,
        omegaRatio: omegaRatio,
        treynorRatio: treynorRatio,
        calmarRatio: calmarRatio,
        jensenAlpha: jensenAlpha,
        m2Measure: m2Measure,
        alphaTStat: alphaTStat,
        beta: regressionParams.beta,
        alpha: regressionParams.alpha,
        rSquared: regressionParams.rSquared,
        capmExpectedReturn: capmExpectedReturn,
        regStdErr: regressionParams.stdErrRegression,
        betaTStat: regressionParams.tStatBeta,
        betaPValue: regressionParams.pValBeta,
        alphaPValue: regressionParams.pValAlpha,
        trackingError: trackingError,
        informationRatio: informationRatio
    };

    updateResultsUI(calculatedResults);
    updateActionButtonsState();
    updateStatus('status_calc_done', { dataType: _t('tab_asset_analysis') }, 'success');
}

// --- Equity Valuation Orchestration ---
function calculateEquityValuation() {
    updateStatus('status_calculating', { dataType: _t('equity_valuation_title') }, 'info');
    equityCalculatedResults = {};

    const D0 = parseLocalizedNumber(currentDividendInput.value);
    const g = parseLocalizedNumber(dividendGrowthRateInput.value);
    const r = parseLocalizedNumber(requiredReturnEquityInput.value);
    const EPS = parseLocalizedNumber(earningsPerShareInput.value);
    const currentPrice = parseLocalizedNumber(currentSharePriceInput.value);

    if (isNaN(D0) || isNaN(g) || isNaN(r) || isNaN(EPS) || isNaN(currentPrice)) {
        Swal.fire(_t('error_title'), _t('equity_input_error'), 'error');
        updateStatus('status_calc_error', { error: _t('equity_input_error') }, 'error');
        resetEquityResultsDisplay();
        return;
    }

    // DDM / GGM
    if (r <= g) {
        equityCalculatedResults['ddm'] = NaN;
        equityCalculatedResults['ggm'] = NaN;
        Swal.fire(_t('warning_title'), _t('ddm_ggm_error'), 'warning');
    } else {
        equityCalculatedResults['ddm'] = calculateDDM(D0, g, r);
        equityCalculatedResults['ggm'] = calculateGGM(D0 * (1 + g / 100), r, g); // D1 = D0 * (1+g)
    }

    // P/E Ratio
    if (EPS <= 0 || currentPrice <= 0) {
        equityCalculatedResults['peRatio'] = NaN;
        Swal.fire(_t('warning_title'), _t('eps_price_error'), 'warning');
    } else {
        equityCalculatedResults['peRatio'] = calculatePERatio(currentPrice, EPS);
    }

    updateEquityResultsUI();
    updateStatus('status_calc_done', { dataType: _t('equity_valuation_title') }, 'success');
}

// --- Fixed Income Orchestration ---
function calculateFixedIncome() {
    updateStatus('status_calculating', { dataType: _t('fixed_income_title') }, 'info');
    fixedIncomeCalculatedResults = {};

    const faceValue = parseLocalizedNumber(faceValueInput.value);
    const couponRate = parseLocalizedNumber(couponRateInput.value);
    const yearsToMaturity = parseLocalizedNumber(yearsToMaturityInput.value);
    const marketPrice = parseLocalizedNumber(marketPriceBondInput.value);
    const ytmInput = parseLocalizedNumber(ytmInputBond.value);
    const couponFrequency = parseInt(couponFrequencySelect.value);

    if (isNaN(faceValue) || isNaN(couponRate) || isNaN(yearsToMaturity) || isNaN(marketPrice) || isNaN(ytmInput) || isNaN(couponFrequency) || faceValue<=0 || couponRate<0 || yearsToMaturity<=0 || marketPrice<=0 || ytmInput<=-100*couponFrequency || couponFrequency<=0 || !Number.isInteger(yearsToMaturity*couponFrequency)) {
        Swal.fire(_t('error_title'), _t('bond_input_error'), 'error');
        updateStatus('status_calc_error', { error: _t('bond_input_error') }, 'error');
        resetFixedIncomeResultsDisplay();
        return;
    }

    // Calculate Bond Price (using YTM input)
    fixedIncomeCalculatedResults['bondPrice'] = calculateBondPrice(faceValue, couponRate, yearsToMaturity, ytmInput, couponFrequency);

    // Calculate YTM (using market price input)
    fixedIncomeCalculatedResults['ytm'] = calculateYTM(faceValue, couponRate, yearsToMaturity, marketPrice, couponFrequency);

    // Calculate Duration and Convexity (using calculated YTM if available, otherwise YTM input)
    const ytmForDuration = isFinite(fixedIncomeCalculatedResults['ytm']) ? fixedIncomeCalculatedResults['ytm'] : ytmInput;

    fixedIncomeCalculatedResults['macaulayDuration'] = calculateMacaulayDuration(faceValue, couponRate, yearsToMaturity, ytmForDuration, couponFrequency);
    fixedIncomeCalculatedResults['modifiedDuration'] = calculateModifiedDuration(fixedIncomeCalculatedResults['macaulayDuration'], ytmForDuration, couponFrequency);
    fixedIncomeCalculatedResults['convexity'] = calculateConvexity(faceValue, couponRate, yearsToMaturity, ytmForDuration, couponFrequency);

    updateFixedIncomeResultsUI();
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = false;
    updateStatus('status_calc_done', { dataType: _t('fixed_income_title') }, 'success');
}

// --- Portfolio Management Orchestration ---
function isPortfolioCorrelationMatrixValid(assets) {
    const size=assets.length,tolerance=1e-10,L=Array.from({length:size},()=>Array(size).fill(0));
    for(let i=0;i<size;i++)for(let j=0;j<=i;j++){
        const correlation=i===j?1:assets[i].correlations[assets[j].id];
        if(!Number.isFinite(correlation)||correlation < -1||correlation > 1)return false;
        let residual=correlation;
        for(let k=0;k<j;k++)residual-=L[i][k]*L[j][k];
        if(i===j){if(residual < -tolerance)return false;L[i][j]=Math.sqrt(Math.max(0,residual));}
        else if(L[j][j]>tolerance)L[i][j]=residual/L[j][j];
        else if(Math.abs(residual)>tolerance)return false;
    }
    return true;
}
function calculatePortfolioManagement() {
    updateStatus('status_calculating', { dataType: _t('portfolio_management_title') }, 'info');
    portfolioCalculatedResults = {};

    if (portfolioAssets.length < 2) {
        Swal.fire(_t('error_title'), _t('portfolio_min_assets_error'), 'error');
        updateStatus('status_calc_error', { error: _t('portfolio_min_assets_error') }, 'error');
        resetPortfolioResultsDisplay();
        return;
    }

    let totalWeight = 0;
    let hasError = false;
    const validAssets = [];

    portfolioAssets.forEach(asset => {
        const r = parseLocalizedNumber(asset.return);
        const std = parseLocalizedNumber(asset.stdDev);
        const w = parseLocalizedNumber(asset.weight);

        if (isNaN(r) || isNaN(std) || isNaN(w) || std < 0 || w < 0) {
            Swal.fire(_t('error_title'), _t('portfolio_input_error'), 'error');
            updateStatus('status_calc_error', { error: _t('portfolio_input_error') }, 'error');
            hasError = true;
            return;
        }
        validAssets.push({ ...asset, return: r, stdDev: std, weight: w });
        totalWeight += w;
    });

    if (hasError) {
        resetPortfolioResultsDisplay();
        return;
    }

    if (Math.abs(totalWeight - 100) > 0.01) { // Allow for minor floating point inaccuracies
        Swal.fire(_t('warning_title'), _t('portfolio_weights_error'), 'warning');
        updateStatus('portfolio_weights_error', {}, 'warning');
        resetPortfolioResultsDisplay();
        return;
    }
    if(!isPortfolioCorrelationMatrixValid(validAssets)){
        Swal.fire(_t('error_title'),_t('correlation_matrix_invalid'),'error');
        updateStatus('correlation_matrix_invalid',{},'error');
        resetPortfolioResultsDisplay();
        return;
    }

    // Calculate Expected Portfolio Return
    let portfolioExpectedReturn = 0;
    validAssets.forEach(asset => {
        portfolioExpectedReturn += (asset.return / 100) * (asset.weight / 100);
    });
    portfolioExpectedReturn *= 100; // Convert back to percentage

    // Calculate Portfolio Variance and Standard Deviation
    let portfolioVariance = 0;
    let covarianceSum = 0;

    for (let i = 0; i < validAssets.length; i++) {
        const asset_i = validAssets[i];
        const w_i = asset_i.weight / 100;
        const std_i = asset_i.stdDev / 100;

        // Add own variance component
        portfolioVariance += Math.pow(w_i, 2) * Math.pow(std_i, 2);

        // Add covariance components
        for (let j = i + 1; j < validAssets.length; j++) {
            const asset_j = validAssets[j];
            const w_j = asset_j.weight / 100;
            const std_j = asset_j.stdDev / 100;
            const correlation = asset_i.correlations[asset_j.id];

            if (isNaN(correlation) || correlation < -1 || correlation > 1) {
                Swal.fire(_t('error_title'), _t('correlation_range_error'), 'error');
                updateStatus('status_calc_error', { error: _t('correlation_range_error') }, 'error');
                resetPortfolioResultsDisplay();
                return;
            }
            const covariance_ij = std_i * std_j * correlation;
            covarianceSum += 2 * w_i * w_j * covariance_ij;
        }
    }
    portfolioVariance += covarianceSum;

    const portfolioStdDev = Math.sqrt(portfolioVariance) * 100; // Convert back to percentage

    portfolioCalculatedResults['expectedReturn'] = portfolioExpectedReturn;
    portfolioCalculatedResults['stdDev'] = portfolioStdDev;
    // For covariance, we can show the average or sum of pairwise covariances, but for now, let's just show the portfolio variance.
    // Or, we can show the sum of all covariance terms (2 * wi * wj * cov_ij)
    portfolioCalculatedResults['portfolioVariance'] = portfolioVariance; // Store portfolio variance here for display, as it's the direct result of the sum.

    updatePortfolioResultsUI();
    updateStatus('status_calc_done', { dataType: _t('portfolio_management_title') }, 'success');
}


// --- UI Update Functions ---
function resetResultsDisplay() {
    if (!resultsDisplayDiv) return;
    resultsDisplayDiv.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted'; // Reset class
    });
    // Ensure count is also reset or set to current dataPoints length
    const countSpan = document.getElementById('result-count');
    if (countSpan) countSpan.textContent = formatNumber(dataPoints.length, 0);
}

function updateResultsUI(results) {
    const updateSpan = (id, value, options = {}, highlightType = 'neutral') => {
        const element = document.getElementById(id);
        if (!element) return;
        
        let displayValue = '-';
        if (!isNaN(value) && isFinite(value)) {
            displayValue = formatNumber(value, options.digits || 2, options.addPercent || false);
        }
        
        element.textContent = displayValue;
        element.className = `font-mono ${highlightType === 'pos' ? 'text-highlight-pos' : 
            highlightType === 'neg' ? 'text-highlight-neg' : 'text-highlight-neutral'}`;
    };

    
    updateSpan('result-count', results.n, { digits: 0 });
    updateSpan('result-mean', results.mean, { addPercent: true });
    updateSpan('result-gm', results.geoMean, { addPercent: true });
    updateSpan('result-std', results.stdDev, { addPercent: true });
    updateSpan('result-dsd', results.downsideDev, { addPercent: true });
    updateSpan('result-var', results.variance, { addPercent: true });
    updateSpan('result-cv', results.cv);
    updateSpan('result-mdd', results.mdd, { addPercent: true }, 'neg');
    updateSpan('result-mdd-period', results.mdd_period, { digits: 0 }); // Added mdd_period
    updateSpan('result-skew', results.skewness);
    updateSpan('result-kurt', results.kurtosis);
    updateSpan('result-var5', results.var5, { addPercent: true }, 'neg');
    updateSpan('result-var95', results.var95, { addPercent: true }, 'pos');
    updateSpan('result-cvar5', results.cvar5, { addPercent: true }, 'neg');
    updateSpan('result-max-gain', results.maxGain, { addPercent: true }, 'pos');
    updateSpan('result-sharpe', results.sharpeRatio);
    updateSpan('result-sortino', results.sortinoRatio);
    updateSpan('result-omega', results.omegaRatio);

    
    updateSpan('result-treynor', results.treynorRatio, { addPercent: true });
    updateSpan('result-calmar', results.calmarRatio);
    updateSpan('result-jensen-alpha', results.jensenAlpha, { addPercent: true });
    updateSpan('result-m2', results.m2Measure, { addPercent: true });
    updateSpan('result-alpha-t-stat', results.alphaTStat);

    
    if (results.beta !== undefined) {
        updateSpan('result-beta', results.beta);
        updateSpan('result-alpha', results.alpha, { addPercent: true });
        updateSpan('result-rsquared', results.rSquared);
        updateSpan('result-capm-er', results.capmExpectedReturn, { addPercent: true });
        updateSpan('result-reg-stderr', results.regStdErr);
        updateSpan('result-beta-tstat', results.betaTStat);
        updateSpan('result-beta-pvalue', results.betaPValue);
        updateSpan('result-alpha-tstat', results.alphaTStat);
        updateSpan('result-alpha-pvalue', results.alphaPValue);
    }

    
    if (results.trackingError !== undefined) {
        updateSpan('result-tracking-error', results.trackingError, { addPercent: true });
        updateSpan('result-information-ratio', results.informationRatio);
    }
}

function resetEquityResultsDisplay() {
    if (!equityResultsDisplay) return;
    equityResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
}

function updateEquityResultsUI() {
    if (!equityResultsDisplay || Object.keys(equityCalculatedResults).length === 0) {
        resetEquityResultsDisplay();
        return;
    }
    const results = equityCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

            if (formattedValue !== _t('value_invalid')) {
                if (highlightType === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                else if (highlightType === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                else if (highlightType === 'neutral' && value !== 0) span.classList.add('text-highlight-neutral');
                else if (highlightType === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                else span.classList.add('text-dark-text');
            } else {
                span.classList.add('text-dark-text-muted');
            }
        }
    };

    updateSpan('result-ddm-value', results.ddm, {digits:2});
    updateSpan('result-ggm-value', results.ggm, {digits:2});
    updateSpan('result-pe-ratio', results.peRatio, {digits:2});
}

function resetFixedIncomeResultsDisplay() {
    if (!fixedIncomeResultsDisplay) return;
    fixedIncomeResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = true;
}

function updateFixedIncomeResultsUI() {
    if (!fixedIncomeResultsDisplay || Object.keys(fixedIncomeCalculatedResults).length === 0) {
        resetFixedIncomeResultsDisplay();
        return;
    }
    const results = fixedIncomeCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

            if (formattedValue !== _t('value_invalid')) {
                if (highlightType === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                else if (highlightType === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                else if (highlightType === 'neutral' && value !== 0) span.classList.add('text-highlight-neutral');
                else if (highlightType === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                else span.classList.add('text-dark-text');
            } else {
                span.classList.add('text-dark-text-muted');
            }
        }
    };

    updateSpan('result-bond-price', results.bondPrice, {digits:2});
    updateSpan('result-ytm', results.ytm, {digits:3, addPercent:true});
    updateSpan('result-macaulay-duration', results.macaulayDuration, {digits:3});
    updateSpan('result-modified-duration', results.modifiedDuration, {digits:3});
    updateSpan('result-convexity', results.convexity, {digits:4});

    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = false;
}

function resetPortfolioResultsDisplay() {
    if (!portfolioResultsDisplay) return;
    portfolioResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
}

function updatePortfolioResultsUI() {
    if (!portfolioResultsDisplay || Object.keys(portfolioCalculatedResults).length === 0) {
        resetPortfolioResultsDisplay();
        return;
    }
    const results = portfolioCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

            if (formattedValue !== _t('value_invalid')) {
                if (highlightType === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                else if (highlightType === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                else if (highlightType === 'neutral' && value !== 0) span.classList.add('text-highlight-neutral');
                else if (highlightType === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                else span.classList.add('text-dark-text');
            } else {
                span.classList.add('text-dark-text-muted');
            }
        }
    };

    updateSpan('result-portfolio-expected-return', results.expectedReturn, {digits:2, addPercent:true}, 'posneg');
    updateSpan('result-portfolio-stddev', results.stdDev, {digits:2, addPercent:true}, 'neutral');
    updateSpan('result-portfolio-variance', results.portfolioVariance, {digits:4, addPercent:true}, 'neutral'); // Display portfolio variance
}


function updateActionButtonsState() {
    const hasAssetData = dataPoints.length > 0;
    const hasEnoughAssetDataForCalc = dataPoints.length >= 2;
    const hasResults = calculatedResults && typeof calculatedResults.mean === 'number' && isFinite(calculatedResults.mean);
    const hasRegressionParams = hasResults && typeof calculatedResults.beta === 'number' && isFinite(calculatedResults.beta);

    if (calculateButton) calculateButton.disabled = !hasEnoughAssetDataForCalc;
    if (plotHistButton) plotHistButton.disabled = !hasResults;
    if (plotBoxButton) plotBoxButton.disabled = !hasResults;
    if (plotEquityButton) plotEquityButton.disabled = !hasResults;
    if (plotQqButton) plotQqButton.disabled = !(hasResults && dataPoints.length >=2); // QQ needs at least 2 points
    if (plotRegressionButton) plotRegressionButton.disabled = !hasRegressionParams;
    if (exportResultsButton) exportResultsButton.disabled = !hasResults;
    if (clearListButton) clearListButton.disabled = !hasAssetData;

    // Portfolio Management specific button state
    if (calculatePortfolioButton) calculatePortfolioButton.disabled = portfolioAssets.length < 2;
}

// --- Plotting (Placeholders, actual implementation in previous responses) ---
const DARK_BACKGROUND_COLOR = '#111827'; const DARK_CARD_COLOR = '#1f2937'; const DARK_TEXT_COLOR = '#d1d5db'; const DARK_MUTED_COLOR = '#9ca3af'; const DARK_BORDER_COLOR = '#374151'; const PRIMARY_COLOR = '#3b82f6'; const ACCENT_COLOR_NEG = '#f87171'; const ACCENT_COLOR_POS = '#34d399'; const ACCENT_COLOR_MEAN = '#fbbf24'; const ACCENT_COLOR_MEDIAN = '#60a5fa'; const ACCENT_COLOR_FIT = '#a78bfa'; const ACCENT_COLOR_KDE = '#14b8a6'; const ACCENT_COLOR_EQUITY = '#22c55e';
const HIST_NORM_FIT_COLOR = '#673ab7'; const HIST_KDE_COLOR = '#818cf8'; const HIST_MEAN_LINE_COLOR = '#facc15'; const HIST_MEDIAN_LINE_COLOR = '#38bdf8'; const HIST_VAR_LINE_COLOR = '#f87171'; const HIST_GAIN_LINE_COLOR = '#34d399';

function getResponsiveLayoutParams() { /* ... from previous script ... */
    const isMobile = window.innerWidth < 768;
    const baseFontSize = isMobile ? 9 : 11;
    return {
        baseFontSize: baseFontSize,
        titleFontSize: isMobile ? 13 : 16,
        margin: isMobile ? { l: 45, r: 15, t: 40, b: 60, pad:2 } : { l: 60, r: 25, t: 50, b: 60, pad:4 },
        legend: { font: { size: baseFontSize -1 }, x: isMobile ? 0.5 : 1.02, y: isMobile ? -0.30 : 0.98, xanchor: isMobile ? 'center' : 'left', yanchor: 'top', orientation: isMobile ? 'h' : 'v', bgcolor: 'rgba(31, 41, 55, 0.7)', bordercolor: DARK_BORDER_COLOR, borderwidth: 1, itemclick: "toggleothers", itemdoubleclick: "toggle" },
        nbinsxHist: (n) => Math.min(Math.max(10, Math.floor(window.innerWidth / (isMobile ? 25 : 35))), Math.ceil(n/1.5)+1, isMobile ? 30 : 50),
        markerSize: isMobile ? 5 : 6,
        lineWidth: isMobile ? 1.8 : 2,
        tickAngle: isMobile ? 35 : 'auto',
    };
}

function plotActionWrapper(plotFunc, titleKey) {
    // Special handling for bond price-yield curve plot
    if (plotFunc.name === 'plotBondPriceYieldCurveLogic') {
        if (Object.keys(fixedIncomeCalculatedResults).length === 0 || isNaN(fixedIncomeCalculatedResults.bondPrice)) {
            Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
            updateStatus('status_need_data_plot', {}, 'warning');
            return;
        }
        // For bond plot, we need the original inputs, not just calculated results
        const faceValue = parseLocalizedNumber(faceValueInput.value);
        const couponRate = parseLocalizedNumber(couponRateInput.value);
        const yearsToMaturity = parseLocalizedNumber(yearsToMaturityInput.value);
        const couponFrequency = parseInt(couponFrequencySelect.value);

        if (isNaN(faceValue) || isNaN(couponRate) || isNaN(yearsToMaturity) || isNaN(couponFrequency)) {
            Swal.fire(_t('error_title'), _t('bond_input_error'), 'error');
            updateStatus('status_calc_error', { error: _t('bond_input_error') }, 'error');
            return;
        }
        updateStatus(texts[titleKey] ? `status_plotting_${titleKey.split('_')[1]}` : 'status_plotting_hist', {}, 'info');
        try {
            const plotDefinition = plotFunc(faceValue, couponRate, yearsToMaturity, couponFrequency);
            if (!plotDefinition || !plotDefinition.plotData || !plotDefinition.layout) throw new Error(_t('plotFailed'));
            const { plotData, layout } = plotDefinition;

            layout.autosize = true; layout.uirevision = 'dataset';
            if(plotModalLabel) plotModalLabel.textContent = _t(titleKey);
            if(plotContainer) Plotly.purge(plotContainer); else throw new Error("Plot container missing.");

            Plotly.newPlot(plotContainer, plotData, layout, {responsive: true, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio']})
            .then(() => {
                if (plotModal) {
                     plotModal.classList.remove('hidden'); plotModal.classList.add('flex'); document.body.style.overflow = 'hidden';
                }
                updateStatus('status_plot_done', {}, 'success');
            }).catch(err => { throw err; });
        } catch (error) {
            console.error("Plotting Error:", error);
            Swal.fire(_t('error_title'), _t('status_plot_error', { error: error.message }), 'error');
            updateStatus('status_plot_error', { error: error.message }, 'error');
            if(plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); document.body.style.overflow = 'auto'; }
        }
        return;
    }


    // Original asset analysis plots
    if (dataPoints.length === 0 && plotFunc.name !== 'plotRegressionLogic') { // Regression might plot with only market/asset if params are there
        Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
        updateStatus('status_need_data_plot', {}, 'warning'); return;
    }
    const currentAssetData = dataPoints.filter(p => isFinite(p));

    if (plotFunc.name !== 'plotRegressionLogic' && (Object.keys(calculatedResults).length === 0 || !calculatedResults.data || calculatedResults.n !== currentAssetData.length)) {
        if (currentAssetData.length < (plotFunc.name === 'plotQqplotLogic' ? 2 : 1)) {
            Swal.fire(_t('warning_title'), _t(plotFunc.name === 'plotQqplotLogic' ? 'status_need_data_calc' : 'status_need_data_plot'), 'warning'); return;
        }
        calculateMetrics(); // Recalculate if results are stale or missing
        if (!calculatedResults.data) { console.log("Plot cancelled: metric calculation failed."); return; }
    }

    const dataForPlot = calculatedResults.data || currentAssetData; // Use calculated data if available

    if (plotFunc.name !== 'plotRegressionLogic' && (!dataForPlot || dataForPlot.length === 0 || (plotFunc.name === 'plotQqplotLogic' && dataForPlot.length < 2))) {
         Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning'); return;
    }

    updateStatus(texts[titleKey] ? `status_plotting_${titleKey.split('_')[1]}` : 'status_plotting_hist', {}, 'info');

    try {
        let plotDefinition;
        if (plotFunc.name === 'plotRegressionLogic') {
            if (!calculatedResults.beta || !calculatedResults.alpha || marketDataPoints.length !== dataPoints.length) {
                 Swal.fire(_t('error_title'), _t('status_plot_error_no_regression_params'), 'error'); return;
            }
            plotDefinition = plotFunc(dataPoints, marketDataPoints, {alpha: calculatedResults.alpha, beta: calculatedResults.beta});
        } else {
            plotDefinition = plotFunc(dataForPlot);
        }

        if (!plotDefinition || !plotDefinition.plotData || !plotDefinition.layout) throw new Error(_t('plotFailed'));
        const { plotData, layout } = plotDefinition;

        layout.autosize = true; layout.uirevision = 'dataset';
        if(plotModalLabel) plotModalLabel.textContent = _t(titleKey);
        if(plotContainer) Plotly.purge(plotContainer); else throw new Error("Plot container missing.");

        Plotly.newPlot(plotContainer, plotData, layout, {responsive: true, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio']})
        .then(() => {
            if (plotModal) {
                 plotModal.classList.remove('hidden'); plotModal.classList.add('flex'); document.body.style.overflow = 'hidden';
            }
            updateStatus('status_plot_done', {}, 'success');
        }).catch(err => { throw err; });

    } catch (error) {
        console.error("Plotting Error:", error);
        Swal.fire(_t('error_title'), _t('status_plot_error', { error: error.message }), 'error');
        updateStatus('status_plot_error', { error: error.message }, 'error');
        if(plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); document.body.style.overflow = 'auto'; }
    }
}
function plotHistogramLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const n = data.length;
    const mean = calculatedResults.mean ?? calculateMean(data);
    const median = calculatedResults.median ?? calculatePercentile(data, 50);
    const std = calculatedResults.std ?? calculateStdDev(data);
    const var_5 = calculatedResults.var5 ?? calculatePercentile(data, 5);
    const var_95 = calculatedResults.var95 ?? calculatePercentile(data, 95);
    const nbins = responsiveParams.nbinsxHist(n);

    const traceHist = { x: data, type: 'histogram', name: _t('hist_label_main'), histnorm: 'probability density', autobinx: false, nbinsx: nbins, marker: { color: PRIMARY_COLOR, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, opacity: 0.75, hoverlabel: { bgcolor: DARK_BACKGROUND_COLOR, bordercolor: PRIMARY_COLOR, font: { color: DARK_TEXT_COLOR } }, hovertemplate: `${_t('hist_hover_value')}: %{x:.2f}%<br>${_t('plot_ylabel_hist_density')}: %{y:.4f}<extra></extra>` };
    const plotData = [traceHist]; const shapes = [];

    if (n > 1 && !isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const { min: xMin, max: xMax } = calculateExtrema(data); const range = xMax - xMin;
        const xNorm = []; const yNormPDF = []; const step = range / 200 || 0.05;
        let curveStartX = Math.min(xMin, mean - 3.5 * std); let curveEndX = Math.max(xMax, mean + 3.5 * std);
        if (range === 0) { curveStartX = mean - 1; curveEndX = mean + 1; }
        for (let x = curveStartX; x <= curveEndX; x += step) { xNorm.push(x); yNormPDF.push((1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)))); }
        plotData.push({ x: xNorm, y: yNormPDF, type: 'scatter', mode: 'lines', name: _t('plot_norm_label', { mean: formatNumber(mean, 2), std: formatNumber(std, 2) }), line: { color: HIST_NORM_FIT_COLOR, dash: 'dashdot', width: responsiveParams.lineWidth }, hoverinfo: 'name' });
    }
    if (n > 1 && typeof ss !== 'undefined' && typeof ss.kernelDensityEstimation === 'function') {
        try {
            const kdePoints = ss.kernelDensityEstimation(data); // Default bandwidth
            if (kdePoints && kdePoints.length > 0 && kdePoints[0].length === 2) { // Check structure
                 const xKde = kdePoints.map(p => p[0]); const yKde = kdePoints.map(p => p[1]);
                 if (xKde.length > 0 && yKde.length > 0) {
                    plotData.push({ x: xKde, y: yKde, type: 'scatter', mode: 'lines', name: _t('plot_kde_label'), line: { color: HIST_KDE_COLOR, width: responsiveParams.lineWidth, dash: 'longdash' }, hoverinfo: 'name' });
                 }
            } else { console.warn("KDE output format unexpected or empty."); }
        } catch (kdeError) { console.warn("Error calculating KDE:", kdeError); }
    }
    const addVLine = (val, color, dash, name) => { if(!isNaN(val) && isFinite(val)) { shapes.push({type:'line',x0:val,x1:val,y0:0,y1:1,yref:'paper',line:{color,width:responsiveParams.lineWidth,dash}}); plotData.push({x:[null],y:[null],mode:'lines',name,line:{color,width:responsiveParams.lineWidth+1,dash}});}};
    addVLine(mean, HIST_MEAN_LINE_COLOR, 'solid', _t('plot_mean_val_label',{val:formatNumber(mean,2)}));
    addVLine(median, HIST_MEDIAN_LINE_COLOR, 'dash', _t('plot_median_val_label',{val:formatNumber(median,2)}));
    addVLine(var_5, HIST_VAR_LINE_COLOR, 'dot', _t('plot_var_label',{val:formatNumber(var_5,2)}));
    addVLine(var_95, HIST_GAIN_LINE_COLOR, 'dot', _t('plot_gain_label',{val:formatNumber(var_95,2)}));

    const layout = { title: { text: _t('plot_hist_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, showgrid: true, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle }, yaxis: { title: { text: _t('plot_ylabel_hist_density'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, showgrid: true, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, shapes: shapes, bargap: 0.05, barmode: 'overlay', margin: responsiveParams.margin, hovermode: 'x unified' };
    return { plotData, layout };
}
function plotBoxplotLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const mean = calculateMean(data); const std = calculateStdDev(data);
    const q1 = calculatePercentile(data,25); const median = calculatePercentile(data,50); const q3 = calculatePercentile(data,75);
    const iqr = q3-q1; const upperFence = q3 + 1.5 * iqr; const lowerFence = q1 - 1.5 * iqr;
    const { min: dataMin, max: dataMax } = calculateExtrema(data);
    const effectiveMax = Math.min(dataMax, upperFence); const effectiveMin = Math.max(dataMin, lowerFence);

    const traceBox = { y: data, type: 'box', name: ' ', boxpoints: 'all', jitter: 0.3, pointpos: -1.8, marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize -1, opacity: 0.6, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, line: { color: DARK_TEXT_COLOR, width: responsiveParams.lineWidth }, fillcolor: 'rgba(59, 130, 246, 0.3)', hoverinfo: 'y',
        hovertemplate: `<b>${_t('boxplot_hover_stats')}</b><br>${_t('boxplot_hover_max')}: ${formatNumber(effectiveMax,2)}%<br>${_t('boxplot_hover_q3')}: %{q3:.2f}%<br>${_t('boxplot_hover_median')}: %{median:.2f}%<br>${_t('boxplot_hover_q1')}: %{q1:.2f}%<br>${_t('boxplot_hover_min')}: ${formatNumber(effectiveMin,2)}%<br>${_t('boxplot_hover_mean')}: ${formatNumber(mean,2)}%<br>${_t('boxplot_hover_std')}: ${formatNumber(std,2)}%<extra></extra>`,
        boxmean: 'sd', whiskerwidth: 0.6,
    };
    const plotData = [traceBox];
    const layout = { title: { text: _t('plot_box_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, yaxis: { title: { text: _t('plot_ylabel_box'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, xaxis: { showticklabels: false, zeroline: false, showgrid: false }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: false, margin: responsiveParams.margin };
    return { plotData, layout };
}
function plotEquityCurveLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams(); const initialInvestment = 100;
    const equityCurve = [initialInvestment]; let highWaterMark = initialInvestment; const highWaterMarkData = [initialInvestment]; const drawdowns = [0];
    for (let i = 0; i < data.length; i++) { const currentReturn = data[i]; const previousValue = equityCurve[equityCurve.length - 1]; const newValue = previousValue * (1 + (isFinite(currentReturn) ? currentReturn : 0) / 100.0); equityCurve.push(newValue); if (newValue > highWaterMark) highWaterMark = newValue; highWaterMarkData.push(highWaterMark); drawdowns.push(((newValue / highWaterMark) - 1) * 100); }
    const indices = Array.from({ length: equityCurve.length }, (_, i) => i);
    const mddResult = calculateMaxDrawdown(data); const mddShapes = [];
    if (mddResult && typeof mddResult.peakIndex === 'number' && typeof mddResult.troughIndex === 'number' && mddResult.duration > 0) {
        const mddPeakX = indices[mddResult.peakIndex]; const mddTroughX = indices[mddResult.troughIndex + 1]; // +1 because troughIndex is for data, equity curve has initial point
        if (mddPeakX !== undefined && mddTroughX !== undefined && mddPeakX < mddTroughX) { // Ensure peak is before trough for rect
            mddShapes.push({ type: 'rect', xref: 'x', yref: 'paper', x0: mddPeakX, y0: 0, x1: mddTroughX, y1: 1, fillcolor: 'rgba(248, 113, 113, 0.15)', layer: 'below', line: { width: 0 } });
        }
    }
    const plotData = [];
    plotData.push({ x: indices, y: equityCurve, type: 'scatter', mode: 'lines', name: _t('equity_curve_label'), line: { color: ACCENT_COLOR_EQUITY, width: responsiveParams.lineWidth + 0.5 }, hoverinfo: 'x+y', hovertemplate: `<b>${_t('period_label')}:</b> %{x}<br><b>${_t('equity_value_label')}:</b> %{y:.2f}<br><b>${_t('hwm_label')}:</b> %{customdata[0]:.2f}<br><b>${_t('drawdown_from_hwm_label')}:</b> %{customdata[1]:.2f}%<extra></extra>`, customdata: highWaterMarkData.map((hwm, i) => [hwm, drawdowns[i]]), legendgroup: 'equity' });
    plotData.push({ x: indices, y: highWaterMarkData, type: 'scatter', mode: 'lines', name: _t('hwm_trace_label'), line: { color: ACCENT_COLOR_POS, dash: 'dash', width: responsiveParams.lineWidth - 0.2 }, hoverinfo: 'skip', legendgroup: 'equity' });
    const layout = { title: { text: _t('plot_equity_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_xlabel_equity'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: false, showgrid: true, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle, range: [0, data.length] }, yaxis: { title: { text: _t('plot_ylabel_equity_value'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: false, showgrid: true, tickformat: ',', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, shapes: mddShapes, margin: responsiveParams.margin, hovermode: 'x unified' };
    return { plotData, layout };
}
function plotQqplotLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length < 2) throw new Error(_t('status_qq_insufficient_points'));
    if (typeof ss === 'undefined' || typeof ss.probit !== 'function') throw new Error(_t('error_lib_missing', {lib: 'simple-statistics'}));
    const responsiveParams = getResponsiveLayoutParams();
    const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; const theoreticalQuantiles = [];
    for (let i = 0; i < n; i++) { const p = (i + 1 - 0.5) / n; const safeP = Math.max(1e-9, Math.min(1 - 1e-9, p)); try { theoreticalQuantiles.push(ss.probit(safeP)); } catch (e) { theoreticalQuantiles.push(NaN); }}
    const validPairs = sortedData.map((s, i) => ({sample: s, theoretical: theoreticalQuantiles[i]})).filter(p => isFinite(p.theoretical) && isFinite(p.sample));
    if (validPairs.length < 2) throw new Error(_t('status_qq_insufficient_points'));
    const sampleQ = validPairs.map(p => p.sample); const theoreticalQ = validPairs.map(p => p.theoretical);
    const traceScatter = { x: theoreticalQ, y: sampleQ, mode: 'markers', type: 'scatter', name: _t('qq_data_quantiles_label'), marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize, opacity: 0.7, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, hovertemplate: `<b>${_t('qq_hover_point')}</b><br>${_t('qq_hover_theoretical')}: %{x:.3f}<br>${_t('qq_hover_sample')}: %{y:.2f}%<extra></extra>` };
    let lineX = [], lineY = []; const minTheo = Math.min(...theoreticalQ); const maxTheo = Math.max(...theoreticalQ);
    const q1Sample = calculatePercentile(sampleQ, 25); const q3Sample = calculatePercentile(sampleQ, 75);
    const q1Theoretical = ss.probit(0.25); const q3Theoretical = ss.probit(0.75); // Use exact percentiles for theoretical
    if (isFinite(q1Sample) && isFinite(q3Sample) && isFinite(q1Theoretical) && isFinite(q3Theoretical) && (q3Theoretical - q1Theoretical !== 0)) { const slope = (q3Sample - q1Sample) / (q3Theoretical - q1Theoretical); const intercept = q1Sample - slope * q1Theoretical; lineX = [minTheo, maxTheo]; lineY = [intercept + slope * minTheo, intercept + slope * maxTheo]; }
    const traceLine = { x: lineX, y: lineY, mode: 'lines', type: 'scatter', name: _t('qq_norm_ref_line_label'), line: { color: ACCENT_COLOR_NEG, width: responsiveParams.lineWidth, dash: 'dash' }, hoverinfo: 'name' };
    const plotData = [traceScatter]; if (lineX.length > 0) plotData.push(traceLine);
    const layout = { title: { text: _t('plot_qq_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_qq_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle, range: [Math.min(-3.5, minTheo - 0.5), Math.max(3.5, maxTheo + 0.5)] }, yaxis: { title: { text: _t('plot_qq_ylabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, margin: responsiveParams.margin, hovermode: 'closest' };
    return { plotData, layout };
}
function plotRegressionLogic(assetReturns, marketReturns, regressionParams) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (!assetReturns || !marketReturns || assetReturns.length !== marketReturns.length || assetReturns.length === 0) { Swal.fire(_t('error_title'), _t('status_plot_error_no_paired_data'), 'error'); return null; }
    if (!regressionParams || typeof regressionParams.alpha !== 'number' || typeof regressionParams.beta !== 'number') { Swal.fire(_t('error_title'), _t('status_plot_error_no_regression_params'), 'error'); return null; }
    const { alpha, beta } = regressionParams; const responsiveParams = getResponsiveLayoutParams();
    const traceScatter = { x: marketReturns, y: assetReturns, mode: 'markers', type: 'scatter', name: _t('scatter_plot_legend_actual'), marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize, opacity: 0.7 } };
    const { min: minMarket, max: maxMarket } = calculateExtrema(marketReturns);
    const lineX = [minMarket, maxMarket]; const lineY = [alpha + beta * minMarket, alpha + beta * maxMarket];
    const traceLine = { x: lineX, y: lineY, mode: 'lines', type: 'scatter', name: _t('scatter_plot_legend_regression_line', {alpha: formatNumber(alpha,2), beta: formatNumber(beta,3)}), line: { color: ACCENT_COLOR_NEG, width: responsiveParams.lineWidth } };
    const plotData = [traceScatter, traceLine];
    const layout = { title: { text: _t('plot_regression_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_axis_market_returns'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, yaxis: { title: { text: _t('plot_axis_asset_returns'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: {...responsiveParams.legend, orientation:'h', yanchor:'bottom', y:1.02, xanchor:'right', x:1}, margin: responsiveParams.margin, hovermode: 'closest' };
    return { plotData, layout };
}

function plotBondPriceYieldCurveLogic(faceValue, couponRate, yearsToMaturity, couponFrequency) {
    const responsiveParams = getResponsiveLayoutParams();
    const yields = [];
    const prices = [];
    // Generate yields from 0.1% to 20% (or more dynamically)
    for (let y = 0.1; y <= 20.0; y += 0.1) {
        yields.push(y);
        prices.push(calculateBondPrice(faceValue, couponRate, yearsToMaturity, y, couponFrequency));
    }

    const trace = {
        x: yields,
        y: prices,
        mode: 'lines',
        type: 'scatter',
        name: _t('bond_price_label'),
        line: { color: PRIMARY_COLOR, width: responsiveParams.lineWidth }
    };

    const layout = {
        title: { text: _t('bond_price_yield_plot_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' },
        xaxis: {
            title: { text: _t('plot_axis_yield'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickformat: ',.1f',
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }
        },
        yaxis: {
            title: { text: _t('plot_axis_bond_price'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickformat: ',',
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize },
        showlegend: false,
        margin: responsiveParams.margin,
        hovermode: 'closest'
    };

    return { plotData: [trace], layout };
}


// --- Export ---
function downloadBlob(blob, filename) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); }
function exportResultsToTxtFile() {
    updateStatus('status_saving_results', {}, 'info');
    const lines = [];
    const now = new Date();

    lines.push(`========== ${_t('app_title')} ==========`);
    lines.push(`Date: ${now.toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}`);
    lines.push("\n");

    // Asset Analysis Results
    if (Object.keys(calculatedResults).length > 0 && calculatedResults.n > 0) {
        const results = calculatedResults;
        lines.push(`--- ${_t('results_title')} (${_t('tab_asset_analysis')}) ---`);
        lines.push(`${_t('data_count')}: ${formatNumber(results.n, 0)}`);
        lines.push(`Risk-Free Rate: ${formatNumber(results.rf, 2, true)}`);
        lines.push(`Expected Market Return: ${formatNumber(results.expectedMarketReturn, 2, true)}`);
        lines.push("-".repeat(50));
        const resOrder = [
            'mean', 'gm', 'std', 'dsd', 'variance', 'cv', 'mdd', 'mdd_period', 'skewness', 'kurtosis',
            'var5', 'var95', 'cvar5', 'maxGain', 'sharpeRatio', 'sortinoRatio', 'omegaRatio',
            'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat',
            'trackingError', 'informationRatio',
            'beta', 'alpha', 'rSquared', 'capmExpectedReturn', 'regStdErr',
            'betaTStat', 'betaPValue', 'alphaTStat', 'alphaPValue'
        ];
        const resLabels = {
            'mean': 'mean_label', 'gm': 'geo_mean_label', 'std': 'std_dev_label', 'dsd': 'downside_dev_label',
            'variance': 'variance_label', 'cv': 'cv_label', 'mdd': 'mdd_label', 'mdd_period': 'mdd_period_label',
            'skewness': 'skewness_label', 'kurtosis': 'kurtosis_label', 'var5': 'var_label', 'var95': 'var_95_label',
            'cvar5': 'cvar_label', 'maxGain': 'max_gain_label', 'sharpeRatio': 'sharpe_label', 'sortinoRatio': 'sortino_label',
            'omegaRatio': 'omega_label',
            'treynorRatio': 'treynor_ratio_label', 'calmarRatio': 'calmar_ratio_label', 'jensenAlpha': 'jensen_alpha_label',
            'm2Measure': 'm2_measure_label', 'alphaTStat': 'alpha_t_stat_label',
            'trackingError': 'tracking_error_label', 'informationRatio': 'information_ratio_label',
            'beta': 'beta_label', 'alpha': 'alpha_label', 'rSquared': 'rsquared_label',
            'capmExpectedReturn': 'capm_expected_return_label', 'regStdErr': 'reg_stderr_label',
            'betaTStat': 'beta_t_stat_label', 'betaPValue': 'beta_p_value_label',
            'alphaPValue': 'alpha_p_value_label'
        };
        resOrder.forEach(key => {
            if(results.hasOwnProperty(key) && !isNaN(results[key])) {
                let value = results[key];
                let addPercent = false;
                let digits = 2;

                // Determine formatting based on key
                if (['mean', 'gm', 'std', 'dsd', 'mdd', 'var5', 'var95', 'cvar5', 'maxGain', 'alpha', 'trackingError', 'capmExpectedReturn'].includes(key)) {
                    addPercent = true;
                    digits = 2;
                } else if (['rSquared', 'beta', 'cv', 'skewness', 'kurtosis', 'sharpeRatio', 'sortinoRatio', 'omegaRatio', 'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat', 'informationRatio', 'regStdErr', 'betaTStat', 'betaPValue', 'alphaPValue'].includes(key)) {
                    digits = 3; // More precision for ratios/stats
                } else if (key === 'mdd_period' || key === 'n') {
                    digits = 0;
                } else if (key === 'variance') {
                    addPercent = true;
                    digits = 4; // Variance can be small
                }

                lines.push(`${_t(resLabels[key] || key)}: ${formatNumber(value, digits, addPercent)}`);
            }
        });
        lines.push("\n" + "=".repeat(50));
        lines.push(`Input Asset Data (${dataPoints.length} points):`);
        lines.push("-".repeat(50));
        lines.push(...dataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));
        if(marketDataPoints.length > 0) { lines.push("\nMarket Data:"); lines.push(...marketDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
        if(benchmarkDataPoints.length > 0) { lines.push("\nBenchmark Data:"); lines.push(...benchmarkDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Equity Valuation Results
    if (Object.keys(equityCalculatedResults).length > 0) {
        const results = equityCalculatedResults;
        lines.push(`--- ${_t('equity_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('ddm_value_label')}: ${formatNumber(results.ddm, 2)}`);
        lines.push(`${_t('ggm_value_label')}: ${formatNumber(results.ggm, 2)}`);
        lines.push(`${_t('pe_ratio_label')}: ${formatNumber(results.peRatio, 2)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Fixed Income Results
    if (Object.keys(fixedIncomeCalculatedResults).length > 0) {
        const results = fixedIncomeCalculatedResults;
        lines.push(`--- ${_t('fixed_income_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('bond_price_label')}: ${formatNumber(results.bondPrice, 2)}`);
        lines.push(`${_t('ytm_label')}: ${formatNumber(results.ytm, 3, true)}`);
        lines.push(`${_t('macaulay_duration_label')}: ${formatNumber(results.macaulayDuration, 3)}`);
        lines.push(`${_t('modified_duration_label')}: ${formatNumber(results.modifiedDuration, 3)}`);
        lines.push(`${_t('convexity_label')}: ${formatNumber(results.convexity, 4)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Portfolio Management Results
    if (Object.keys(portfolioCalculatedResults).length > 0) {
        const results = portfolioCalculatedResults;
        lines.push(`--- ${_t('portfolio_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('portfolio_expected_return_label')}: ${formatNumber(results.expectedReturn, 2, true)}`);
        lines.push(`${_t('portfolio_stddev_label')}: ${formatNumber(results.stdDev, 2, true)}`);
        lines.push(`${_t('portfolio_variance_label')}: ${formatNumber(results.portfolioVariance, 4, true)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    if (lines.length <= 4) { // Only header and date means no actual results
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        return;
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const filename = `FinancialAnalysisResults_${new Date().toISOString().slice(0,10)}.txt`;
    downloadBlob(blob, filename);
    updateStatus('status_saving_txt_success', { filename }, 'success');
}

async function exportResultsToExcelFile() {
    try { await ensureSpreadsheetLibrary(); }
    catch (_) { updateStatus('error_lib_missing', { lib: 'XLSX' }, 'error'); return; }
    updateStatus('status_saving_results', {}, 'info');
    const wb = XLSX.utils.book_new();
    const now = new Date();

    // Asset Analysis Sheet
    if (Object.keys(calculatedResults).length > 0 && calculatedResults.n > 0) {
        const results = calculatedResults;
        const assetResultsData = [
            [{ v: _t('app_title'), s: { font: { sz: 14, bold: true } } }],
            [{ v: `Date: ${now.toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}` }],
            [],
            [{ v: _t('results_title') + ` (${_t('tab_asset_analysis')})`, s: { font: { bold: true } } }],
            [_t('data_count'), results.n],
            [_t('rf_title'), formatNumber(results.rf, 2, true)],
            [_t('expected_market_return_title'), formatNumber(results.expectedMarketReturn, 2, true)],
            [],
        ];
        const resOrder = ['mean','geoMean','stdDev','downsideDev','variance','cv','mdd','mdd_period','skewness','kurtosis','var5','var95','cvar5','maxGain','sharpeRatio','sortinoRatio','omegaRatio', 'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat', 'trackingError', 'informationRatio', 'beta','alpha','rSquared','capmExpectedReturn','regStdErr','betaTStat','betaPValue','alphaPValue'];
        const resLabels = {
            'mean':'mean_label', 'geoMean':'geo_mean_label', 'stdDev':'std_dev_label', 'downsideDev':'downside_dev_label',
            'variance':'variance_label', 'cv':'cv_label', 'mdd':'mdd_label', 'mdd_period':'mdd_period_label',
            'skewness':'skewness_label', 'kurtosis':'kurtosis_label', 'var5':'var_label', 'var95':'var_95_label',
            'cvar5':'cvar_label', 'maxGain':'max_gain_label', 'sharpeRatio':'sharpe_label', 'sortinoRatio':'sortino_label',
            'omegaRatio':'omega_label',
            'treynorRatio':'treynor_ratio_label', 'calmarRatio':'calmar_ratio_label', 'jensenAlpha':'jensen_alpha_label',
            'm2Measure':'m2_measure_label', 'alphaTStat':'alpha_t_stat_label',
            'trackingError':'tracking_error_label', 'informationRatio':'information_ratio_label',
            'beta':'beta_label', 'alpha':'alpha_label', 'rSquared':'rsquared_label',
            'capmExpectedReturn':'capm_expected_return_label', 'regStdErr':'reg_stderr_label',
            'betaTStat':'beta_t_stat_label', 'betaPValue':'beta_p_value_label',
            'alphaPValue':'alpha_p_value_label'
        };
        resOrder.forEach(key => {
            if(results.hasOwnProperty(key) && !isNaN(results[key])) {
                assetResultsData.push([_t(resLabels[key] || key + '_label'), formatNumber(results[key], (key==='var'||key==='rSquared'||key==='beta'||key==='alpha'||key==='cv'||key==='skew'||key==='kurt'||key==='sh'||key==='so'||key==='omega'||key==='informationRatio'||key==='regStdErr'||key==='betaTStat'||key==='alphaTStat'||key==='betaPValue'||key==='alphaPValue'?3:2), (key.includes('Return')||key==='mean'||key==='gm'||key==='std'||key==='dsd'||key==='mdd'||key==='var5'||key==='var95'||key==='cvar5'||key==='max_gain'||key==='alpha'||key==='trackingError'))]);
            }
        });
        assetResultsData.push([]);
        assetResultsData.push([_t('excel_sheet_raw_data_title')]);
        assetResultsData.push([_t('col_return')]);
        dataPoints.forEach(p => assetResultsData.push([p]));
        if(marketDataPoints.length > 0) { assetResultsData.push([]); assetResultsData.push(['Market Data']); marketDataPoints.forEach(p => assetResultsData.push([p]));}
        if(benchmarkDataPoints.length > 0) { assetResultsData.push([]); assetResultsData.push(['Benchmark Data']); benchmarkDataPoints.forEach(p => assetResultsData.push([p]));}
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assetResultsData), _t('tab_asset_analysis'));
    }

    // Equity Valuation Sheet
    if (Object.keys(equityCalculatedResults).length > 0) {
        const results = equityCalculatedResults;
        const equityResultsData = [
            [{ v: _t('equity_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('ddm_value_label'), results.ddm],
            [_t('ggm_value_label'), results.ggm],
            [_t('pe_ratio_label'), results.peRatio],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(equityResultsData), _t('tab_equity_valuation'));
    }

    // Fixed Income Sheet
    if (Object.keys(fixedIncomeCalculatedResults).length > 0) {
        const results = fixedIncomeCalculatedResults;
        const fixedIncomeResultsData = [
            [{ v: _t('fixed_income_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('bond_price_label'), results.bondPrice],
            [_t('ytm_label'), results.ytm],
            [_t('macaulay_duration_label'), results.macaulayDuration],
            [_t('modified_duration_label'), results.modifiedDuration],
            [_t('convexity_label'), results.convexity],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fixedIncomeResultsData), _t('tab_fixed_income'));
    }

    // Portfolio Management Sheet
    if (Object.keys(portfolioCalculatedResults).length > 0) {
        const results = portfolioCalculatedResults;
        const portfolioResultsData = [
            [{ v: _t('portfolio_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('portfolio_expected_return_label'), results.expectedReturn],
            [_t('portfolio_stddev_label'), results.stdDev],
            [_t('portfolio_variance_label'), results.portfolioVariance],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(portfolioResultsData), _t('tab_portfolio_management'));
    }

    if (wb.SheetNames.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        return;
    }

    const filename = `FinancialAnalysisResults_${now.toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    updateStatus('status_saving_excel_success', { filename }, 'success');
}

// --- Bilingual research help system ---
const tooltipOverrides = {
    mean_tooltip:{en:'Arithmetic mean is the sum of periodic returns divided by the number of observations. It ignores compounding and can be pulled by outliers; use geometric return for multi-period wealth growth.',fa:'میانگین حسابی برابر مجموع بازده‌های دوره‌ای تقسیم بر تعداد مشاهدات است. اثر ترکیب را نادیده می‌گیرد و از داده‌های پرت اثر می‌پذیرد؛ برای رشد ثروت چنددوره‌ای از بازده هندسی استفاده کنید.'},
    geo_mean_tooltip:{en:'Geometric mean compounds the period returns and represents the constant per-period rate that produces the same ending wealth. It requires returns above −100%; annualize only when observation frequency and period count are known.',fa:'میانگین هندسی بازده‌ها را به‌صورت مرکب محاسبه می‌کند و نرخ ثابت هر دوره‌ای را نشان می‌دهد که همان ثروت پایانی را می‌سازد. بازده‌ها باید بیشتر از ۱۰۰٪− باشند؛ سالانه‌سازی فقط با دانستن تناوب و تعداد دوره‌ها معتبر است.'},
    std_dev_tooltip:{en:'Standard deviation measures dispersion around the sample mean and is commonly used as total volatility risk. It treats upside and downside deviations symmetrically and can understate non-normal tail risk; compare only matching frequencies and annualization.',fa:'انحراف معیار پراکندگی حول میانگین نمونه را می‌سنجد و معمولاً معیار نوسان کل است. انحراف مثبت و منفی را یکسان می‌بیند و ممکن است ریسک دنباله‌ای توزیع غیرنرمال را کم‌برآورد کند؛ تناوب و سالانه‌سازی را هماهنگ کنید.'},
    downside_dev_tooltip:{en:'Downside deviation measures dispersion below the stated target (zero here), rather than penalizing favorable volatility. The result depends on the target, sampling frequency, and whether returns are simple or logarithmic.',fa:'انحراف نزولی پراکندگی زیر هدف تعیین‌شده (اینجا صفر) را می‌سنجد و نوسان مطلوب را جریمه نمی‌کند. نتیجه به هدف، تناوب نمونه‌گیری و ساده یا لگاریتمی بودن بازده وابسته است.'},
    var_tooltip:{en:'Historical 5% VaR is the empirical loss threshold associated with the lower tail of the supplied observations. It is not the worst possible loss and does not describe loss severity beyond the threshold; the estimate is sample-dependent.',fa:'VaR تاریخی ۵٪ آستانه زیان تجربی متناظر با دنباله پایین مشاهدات واردشده است. بدترین زیان ممکن را نشان نمی‌دهد و شدت زیان فراتر از آستانه را توصیف نمی‌کند؛ برآورد به نمونه وابسته است.'},
    cvar_tooltip:{en:'CVaR/Expected Shortfall averages outcomes in the tail beyond the selected VaR threshold, conveying tail-loss severity. With a small sample it is unstable, and the exact tail convention depends on the implementation.',fa:'CVaR یا زیان موردانتظار، پیامدهای دنباله فراتر از آستانه VaR را میانگین می‌گیرد و شدت زیان دنباله را نشان می‌دهد. در نمونه کوچک ناپایدار است و قرارداد دقیق دنباله به پیاده‌سازی وابسته است.'},
    sharpe_tooltip:{en:'Sharpe ratio is mean excess return divided by total return volatility. It is meaningful only when return and risk-free periods are aligned; annualization, serial correlation, and skewed returns can materially change interpretation.',fa:'نسبت شارپ، بازده مازاد میانگین را بر نوسان کل بازده تقسیم می‌کند. فقط با هم‌دوره بودن بازده و نرخ بدون ریسک معنادار است؛ سالانه‌سازی، خودهمبستگی و چولگی می‌توانند تفسیر را تغییر دهند.'},
    sortino_tooltip:{en:'Sortino ratio scales excess return by downside deviation below a target. State the target and frequency; it may look unusually strong when few observations breach the target and is not directly comparable with Sharpe without context.',fa:'نسبت سورتینو بازده مازاد را با انحراف نزولی زیر یک هدف مقیاس می‌کند. هدف و تناوب را مشخص کنید؛ اگر مشاهدات کمی از هدف پایین‌تر باشند، نسبت می‌تواند غیرعادی بالا شود و بدون زمینه با شارپ قابل‌مقایسه نیست.'},
    cv_tooltip:{en:'Coefficient of variation is standard deviation divided by mean return and expresses dispersion per unit of average return. It becomes unstable when the mean is near zero or negative, so it is not a universal ranking measure.',fa:'ضریب تغییرات، انحراف معیار تقسیم بر بازده میانگین و پراکندگی به‌ازای هر واحد بازده متوسط است. وقتی میانگین نزدیک صفر یا منفی باشد ناپایدار می‌شود و معیار رتبه‌بندی عمومی نیست.'},
    mdd_tooltip:{en:'Maximum drawdown is the largest peak-to-trough decline in the cumulative wealth path over the observed sample. It depends on observation order and sample window, and says nothing about recovery probability beyond the sample.',fa:'حداکثر افت، بزرگ‌ترین کاهش از اوج تا کف مسیر ثروت تجمعی در نمونه مشاهده‌شده است. به ترتیب مشاهدات و پنجره نمونه وابسته است و احتمال بازیابی پس از پایان نمونه را نمی‌گوید.'},
    beta_tooltip:{en:'Beta estimates sensitivity of asset returns to the chosen market proxy, typically from a regression. It is sample-window and benchmark dependent, can shift with leverage and regime, and is not a standalone measure of total risk.',fa:'بتا حساسیت بازده دارایی به نماینده منتخب بازار را، معمولاً از رگرسیون، برآورد می‌کند. به پنجره نمونه و معیار بازار وابسته است، با اهرم و رژیم تغییر می‌کند و به‌تنهایی معیار ریسک کل نیست.'},
    alpha_tooltip:{en:'Regression alpha is the intercept not explained by the selected market model over the sample. It is not proof of skill: inspect confidence intervals, p-values, model omissions, fees, and out-of-sample persistence.',fa:'آلفای رگرسیون عرض از مبدأیی است که مدل بازار منتخب در نمونه توضیح نمی‌دهد. اثبات مهارت نیست: فاصله اطمینان، مقدار p، عوامل حذف‌شده، هزینه‌ها و پایداری خارج از نمونه را بررسی کنید.'},
    tracking_error_tooltip:{en:'Tracking error is the standard deviation of periodic active returns (portfolio minus benchmark), not the average underperformance. Align observations and frequency; low tracking error can still accompany persistent negative active return.',fa:'خطای تعقیب انحراف معیار بازده فعال دوره‌ای (پرتفوی منهای معیار) است، نه میانگین عملکرد ضعیف‌تر. مشاهدات و تناوب را هم‌تراز کنید؛ خطای تعقیب پایین هم می‌تواند با بازده فعال منفی پایدار همراه باشد.'},
    information_ratio_tooltip:{en:'Information ratio divides mean active return by tracking error and summarizes active return per unit of active risk. Benchmark choice, time alignment, and serial correlation affect the estimate; inspect both numerator and denominator.',fa:'نسبت اطلاعات، میانگین بازده فعال را بر خطای تعقیب تقسیم می‌کند و بازده فعال به‌ازای واحد ریسک فعال را خلاصه می‌کند. انتخاب معیار، هم‌ترازی زمانی و خودهمبستگی مؤثرند؛ صورت و مخرج را جداگانه ببینید.'},
    treynor_ratio_tooltip:{en:'Treynor ratio divides excess return by systematic risk measured by beta. It is most useful for diversified portfolios; a near-zero or negative beta makes the ratio unstable or misleading.',fa:'نسبت ترینر بازده مازاد را بر ریسک سیستماتیکِ سنجیده‌شده با بتا تقسیم می‌کند. برای پرتفوی متنوع مفیدتر است؛ بتای نزدیک صفر یا منفی نسبت را ناپایدار یا گمراه‌کننده می‌کند.'},
    calmar_ratio_tooltip:{en:'Calmar ratio compares annualized return with the magnitude of maximum drawdown over the same sample. Results are highly window-dependent and should be read with drawdown duration and recovery history.',fa:'نسبت کالمار بازده سالانه‌شده را با اندازه حداکثر افت در همان نمونه مقایسه می‌کند. به‌شدت به پنجره وابسته است و باید همراه با طول افت و سابقه بازیابی تفسیر شود.'},
    jensen_alpha_tooltip:{en:'Jensen alpha is realized return minus the CAPM-implied return for the selected beta and market premium. It is model- and period-dependent; statistical significance and benchmark suitability matter.',fa:'آلفای جنسن بازده تحقق‌یافته منهای بازده ضمنی CAPM برای بتا و صرف ریسک منتخب است. به مدل و دوره وابسته است؛ معناداری آماری و مناسب‌بودن معیار اهمیت دارد.'},
    m2_measure_tooltip:{en:'M-squared rescales a portfolio’s risk-adjusted return to the benchmark volatility, making the result interpretable as a return. It inherits Sharpe assumptions and depends on the selected benchmark risk.',fa:'معیار M² بازده تعدیل‌شده با ریسک پرتفوی را به نوسان معیار مقیاس می‌کند تا به‌صورت بازده قابل‌تفسیر باشد. مفروضات شارپ را به ارث می‌برد و به ریسک معیار منتخب وابسته است.'},
    rf_tooltip:{en:'The risk-free rate is the reference return for time value and excess-return calculations. Use an annual rate in the same currency as the asset, then match it to each observation period before computing Sharpe, Treynor, or CAPM.',fa:'نرخ بدون ریسک بازده مرجع ارزش زمانی پول و محاسبه بازده مازاد است. نرخ سالانه هم‌ارز با دارایی را وارد و پیش از محاسبه شارپ، ترینر یا CAPM با هر دوره مشاهده هماهنگ کنید.'},
    expected_market_return_tooltip:{en:'Expected market return is the forward-looking return assumption for the market portfolio proxy. CAPM uses market return minus the risk-free rate as the equity risk premium; keep horizon and currency consistent.',fa:'بازده موردانتظار بازار، فرض آینده‌نگر بازده نماینده پرتفوی بازار است. CAPM تفاوت آن با نرخ بدون ریسک را صرف ریسک سهام می‌گیرد؛ افق و ارز را یکسان نگه دارید.'},
    current_dividend_tooltip:{en:'D0 is the latest annual dividend per share actually paid or declared for the relevant share class. Confirm timing, special distributions, currency, and whether the input is trailing or forward before using a dividend model.',fa:'D0 آخرین سود سالانه هر سهم است که برای طبقه سهام مربوط پرداخت یا اعلام شده است. زمان‌بندی، پرداخت ویژه، ارز و گذشته‌نگر یا آینده‌نگر بودن را پیش از استفاده در مدل سود تقسیمی بررسی کنید.'},
    dividend_growth_rate_tooltip:{en:'Dividend growth is the assumed sustainable long-run rate, not simply the latest historical growth. In Gordon growth, it must remain below required return; stress-test mature growth against nominal economic growth.',fa:'رشد سود تقسیمی، فرض نرخ پایدار بلندمدت است و صرفاً رشد تاریخی اخیر نیست. در مدل گوردون باید کمتر از نرخ بازده موردنیاز باشد؛ رشد بالغ را با رشد اسمی اقتصاد مقایسه و حساسیت‌سنجی کنید.'},
    required_return_equity_tooltip:{en:'Required return is the equity discount rate reflecting time value and risk. Its definition must match the dividend currency and nominal/real basis; valuation becomes highly sensitive as it approaches the growth rate.',fa:'نرخ بازده موردنیاز، نرخ تنزیل سهام متناسب با ارزش زمانی پول و ریسک است. تعریف آن باید با ارز سود تقسیمی و مبنای اسمی/واقعی سازگار باشد؛ نزدیک‌شدنش به نرخ رشد حساسیت ارزش را شدید می‌کند.'},
    ytm_input_tooltip:{en:'Yield to maturity is the discount rate equating the bond price with contractual coupon and principal cash flows. It assumes payment as promised and reinvestment at that yield; it is not expected return when default, calls, or trading intervene.',fa:'بازده تا سررسید نرخی است که قیمت اوراق را با جریان‌های قراردادی کوپن و اصل برابر می‌کند. پرداخت کامل و سرمایه‌گذاری مجدد با همان نرخ را فرض می‌کند؛ با نکول، اختیار بازخرید یا معامله، بازده موردانتظار نیست.'},
    modified_duration_tooltip:{en:'Modified duration estimates the percentage price change for a small parallel yield change, approximately −duration × yield change. It assumes a local linear relationship and becomes less accurate for large moves or embedded options.',fa:'دیرش تعدیل‌شده تغییر درصدی تقریبی قیمت را برای تغییر کوچک و موازی بازده برآورد می‌کند: تقریباً منفی دیرش ضربدر تغییر بازده. رابطه خطی موضعی فرض می‌شود و برای تغییر بزرگ یا اختیار ضمنی دقت کمتری دارد.'},
    convexity_tooltip:{en:'Convexity captures the curvature of the bond price-yield relationship and improves duration estimates for larger rate moves. It is still a local approximation; calls, puts, and changing credit spreads can alter observed sensitivity.',fa:'محدبیت خمیدگی رابطه قیمت و بازده اوراق را می‌سنجد و برای تغییر نرخ بزرگ‌تر، برآورد دیرش را بهبود می‌دهد. همچنان تقریب موضعی است؛ اختیارها و تغییر فاصله اعتباری حساسیت واقعی را عوض می‌کنند.'},
    help_tab_asset:{en:'Enter aligned asset, market, and benchmark return series; review distribution, drawdown, regression, and risk-adjusted performance statistics. Historical observations do not guarantee future behavior.',fa:'سری‌های بازده دارایی، بازار و معیار را هم‌تراز وارد و توزیع، افت، رگرسیون و شاخص‌های تعدیل‌شده با ریسک را بررسی کنید. مشاهدات تاریخی رفتار آینده را تضمین نمی‌کنند.'},
    help_tab_equity:{en:'Estimate value per share with dividend discount approaches and compare price with earnings multiples. Results depend on payout sustainability, growth, required return, and share-class assumptions.',fa:'ارزش هر سهم را با روش‌های تنزیل سود تقسیمی برآورد و قیمت را با ضرایب سود مقایسه کنید. نتایج به پایداری پرداخت، رشد، بازده موردنیاز و مفروضات طبقه سهام وابسته‌اند.'},
    help_tab_fixed_income:{en:'Analyze coupon and principal cash flows, price, yield, duration, and convexity. Yield measures rely on contractual cash flows and do not automatically incorporate default, liquidity, or option risk.',fa:'جریان‌های کوپن و اصل، قیمت، بازده، دیرش و محدبیت را تحلیل کنید. محاسبه بازده بر جریان‌های قراردادی تکیه دارد و ریسک نکول، نقدشوندگی یا اختیار را خودکار لحاظ نمی‌کند.'},
    help_tab_portfolio:{en:'Estimate portfolio return and volatility from asset assumptions, allocation weights, and pairwise correlations. Validate weight totals and stress-test correlations and inputs.',fa:'بازده و نوسان پرتفوی را از فرض دارایی‌ها، وزن تخصیص و همبستگی‌های دوتایی برآورد کنید. جمع وزن‌ها را کنترل و همبستگی‌ها و ورودی‌ها را در سناریوی تنش بسنجید.'}
};
Object.assign(detailedHelpTexts,tooltipOverrides,{
    help_bond_face:{en:'Face value is the principal amount contractually repaid at maturity per bond. Use the denomination matching the quoted market price and coupon cash flows.',fa:'ارزش اسمی مبلغ اصل قراردادی بازپرداخت‌شده در سررسید برای هر ورقه است. همان واحدی را وارد کنید که قیمت بازار و جریان کوپن با آن اعلام شده‌اند.'},
    help_bond_coupon:{en:'Annual coupon rate applied to face value. Convert it to each payment period using the selected frequency; floating, step-up, and irregular coupons are outside this simplified calculation.',fa:'نرخ کوپن سالانه بر ارزش اسمی اعمال می‌شود. آن را با تناوب انتخاب‌شده به پرداخت هر دوره تبدیل کنید؛ کوپن شناور، پلکانی و نامنظم خارج از این محاسبه ساده است.'},
    help_bond_maturity:{en:'Remaining years until principal repayment. Enter a positive horizon consistent with coupon frequency and settlement assumptions; day-count and stub-period conventions are simplified.',fa:'سال‌های باقی‌مانده تا بازپرداخت اصل است. افق مثبت و سازگار با تناوب کوپن وارد کنید؛ قرارداد شمارش روز و دوره ناقص ساده‌سازی شده‌اند.'},
    help_bond_price:{en:'Observed clean or quoted market price per bond, on the same face-value basis. If the quote is dirty, accrued interest may need to be separated before comparing with model value.',fa:'قیمت مشاهده‌شده یا مظنه هر ورقه را بر همان مبنای ارزش اسمی وارد کنید. اگر قیمت شامل بهره انباشته است، پیش از مقایسه با ارزش مدل آن را تفکیک کنید.'},
    help_bond_frequency:{en:'Coupon payments per year: annual, semiannual, quarterly, or monthly. Frequency changes the cash-flow schedule and yield conversion; confirm the bond terms.',fa:'تعداد پرداخت کوپن در سال: سالانه، شش‌ماهه، فصلی یا ماهانه. تناوب، برنامه جریان نقد و تبدیل بازده را تغییر می‌دهد؛ شرایط اوراق را بررسی کنید.'},
    help_company_name:{en:'Use the legal or commonly recognized issuer name so saved periods can be identified consistently. Avoid creating duplicate records under spelling variants.',fa:'نام قانونی یا شناخته‌شده ناشر را ثابت ثبت کنید تا دوره‌های ذخیره‌شده یک شرکت درست شناسایی شوند. از ساخت رکورد تکراری با املای متفاوت پرهیز کنید.'},
    help_company_ticker:{en:'Enter the primary exchange ticker or another stable identifier. Tickers can be reused across markets or changed over time, so retain the company name and currency as additional identifiers.',fa:'نماد اصلی بورس یا شناسه پایدار دیگری را وارد کنید. نماد ممکن است در بازارهای مختلف تکرار یا در طول زمان تغییر کند؛ نام شرکت و ارز را نیز به‌عنوان شناسه نگه دارید.'},
    help_company_industry:{en:'Assign a relevant industry or peer group for filtering. Similar labels do not guarantee comparable business mix, regulation, accounting, or capital intensity.',fa:'صنعت یا گروه همتای مناسب را برای فیلترکردن ثبت کنید. برچسب مشابه، ترکیب کسب‌وکار، مقررات، حسابداری یا شدت سرمایه قابل‌مقایسه را تضمین نمی‌کند.'},
    help_company_select:{en:'Select the local company record to edit. Before changing identity or reporting basis, confirm the currently loaded period and save or discard pending changes.',fa:'رکورد محلی شرکتی را که می‌خواهید ویرایش کنید انتخاب کنید. پیش از تغییر هویت یا مبنای گزارش، دوره بارشده را بررسی و تغییرات ذخیره‌نشده را ثبت یا لغو کنید.'},
    help_company_period_select:{en:'Load an existing saved fiscal period for the selected company. Confirm its metadata and source before editing; saving updates that company-period record.',fa:'دوره مالی ذخیره‌شده شرکت انتخابی را بارگذاری کنید. پیش از ویرایش فراداده و منبع را بررسی کنید؛ ذخیره، همان رکورد شرکت-دوره را به‌روز می‌کند.'},
    help_company_months:{en:'Number of months covered by this report. Use the actual fiscal-period length; simple annualization scales flow items linearly and can be misleading for seasonal or uneven businesses.',fa:'تعداد ماه‌های پوشش‌داده‌شده گزارش است. طول واقعی دوره مالی را وارد کنید؛ سالانه‌سازی خطی اقلام جریانی را مقیاس می‌کند و برای کسب‌وکار فصلی یا نامتوازن می‌تواند گمراه‌کننده باشد.'},
    help_company_opinion:{en:'Record the auditor’s opinion as stated in the report. Read the auditor’s basis and key matters; a clean or unmodified opinion is not a guarantee of issuer quality or future performance.',fa:'نظر حسابرس را همان‌طور که در گزارش آمده ثبت کنید. مبنای نظر و موضوعات کلیدی حسابرسی را بخوانید؛ نظر مقبول تضمین کیفیت ناشر یا عملکرد آینده نیست.'},
    help_compare_universe:{en:'Filter the comparison universe to all saved companies or a selected industry group. The filter is organizational, not a statistical screen for business-model comparability.',fa:'مجموعه مقایسه را به همه شرکت‌های ذخیره‌شده یا صنعت منتخب محدود کنید. این فیلتر صرفاً سازمان‌دهی است و همسانی مدل کسب‌وکار را از نظر آماری تأیید نمی‌کند.'},
    help_fin_period:{en:'Specify the number of months represented by flow statement inputs. Reported mode keeps period flows as entered; annualized mode scales flows linearly to twelve months, which can obscure seasonality.',fa:'تعداد ماه‌های نمایندگی‌شده در ورودی‌های جریانی را مشخص کنید. حالت گزارش‌شده جریان‌ها را بدون تغییر نگه می‌دارد؛ سالانه‌سازی آن‌ها را خطی تا دوازده ماه مقیاس می‌کند و ممکن است فصل‌پذیری را پنهان کند.'},
    help_fin_basis:{en:'Choose reported-period or linearly annualized presentation for flow metrics. Balance-sheet stocks and per-share market prices are not annualized; peer comparisons use their own annualized basis.',fa:'نمایش گزارش‌شده یا سالانه‌سازی خطی شاخص‌های جریانی را انتخاب کنید. مانده‌های ترازنامه و قیمت بازار هر سهم سالانه نمی‌شوند؛ مقایسه همتایان مبنای سالانه خود را دارد.'},
    help_dcf_derived_wacc:{en:'When enabled, estimate WACC from CAPM cost of equity and market-value equity/debt weights. Verify beta, equity risk premium, marginal debt cost, taxes, share price, and debt scope; otherwise use explicit scenario WACC.',fa:'با فعال‌کردن، WACC از هزینه سهام CAPM و وزن بازار سهام/بدهی برآورد می‌شود. بتا، صرف ریسک، هزینه نهایی بدهی، مالیات، قیمت سهم و دامنه بدهی را بررسی کنید؛ در غیر این صورت WACC سناریویی را دستی وارد کنید.'},
    help_asset_edit_select:{en:'Choose an existing observation to edit or delete. The displayed item order is the time order used in cumulative returns, drawdown, and regression; preserve the correct chronology.',fa:'مشاهده موجود را برای ویرایش یا حذف انتخاب کنید. ترتیب نمایش همان ترتیب زمانی محاسبه بازده تجمعی، افت و رگرسیون است؛ توالی درست را حفظ کنید.'},
    help_asset_edit_value:{en:'Enter the replacement return for the selected observation using the same percentage convention as the original series. Recalculate metrics after saving the edit.',fa:'بازده جایگزین مشاهده انتخاب‌شده را با همان قرارداد درصدی سری اصلی وارد کنید. پس از ذخیره ویرایش، شاخص‌ها را دوباره محاسبه کنید.'},
    help_asset_import:{en:'Import a local CSV, Excel, or text file containing a numeric return column. Inspect delimiter, headers, units, date order, and invalid rows; importing does not validate the source.',fa:'فایل محلی CSV، Excel یا متن شامل ستون عددی بازده را وارد کنید. جداکننده، سرستون‌ها، واحدها، ترتیب تاریخ و سطرهای نامعتبر را بررسی کنید؛ ورود فایل منبع را اعتبارسنجی نمی‌کند.'},
    help_asset_return_series:{en:'Enter periodic asset returns as percentages, separated by commas, spaces, or new lines. Use chronological order and one consistent period frequency; do not mix prices with returns.',fa:'بازده‌های دوره‌ای دارایی را به درصد و با ویرگول، فاصله یا خط جدید جدا کنید. ترتیب زمانی و تناوب دوره را ثابت نگه دارید؛ قیمت را با بازده مخلوط نکنید.'},
    help_market_series:{en:'Enter market-proxy returns for the same dates, frequency, and percentage convention as the asset series. CAPM regression requires paired observations; missing dates can bias beta and alpha.',fa:'بازده نماینده بازار را برای همان تاریخ‌ها، تناوب و قرارداد درصدی سری دارایی وارد کنید. رگرسیون CAPM به مشاهدات جفت‌شده نیاز دارد؛ تاریخ‌های مفقود می‌توانند بتا و آلفا را منحرف کنند.'},
    help_benchmark_series:{en:'Enter benchmark returns aligned observation-by-observation with the asset series. This series drives active return, tracking error, and information ratio; the market series used for CAPM can be different.',fa:'بازده معیار را مشاهده‌به‌مشاهده با سری دارایی هم‌تراز وارد کنید. این سری بازده فعال، خطای تعقیب و نسبت اطلاعات را می‌سازد؛ معیار می‌تواند با بازار CAPM متفاوت باشد.'},
    help_analyst_roic:{en:'ROIC compared with WACC is an economic-profit signal only when both measures use consistent operating scope, tax, currency, period, and capital definitions. A positive spread is not by itself proof of durable value creation.',fa:'مقایسه ROIC با WACC فقط وقتی سیگنال سود اقتصادی معنادار است که دامنه عملیاتی، مالیات، ارز، دوره و تعریف سرمایه یکسان باشد. فاصله مثبت به‌تنهایی خلق ارزش پایدار را اثبات نمی‌کند.'},
    help_analyst_roe:{en:'DuPont ROE decomposes return into net margin, asset turnover, and equity multiplier. Compare changes in each driver over time; rising ROE driven mainly by leverage can increase financial risk.',fa:'ROE دوپون بازده را به حاشیه خالص، گردش دارایی و ضریب حقوق صاحبان سهام تفکیک می‌کند. تغییر هر محرک را در زمان مقایسه کنید؛ رشد ROE عمدتاً ناشی از اهرم می‌تواند ریسک مالی را بالا ببرد.'},
    help_analyst_cash:{en:'CFO/net income compares operating cash generation with accounting earnings. Persistent weakness can reflect working-capital investment or accrual quality; interpret multi-year patterns and business growth.',fa:'CFO تقسیم بر سود خالص، تولید وجه نقد عملیاتی را با سود حسابداری مقایسه می‌کند. ضعف پایدار می‌تواند از سرمایه‌گذاری در سرمایه در گردش یا کیفیت اقلام تعهدی ناشی شود؛ روند چندساله و رشد کسب‌وکار را بسنجید.'},
    help_analyst_leverage:{en:'Net debt/EBITDA relates debt net of cash to an earnings proxy. EBITDA omits interest, taxes, capital spending, and working capital; review maturity schedule, lease treatment, covenants, and cash availability.',fa:'بدهی خالص به EBITDA، بدهی پس از کسر نقد را به نماینده سود مرتبط می‌کند. EBITDA بهره، مالیات، CapEx و سرمایه در گردش را حذف می‌کند؛ سررسید، اجاره، شروط و دسترسی به وجه نقد را بررسی کنید.'},
    help_button_action:{en:'This control applies the labeled action to the current workspace. Review the surrounding inputs and any confirmation prompt before committing changes.',fa:'این کنترل عملیات درج‌شده را روی فضای کاری فعلی اجرا می‌کند. پیش از ثبت تغییر، ورودی‌های اطراف و پیام تأیید را بررسی کنید.'}
});

const tooltipControlIds = {
    'rf-rate':'help_rf_rate','portfolio-rf-rate':'help_rf_rate','expected-market-return':'help_market_return','current-dividend':'current_dividend_tooltip','dividend-growth-rate':'dividend_growth_rate_tooltip','required-return-equity':'required_return_equity_tooltip','earnings-per-share':'earnings_per_share_tooltip','current-share-price':'help_fin_current_share_price',
    'face-value':'help_bond_face','coupon-rate':'help_bond_coupon','years-to-maturity':'help_bond_maturity','market-price-bond':'help_bond_price','ytm-input':'ytm_input_tooltip','coupon-frequency':'help_bond_frequency',
    'company-name':'help_company_name','company-ticker':'help_company_ticker','company-industry':'help_company_industry','company-currency':'help_company_currency','company-scale':'help_company_scale','company-period':'help_company_period','company-select':'help_company_select','company-period-select':'help_company_period_select','company-period-months':'help_company_months','company-reporting-basis':'help_company_scope','company-assurance-status':'help_company_assurance','company-audit-opinion':'help_company_opinion','company-source-document':'help_company_source','company-source-pdf':'help_company_source','company-source-page':'help_company_source','company-restated':'help_company_restated','compare-industry-select':'help_compare_universe','compare-period-select':'help_compare_period','compare-group-select':'help_compare_metric','compare-trend-metric':'help_compare_metric','financial-period-months':'help_fin_period','financial-flow-basis':'help_fin_basis','financial-chart-group':'help_chart_group','tradingview-symbol':'help_quote_symbol',
    'value-entry':'help_asset_return_series','market-value-entry':'help_market_series','benchmark-value-entry':'help_benchmark_series','add-button':'help_asset_return_series','financial-workbook-file':'help_section_workbook',
    'dcf-nwc-sales':'help_dcf_nwc_sales','dcf-capex-sales':'help_dcf_capex_sales','dcf-da-sales':'help_dcf_da_sales','dcf-risk-free':'help_dcf_risk_free','dcf-beta':'help_dcf_beta','dcf-erp':'help_dcf_erp','dcf-cost-debt':'help_dcf_cost_debt','dcf-years':'help_dcf_horizon','dcf-tax':'help_dcf_tax','dcf-use-derived-wacc':'help_dcf_derived_wacc','edit-select':'help_asset_edit_select','edit-value-entry':'help_asset_edit_value','file-importer-input-asset':'help_asset_import',
    'tvm-target':'help_tvm_target','tvm-pv':'help_tvm_pv','tvm-pmt':'help_tvm_pmt','tvm-fv':'help_tvm_fv','tvm-rate':'help_tvm_rate','tvm-years':'help_tvm_years','tvm-frequency':'help_tvm_frequency','tvm-timing':'help_tvm_timing','pricing-rf':'help_pricing_rf','pricing-market-return':'help_pricing_market','pricing-market-beta':'help_pricing_beta','apt-premium-1':'help_apt_premium','apt-premium-2':'help_apt_premium','apt-premium-3':'help_apt_premium','apt-beta-1':'help_apt_beta','apt-beta-2':'help_apt_beta','apt-beta-3':'help_apt_beta'
};

Object.assign(detailedHelpTexts, {
    help_portfolio_name:{en:'Give the asset a recognizable name. Labels only identify rows in this local portfolio and do not change the return, volatility, weight, or correlation calculations.',fa:'برای دارایی نامی قابل‌شناسایی بگذارید. این نام فقط ردیف را در پرتفوی محلی مشخص می‌کند و محاسبات بازده، نوسان، وزن یا همبستگی را تغییر نمی‌دهد.'},
    help_portfolio_remove:{en:'Remove this asset and its associated correlation inputs from the current portfolio. Recheck remaining weights and correlations before calculating again.',fa:'این دارایی و ورودی‌های همبستگی وابسته به آن را از پرتفوی فعلی حذف می‌کند. پیش از محاسبه دوباره، وزن‌ها و همبستگی‌های باقی‌مانده را بررسی کنید.'},
    help_fin_accounts_payable_prior:{en:'Enter accounts payable at the beginning of the reporting period. DPO uses the average of opening and closing payables when both are available; align the balance with the COGS period.',fa:'حساب‌های پرداختنی ابتدای دوره گزارش را وارد کنید. در صورت وجود هر دو مانده، DPO از میانگین ابتدا و انتها استفاده می‌کند؛ مانده را با دوره بهای تمام‌شده هماهنگ کنید.'},
    help_fin_inventory_prior:{en:'Enter inventory at the beginning of the reporting period. DIO uses average inventory when both opening and closing balances are available; check valuation basis and seasonality.',fa:'موجودی ابتدای دوره گزارش را وارد کنید. در صورت وجود هر دو مانده، DIO از میانگین موجودی استفاده می‌کند؛ مبنای ارزش‌گذاری و فصل‌پذیری را بررسی کنید.'},
    help_fin_accounts_receivable_prior:{en:'Enter accounts receivable at the beginning of the reporting period. DSO uses average receivables when both opening and closing balances are available; align net sales and period length.',fa:'حساب‌های دریافتنی ابتدای دوره گزارش را وارد کنید. در صورت وجود هر دو مانده، DSO از میانگین دریافتنی‌ها استفاده می‌کند؛ فروش خالص و طول دوره را هماهنگ کنید.'},
    help_tvm_target:{en:'Choose whether to solve for FV, PV, or the equal periodic contribution. The selected output field is disabled; all remaining required assumptions must be supplied.',fa:'تعیین کنید FV، PV یا واریز دوره‌ای برابر محاسبه شود. فیلد خروجی انتخاب‌شده غیرفعال می‌شود و سایر مفروضات لازم باید تکمیل شوند.'},
    help_tvm_pv:{en:'Opening lump-sum investment at time zero. Positive values are treated as invested capital; positive PMT values are additional deposits made at each selected period.',fa:'سرمایه‌گذاری یکجای اولیه در زمان صفر. مقدار مثبت به‌عنوان سرمایه‌گذاری در نظر گرفته می‌شود و PMT مثبت واریزهای اضافی هر دوره است.'},
    help_tvm_pmt:{en:'Equal additional deposit at the selected payment frequency. Payments are assumed to occur at the beginning or end of each period as selected below; withdrawals are not modeled as a separate cash-flow stream.',fa:'واریز اضافی برابر در تناوب انتخاب‌شده. پرداخت مطابق انتخاب پایین در ابتدا یا انتهای دوره انجام می‌شود؛ برداشت‌ها به‌صورت جریان نقدی مجزا مدل نشده‌اند.'},
    help_tvm_fv:{en:'Target account value at the end of the horizon. In PV mode it is discounted back net of periodic deposits; in PMT mode it is the future target to reach.',fa:'ارزش هدف حساب در پایان افق. در حالت PV، پس از کسر واریزها به امروز تنزیل می‌شود؛ در حالت PMT هدف نهایی موردنیاز است.'},
    help_tvm_rate:{en:'Nominal annual rate divided by compounding frequency to get the periodic rate. This assumes a constant rate and does not account for inflation, taxes, fees, or reinvestment uncertainty.',fa:'نرخ اسمی سالانه که بر تناوب ترکیب تقسیم می‌شود تا نرخ دوره‌ای به‌دست آید. نرخ ثابت فرض شده و تورم، مالیات، کارمزد یا عدم قطعیت سرمایه‌گذاری مجدد را لحاظ نمی‌کند.'},
    help_tvm_years:{en:'Length of the investment horizon. The calculator multiplies years by the selected annual frequency to determine the number of periods.',fa:'مدت افق سرمایه‌گذاری. محاسبه‌گر سال‌ها را در تناوب سالانه انتخاب‌شده ضرب می‌کند تا تعداد دوره‌ها به‌دست آید.'},
    help_tvm_frequency:{en:'Number of compounding and deposit periods per year. The calculator assumes deposits occur at this same frequency as interest compounding.',fa:'تعداد دوره‌های ترکیب سود و واریز در سال. فرض می‌شود واریزها و ترکیب سود تناوب یکسانی دارند.'},
    help_tvm_timing:{en:'An ordinary annuity deposits at each period end. An annuity due deposits at each period beginning, giving each contribution one extra compounding period.',fa:'مستمری عادی در پایان هر دوره و مستمری پیش‌پرداخت در ابتدای آن واریز می‌شود؛ در حالت دوم هر واریز یک دوره بیشتر سود می‌گیرد.'},
    help_pricing_model:{en:'Compare the CAPM single-factor estimate with a three-factor APT illustration. Results depend on chosen betas, premiums, currency, and horizon; this is not a statistical estimation of factor risk premia.',fa:'برآورد تک‌عاملی CAPM را با نمونه سه‌عاملی APT مقایسه کنید. نتایج به بتا، صرف ریسک، ارز و افق وابسته‌اند؛ این محاسبه‌گر صرف ریسک عوامل را آماری برآورد نمی‌کند.'},
    help_pricing_rf:{en:'Risk-free return for the same currency and horizon as the modeled asset return. CAPM and APT both use it as the baseline return.',fa:'بازده بدون ریسک هم‌ارز با ارز و افق بازده دارایی. CAPM و APT هر دو آن را بازده مبنا می‌گیرند.'},
    help_pricing_market:{en:'Expected market portfolio return for CAPM. The market risk premium is market return minus the risk-free rate; do not enter the premium in this field.',fa:'بازده موردانتظار پرتفوی بازار برای CAPM. صرف ریسک بازار برابر بازده بازار منهای نرخ بدون ریسک است؛ در این فیلد خود بازده بازار را وارد کنید.'},
    help_pricing_beta:{en:'Sensitivity of the asset to market excess return in CAPM. A beta of one implies market-like systematic exposure; it does not capture all company-specific or tail risks.',fa:'حساسیت دارایی به بازده مازاد بازار در CAPM. بتای یک بیانگر مواجهه سیستماتیک مشابه بازار است و همه ریسک‌های خاص شرکت یا دنباله‌ای را نمی‌سنجد.'},
    help_apt_premium:{en:'Expected premium for the named factor above the risk-free rate, entered in percentage points. Define the factor portfolio and estimation window consistently before using the estimate.',fa:'صرف موردانتظار عامل مشخص‌شده بالاتر از نرخ بدون ریسک که به واحد درصد وارد می‌شود. پیش از استفاده، پرتفوی عامل و پنجره برآورد را دقیق تعریف کنید.'},
    help_apt_beta:{en:'Asset sensitivity to the corresponding APT factor return. Beta and factor premium must refer to the same factor definition, currency, and horizon.',fa:'حساسیت دارایی به بازده عامل متناظر APT. بتا و صرف ریسک باید به تعریف عامل، ارز و افق یکسان اشاره کنند.'},
    help_formula_library:{en:'Reference identities summarize common valuation and performance models. Definitions can vary by accounting adjustments, sample frequency, and market convention; check the accompanying notes before comparison.',fa:'روابط مرجع، مدل‌های متداول ارزش‌گذاری و عملکرد را خلاصه می‌کنند. تعریف‌ها با تعدیلات حسابداری، تناوب نمونه و عرف بازار تغییر می‌کنند؛ پیش از مقایسه یادداشت‌ها را بررسی کنید.'},
    portfolio_remove_asset:{en:'Remove asset',fa:'حذف دارایی'}
});

function tooltipKeyForControl(control) {
    const field = control.dataset.financialInput || control.dataset.companyField;
    if (field) {
        const aliases = {'accounts-payable-prior':'accounts_payable_prior','inventory-prior':'inventory_prior','accounts-receivable-prior':'accounts_receivable_prior'};
        return `help_fin_${aliases[field] || field.replace(/-/g,'_')}`;
    }
    if (control.dataset.dcf) {
        const suffix = control.dataset.dcf.split('-').at(-1);
        return `help_dcf_${suffix}`;
    }
    const portfolioMatch = control.id.match(/^asset-\d+-(name|return|stddev|weight)$/);
    if (portfolioMatch) return ({name:'help_portfolio_name',return:'help_portfolio_return',stddev:'help_portfolio_stddev',weight:'help_portfolio_weight'})[portfolioMatch[1]];
    if (/^corr-\d+-with-\d+$/.test(control.id)) return 'help_portfolio_correlation';
    if (control.id === 'company-restated') return 'help_company_restated';
    return tooltipControlIds[control.id] || 'help_field_general';
}

const tooltipSectionKeys = {
    'asset-analysis-tab':'help_section_asset_analysis','equity-valuation-tab':'help_section_equity_valuation','fixed-income-tab':'help_section_fixed_income','portfolio-management-tab':'help_section_portfolio_management','financial-strategy-tab':'help_section_financial_strategy','financial-models-tab':'help_tab_financial_models',
    'tvm-model':'help_tvm_target','asset-pricing-models':'help_pricing_model','advanced-formula-library':'help_formula_library',
    'asset-data-input-section':'help_section_asset_analysis','market-data-input-section':'help_section_asset_analysis','benchmark-data-input-section':'help_section_asset_analysis','company-comparison-workspace':'help_section_company_comparison',
    'analyst-dashboard':'help_section_analyst_dashboard','financial-quality-workspace':'help_section_quality','financial-workbook-workspace':'help_section_workbook','advanced-valuation-workspace':'help_section_dcf'
};
const tooltipHeadingKeys = {
    tab_asset_analysis:'help_section_asset_analysis',tab_equity_valuation:'help_section_equity_valuation',tab_fixed_income:'help_section_fixed_income',tab_portfolio_management:'help_section_portfolio_management',tab_financial_strategy:'help_section_financial_strategy',
    financial_strategy_title:'help_section_financial_strategy',analyst_dashboard_title:'help_section_analyst_dashboard',peer_workspace_title:'help_section_company_comparison',advanced_valuation_title:'help_section_dcf',quality_title:'help_section_quality',workbook_title:'help_section_workbook',calculated_metrics_title:'help_section_financial_strategy',metric_chart_title:'help_chart_group',quote_widget_title:'help_section_financial_strategy',models_title:'help_tab_financial_models',tvm_title:'help_tvm_target',pricing_title:'help_pricing_model',formula_title:'help_formula_library'
};

function makeTooltipIcon(key, title = '') {
    const icon = document.createElement('span');
    icon.className = 'tooltip-icon help-tooltip-icon'; icon.textContent = 'ⓘ';
    icon.dataset.tooltipKey = key; icon.dataset.tooltipTitle = title;
    icon.setAttribute('role','button'); icon.setAttribute('tabindex','0'); icon.setAttribute('aria-haspopup','dialog');
    icon.setAttribute('aria-label',_t('help_help_icon')); icon.title = _t(key);
    return icon;
}

function decorateResearchTooltips(root = document) {
    root.querySelectorAll('.tooltip-icon').forEach(icon => {
        if (!icon.getAttribute('role')) icon.setAttribute('role','button');
        if (!icon.hasAttribute('tabindex')) icon.setAttribute('tabindex','0');
        icon.setAttribute('aria-haspopup','dialog'); icon.setAttribute('aria-label',_t('help_help_icon'));
        if (icon.dataset.tooltipKey) icon.title = _t(icon.dataset.tooltipKey);
    });
    root.querySelectorAll('label').forEach(label => {
        if (label.classList.contains('language-control')) return;
        const control = label.control || label.querySelector('input:not([type="radio"]):not([type="file"]):not([type="hidden"]),select,textarea');
        if (!control) return;
        const key = tooltipKeyForControl(control);
        label.classList.add('tooltip-label-target'); label.title = _t(key);
        control.title = _t(key);
        let icon = label.querySelector('.tooltip-icon') || [...(label.parentElement?.querySelectorAll(':scope > .tooltip-icon') || [])][0];
        if (icon) { icon.dataset.tooltipKey = key; icon.dataset.tooltipTitle = control.labels?.[0]?.innerText?.trim() || control.id; icon.title = _t(key); icon.setAttribute('role','button'); icon.setAttribute('tabindex','0'); icon.setAttribute('aria-haspopup','dialog'); icon.setAttribute('aria-label',_t('help_help_icon')); }
        else { icon = makeTooltipIcon(key,control.labels?.[0]?.querySelector('[data-translate]')?.innerText?.trim() || control.labels?.[0]?.innerText?.trim() || control.id); label.append(icon); }
        if (control.type === 'checkbox') label.classList.add('tooltip-checkbox-target');
    });

    root.querySelectorAll('.tab-content h2, .tab-content h3, .quote-panel-head h3, .report-basis-heading h3, .dcf-driver-panel > summary').forEach(heading => {
        if (heading.parentElement?.classList.contains('tooltip-heading-line')) return;
        const section = heading.closest('section');
        const sectionKey = (section && tooltipSectionKeys[section.id]) || tooltipHeadingKeys[heading.dataset.translate] || tooltipHeadingKeys[heading.querySelector('[data-translate]')?.dataset.translate] || tooltipSectionKeys[heading.closest('.tab-content')?.id] || 'help_section_asset_analysis';
        if (heading.tagName === 'SUMMARY') { heading.append(makeTooltipIcon(sectionKey,heading.innerText.trim())); return; }
        const line = document.createElement('span'); line.className = 'tooltip-heading-line';
        heading.parentNode.insertBefore(line,heading); line.append(heading,makeTooltipIcon(sectionKey,heading.innerText.trim()));
    });
    root.querySelectorAll('.tooltip-heading-line').forEach(line => {
        const heading = line.querySelector('h2,h3,summary');
        const icon = line.querySelector('.tooltip-icon');
        if (heading && icon) icon.dataset.tooltipTitle = heading.innerText.trim();
    });

    root.querySelectorAll('.tab-button[data-tab]').forEach(button => {
        const key = ({'asset-analysis':'help_tab_asset','equity-valuation':'help_tab_equity','fixed-income':'help_tab_fixed_income','portfolio-management':'help_tab_portfolio','financial-strategy':'help_section_financial_strategy','financial-models':'help_tab_financial_models'})[button.dataset.tab];
        if (key) { button.dataset.tooltipKey = key; button.title = _t(key); }
    });
    root.querySelectorAll('.analyst-kpi').forEach((card,index) => {
        if (!card.querySelector('.tooltip-icon')) card.append(makeTooltipIcon(['help_analyst_roic','help_analyst_roe','help_analyst_cash','help_analyst_leverage'][index] || 'help_section_analyst_dashboard',card.querySelector('span')?.textContent.trim() || ''));
    });
    root.querySelectorAll('[data-help-key]').forEach(target => {
        if (!target.querySelector('.tooltip-icon')) target.append(makeTooltipIcon(target.dataset.helpKey,target.textContent.trim()));
    });
    root.querySelectorAll('.quality-check').forEach(card => {
        if (!card.querySelector('.tooltip-icon')) card.append(makeTooltipIcon('help_section_quality',card.querySelector('strong')?.textContent.trim() || ''));
    });
    root.querySelectorAll('.peer-insight-card').forEach(card => {
        if (!card.querySelector('.tooltip-icon')) card.append(makeTooltipIcon('help_section_company_comparison',card.querySelector('span')?.textContent.trim() || ''));
    });
    root.querySelectorAll('button:not(.tooltip-icon)').forEach(button => {
        const key = button.dataset.tooltipKey || (button.id === 'calculate-equity-button' ? 'help_section_equity_valuation' : button.id === 'calculate-bond-button' || button.id === 'plot-bond-price-yield-button' ? 'help_section_fixed_income' : button.id === 'calculate-portfolio-button' || button.id === 'add-portfolio-asset-button' ? 'help_section_portfolio_management' : button.id === 'calculate-financial-strategy' || button.id === 'run-dcf-button' ? 'help_section_financial_strategy' : button.id === 'fetch-tradingview-quote' ? 'help_quote_symbol' : 'help_button_action');
        button.dataset.tooltipKey = key;
        button.title = _t(key);
    });
    root.querySelectorAll('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]),select,textarea').forEach(control => {
        if (control.type === 'file' && getComputedStyle(control).display === 'none') return;
        if (control.labels?.length || control.closest('label')) return;
        const key = tooltipKeyForControl(control);
        control.title = _t(key);
        const marker = `data-tooltip-for-${control.id || 'anonymous'}`;
        const parent = control.parentElement;
        if (!parent || parent.querySelector(`[${marker}]`)) return;
        const icon = makeTooltipIcon(key,control.getAttribute('aria-label') || control.id);
        icon.setAttribute(marker,'');
        control.insertAdjacentElement('afterend',icon);
    });
}

function initializeSweetAlertTooltips() {
    const openTooltip = icon => {
        const key = icon?.getAttribute('data-tooltip-key');
        if (!key) return;
        const content = _t(key);
        if (!content || content === key) return;
        Swal.fire({title:icon.dataset.tooltipTitle || _t('info_title'),text:content,icon:'info',confirmButtonText:_t('ok_button'),customClass:{popup:'swal2-popup',title:'swal2-title',htmlContainer:'swal2-html-container',confirmButton:'swal2-confirm',closeButton:'swal2-close'},showCloseButton:true});
    };
    document.body.addEventListener('click',event=>{const icon=event.target.closest('.tooltip-icon');if(!icon)return;event.preventDefault();openTooltip(icon);});
    document.body.addEventListener('keydown',event=>{const icon=event.target.closest('.tooltip-icon');if(!icon||!['Enter',' '].includes(event.key))return;event.preventDefault();openTooltip(icon);});
}
function closeModal() { if (plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); } document.body.style.overflow = 'auto'; if (plotContainer) Plotly.purge(plotContainer); window.removeEventListener('keydown', escapeKeyHandler); if(plotModal) plotModal.removeEventListener('click', backdropClickHandler); }
function closeModalHandler() { closeModal(); }
function backdropClickHandler(event) { if (event.target === plotModal) closeModal(); }
function escapeKeyHandler(event) { if (event.key === 'Escape') closeModal(); }

// --- Tab Switching Logic ---
function syncFundamentalSidebar(tabId) {
    const menu = document.getElementById('fundamental-side-nav');
    if (!menu) return;
    const selectedTab = tabId || document.querySelector('.tab-button.active')?.dataset.tab;
    const visible = selectedTab === 'financial-strategy' && window.matchMedia('(min-width: 901px)').matches;
    menu.classList.toggle('is-visible', visible);
    menu.open = visible;
    if (visible) {
        const current = [...menu.querySelectorAll('a')].find(link => link.getAttribute('href') === window.location.hash);
        menu.querySelectorAll('a').forEach(link => {
            link.classList.toggle('active', link === current);
            if (link === current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
        });
    }
}
function switchTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    tabButtons.forEach(button => {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
    });

    document.getElementById(`${tabId}-tab`).classList.add('active');
    const selectedTab=document.querySelector(`[data-tab="${tabId}"]`);selectedTab.classList.add('active');selectedTab.setAttribute('aria-current','page');
    document.querySelector('.workspace-layout')?.classList.toggle('results-context-active',tabId==='asset-analysis');
    syncFundamentalSidebar(tabId);
    if(tabId==='financial-strategy'){requestAnimationFrame(()=>{if(financialMetrics)drawFinancialChart();drawCompanyTrendChart();});}
    if(selectedTab) selectedTab.scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

function calculateTimeValueModel() {
    const result = document.getElementById('tvm-result-value');
    const detail = document.getElementById('tvm-result-detail');
    const target = document.getElementById('tvm-target')?.value || 'fv';
    const read = id => { const input=document.getElementById(id); return input && input.value.trim()!=='' ? parseLocalizedNumber(input.value) : NaN; };
    const frequency = Number(document.getElementById('tvm-frequency')?.value || 1);
    const years = Number(document.getElementById('tvm-years')?.value);
    const annualRate = read('tvm-rate') / 100;
    const periodicRate = annualRate / frequency;
    const periods = years * frequency;
    const pv = read('tvm-pv'), payment = read('tvm-pmt'), fv = read('tvm-fv');
    const due = document.getElementById('tvm-timing')?.value === 'beginning';
    let answer = NaN, resultKey = '';
    const validFrequency = Number.isInteger(frequency) && frequency > 0;
    const annuityFactor = (rate,count) => Math.abs(rate) < 1e-12 ? count : ((1 + rate) ** count - 1) / rate;
    const valueAt = (rate,count) => pv * (1 + rate) ** count + payment * annuityFactor(rate,count) * (due ? 1 + rate : 1);
    if (validFrequency && target === 'n' && Number.isFinite(periodicRate) && periodicRate > -1 && [pv,payment,fv].every(Number.isFinite)) {
        const residual = count => valueAt(periodicRate,count) - fv;
        let low=0, high=1, lowValue=residual(low), highValue=residual(high);
        while (Math.sign(lowValue) === Math.sign(highValue) && high < 36500 && Number.isFinite(highValue)) { high=Math.min(36500,high*2); highValue=residual(high); }
        if (lowValue === 0) answer=0;
        else if (Math.sign(lowValue) !== Math.sign(highValue)) {
            for(let i=0;i<90;i++){const middle=(low+high)/2,middleValue=residual(middle);if(Math.abs(middleValue)<1e-10){low=high=middle;break;}if(Math.sign(middleValue)===Math.sign(lowValue)){low=middle;lowValue=middleValue;}else high=middle;}
            answer=(low+high)/2;
        }
        resultKey='tvm_result_detail_n';
    } else if (validFrequency && target === 'rate' && Number.isFinite(periods) && periods > 0 && periods <= 36500 && [pv,payment,fv].every(Number.isFinite)) {
        const residual = rate => valueAt(rate,periods) - fv;
        let low=-0.999999999, high=10, lowValue=residual(low), highValue=residual(high);
        if (lowValue === 0) answer=low;
        else if (highValue === 0) answer=high;
        else if (Math.sign(lowValue) !== Math.sign(highValue)) {
            for(let i=0;i<100;i++){const middle=(low+high)/2,middleValue=residual(middle);if(Math.abs(middleValue)<1e-10){low=high=middle;break;}if(Math.sign(middleValue)===Math.sign(lowValue)){low=middle;lowValue=middleValue;}else high=middle;}
            answer=(low+high)/2;
        }
        answer *= frequency * 100;
        resultKey='tvm_result_detail_rate';
    } else if (Number.isFinite(years) && years > 0 && years <= 100 && validFrequency && Number.isFinite(periodicRate) && periodicRate > -1 && Number.isFinite(periods) && periods <= 36500) {
        const growth=(1+periodicRate)**periods;
        const fvAnnuity=annuityFactor(periodicRate,periods);
        const pvAnnuity=Math.abs(periodicRate)<1e-12?periods:(1-1/growth)/periodicRate;
        const timingFactor=due?1+periodicRate:1;
        if(Number.isFinite(growth)&&Number.isFinite(fvAnnuity)&&Number.isFinite(pvAnnuity)) {
            if (target === 'fv' && Number.isFinite(pv) && Number.isFinite(payment)) { answer = pv * growth + payment * fvAnnuity * timingFactor; resultKey = 'tvm_result_detail_fv'; }
            if (target === 'pv' && Number.isFinite(fv) && Number.isFinite(payment) && growth > 0) { answer = fv / growth - payment * pvAnnuity * timingFactor; resultKey = 'tvm_result_detail_pv'; }
            if (target === 'pmt' && Number.isFinite(pv) && Number.isFinite(fv) && Math.abs(fvAnnuity * timingFactor) > 1e-12) { answer = (fv - pv * growth) / (fvAnnuity * timingFactor); resultKey = 'tvm_result_detail_pmt'; }
        }
    }
    const formatter = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', {maximumFractionDigits:2,minimumFractionDigits:0});
    const outputValue=answer;
    const suffix=target==='rate'?'%':target==='n'?_t('tvm_period_suffix'):'';
    if (result) result.textContent = Number.isFinite(outputValue) ? `${formatter.format(outputValue)}${suffix ? ` ${suffix}` : ''}` : '—';
    if (detail) detail.textContent = Number.isFinite(answer) ? _t(resultKey) : _t('tvm_invalid');
    const outputId={fv:'tvm-fv',pv:'tvm-pv',pmt:'tvm-pmt',n:'tvm-years',rate:'tvm-rate'}[target];
    const outputInput=outputId?document.getElementById(outputId):null;
    ['tvm-pv','tvm-pmt','tvm-fv','tvm-rate','tvm-years'].forEach(id => { const input=document.getElementById(id); if(input) input.disabled = input === outputInput; });
    return answer;
}

function calculateAssetPricingModels() {
    const read = id => { const input=document.getElementById(id); return input && input.value.trim()!=='' ? parseLocalizedNumber(input.value) : NaN; };
    const rf=read('pricing-rf'), market=read('pricing-market-return'), marketBeta=read('pricing-market-beta');
    const premiums=[1,2,3].map(i=>read(`apt-premium-${i}`));
    const betas=[1,2,3].map(i=>read(`apt-beta-${i}`));
    const capm=rf+marketBeta*(market-rf);
    const apt=rf+premiums.reduce((sum,premium,index)=>sum+betas[index]*premium,0);
    const valid=[rf,market,marketBeta,...premiums,...betas].every(Number.isFinite);
    const formatter = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', {maximumFractionDigits:2,minimumFractionDigits:2});
    const put=(id,value)=>{const output=document.getElementById(id);if(output)output.textContent=valid&&Number.isFinite(value)?`${formatter.format(value)}%`:'—';};
    put('capm-expected-result',capm); put('apt-expected-result',apt); put('pricing-spread-result',apt-capm);
    const status=document.getElementById('pricing-model-status'); if(status) status.textContent=valid?_t('pricing_ready'):_t('pricing_invalid');
    return valid ? {capm,apt,spread:apt-capm} : null;
}


// --- Financial Strategy Analysis ---
Object.assign(texts, {
    fundamental_nav_inputs:{en:'Financial inputs',fa:'ورودی‌های مالی'},
    financial_guidance_summary:{en:'Input and accounting guidance',fa:'راهنمای ورود داده و مبانی حسابداری'},
    financial_period_title:{en:'Reporting period & flow basis',fa:'دوره گزارش و مبنای نمایش جریان'},
    financial_group_fields:{en:'{count} inputs',fa:'{count} ورودی'},
    quote_optional_summary:{en:'Optional market quote',fa:'دریافت اختیاری داده بازار'},
    comparison_steps_summary:{en:'How to build a reliable peer set',fa:'روش ساخت گروه همتای قابل‌مقایسه'}
});
const financialInputGroups = [
    { title: 'Dividend and Return Strategy', fields: [
        ['shares-outstanding', 'Shares Outstanding'], ['net-income', 'Net Income'], ['dividends-paid', 'Total Dividends Paid'],
        ['current-share-price', 'Current Share Price'], ['initial-share-price', 'Initial Share Price'], ['shareholders-equity', "Shareholders’ Equity"]
    ] },
    { title: 'Capital Structure Strategy', fields: [
        ['total-liabilities', 'Total Liabilities'], ['total-assets-prior', 'Total Assets (Opening Balance)'], ['total-assets', 'Total Assets (Closing Balance)'], ['shareholders-equity-prior', 'Shareholders’ Equity (Opening Balance)'], ['interest-bearing-debt-prior', 'Interest-Bearing Debt (Opening Balance)'], ['interest-bearing-debt', 'Interest-Bearing Debt'], ['short-term-interest-bearing-debt', 'Short-Term Interest-Bearing Debt'], ['long-term-interest-bearing-debt', 'Long-Term Interest-Bearing Debt'], ['ebit', 'Earnings Before Interest and Taxes (EBIT)'], ['interest-expense', 'Interest Expense'], ['tax-rate', 'Effective Tax Rate (%)']
    ] },
    { title: 'Working Capital Strategy', fields: [
        ['current-assets', 'Current Assets'], ['current-liabilities', 'Current Liabilities'], ['cash-equivalents', 'Cash and Cash Equivalents'], ['cogs', 'Cost of Goods Sold (COGS)'],
        ['accounts-payable-prior', 'Accounts Payable (Opening Balance)'], ['accounts-payable', 'Accounts Payable (Closing Balance)'], ['inventory-prior', 'Inventory (Opening Balance)'], ['inventory', 'Inventory (Closing Balance)'], ['sales', 'Sales'], ['accounts-receivable-prior', 'Accounts Receivable (Opening Balance)'], ['accounts-receivable', 'Accounts Receivable (Closing Balance)']
    ] },
    { title: 'Investment Strategy', fields: [
        ['fixed-assets-prior', 'Fixed Assets (Prior Year)'], ['fixed-assets-current', 'Fixed Assets (Current Year)'], ['depreciation-current', 'Depreciation (Current Year)'], ['reported-capex', 'Reported Capital Expenditures (CapEx, enter positive spend)'], ['operating-cash-flow', 'Cash Flow from Operations']
    ] }
];
let financialMetrics = null;
const financialChartGroups = {
    'per-share': { title: 'Per-share values', unit: 'Currency per share', keys: ['eps', 'dps'] },
    profitability: { title: 'Profitability and margins', unit: 'Percent', keys: ['grossMargin', 'operatingMargin', 'netMargin', 'roe', 'roa', 'roic', 'dupontMargin', 'dupontRoe', 'dividendYield', 'dpr', 'debtRatio'] },
    valuation: { title: 'Equity and enterprise valuation', unit: 'Multiple', keys: ['pe', 'pb', 'ps', 'evEbitda', 'pfcf'] },
    efficiency: { title: 'Operating efficiency', unit: 'Turnover', keys: ['assetTurnover', 'inventoryTurnover', 'receivablesTurnover'] },
    'cash-flow': { title: 'Free cash flow', unit: 'Currency', keys: ['fcf'] },
    'cash-yield': { title: 'Free cash flow yield', unit: 'Percent', keys: ['fcfYield'] },
    'cash-quality': { title: 'Cash conversion ratios', unit: 'Ratio', keys: ['cfoNetIncome','cfoCapexCoverage'] },
    'cash-quality-percent': { title: 'Cash quality ratios (%)', unit: 'Percent', keys: ['accrualRatio','fcfMargin'] },
    returns: { title: 'Returns and percentage ratios', unit: 'Percent', keys: ['totalReturn', 'dividendYield', 'dpr'] },
    'capital-structure': { title: 'Capital structure and liquidity ratios', unit: 'Ratio', keys: ['de','liabilitiesEquity','equityMultiplier','interestCoverage','currentRatio','quickRatio','cashRatio'] },
    'debt-profile': { title: 'Debt profile values', unit: 'Currency', keys: ['netDebt','debtMixReconciliation'] },
    'debt-structure': { title: 'Debt structure ratios', unit: 'Percent', keys: ['shortDebtShare'] },
    'cash-cycle': { title: 'Cash conversion cycle', unit: 'Days', keys: ['dpo', 'dio', 'dso', 'ccc'] },
    'working-capital': { title: 'Working capital', unit: 'Currency', keys: ['workingCapital'] },
    investment: { title: 'Investment', unit: 'Currency', keys: ['capex'] }
};

const financialFa = {
    group: {
        'Dividend and Return Strategy': 'سود نقدی و بازده سهام', 'Capital Structure Strategy': 'ساختار سرمایه',
        'Working Capital Strategy': 'سرمایه در گردش', 'Investment Strategy': 'سرمایه‌گذاری',
        'Equity Valuation': 'ارزش‌گذاری سهام', 'Profitability': 'سودآوری', 'Operating Efficiency': 'کارایی عملیاتی', 'Cash Flow Analysis': 'تحلیل جریان نقد'
    },
    fields: {
        'shares-outstanding':'تعداد سهام منتشرشده', 'net-income':'سود خالص', 'dividends-paid':'کل سود نقدی پرداخت‌شده',
        'current-share-price':'قیمت فعلی سهم', 'initial-share-price':'قیمت اولیه سهم', 'shareholders-equity':'حقوق صاحبان سهام',
        'total-liabilities':'مجموع بدهی‌ها', 'total-assets-prior':'مجموع دارایی‌ها (مانده ابتدای دوره)', 'total-assets':'مجموع دارایی‌ها (مانده پایان دوره)', 'shareholders-equity-prior':'حقوق صاحبان سهام (مانده ابتدای دوره)', 'interest-bearing-debt-prior':'بدهی بهره‌دار (مانده ابتدای دوره)', 'interest-bearing-debt':'کل بدهی بهره‌دار', 'short-term-interest-bearing-debt':'بدهی بهره‌دار کوتاه‌مدت', 'long-term-interest-bearing-debt':'بدهی بهره‌دار بلندمدت', 'ebit':'سود قبل از بهره و مالیات (EBIT)', 'interest-expense':'هزینه بهره', 'tax-rate':'نرخ مؤثر مالیات (درصد)',
        'current-assets':'دارایی‌های جاری', 'current-liabilities':'بدهی‌های جاری', 'cash-equivalents':'وجه نقد و معادل‌های نقد', 'cogs':'بهای تمام‌شده کالای فروش‌رفته (COGS)', 'accounts-payable-prior':'حساب‌های پرداختنی (ابتدای دوره)', 'accounts-payable':'حساب‌های پرداختنی (پایان دوره)', 'inventory-prior':'موجودی کالا (ابتدای دوره)', 'inventory':'موجودی کالا (پایان دوره)', 'sales':'فروش', 'accounts-receivable-prior':'حساب‌های دریافتنی (ابتدای دوره)', 'accounts-receivable':'حساب‌های دریافتنی (پایان دوره)',
        'fixed-assets-prior':'دارایی ثابت پایان سال قبل', 'fixed-assets-current':'دارایی ثابت پایان سال جاری', 'depreciation-current':'استهلاک سال جاری', 'reported-capex':'مخارج سرمایه‌ای گزارش‌شده (CapEx؛ مبلغ پرداختی مثبت)', 'operating-cash-flow':'جریان نقد عملیاتی'
    },
    metric: {
        eps:'سود هر سهم (EPS)', dps:'سود نقدی هر سهم (DPS)', totalReturn:'بازده کل', roe:'بازده حقوق صاحبان سهام (ROE)', dividendYield:'بازده تقسیم سود', dpr:'نسبت تقسیم سود (DPR)',
        pe:'نسبت قیمت به سود (P/E)', pb:'نسبت قیمت به ارزش دفتری (P/B)', ps:'نسبت قیمت به فروش (P/S)', de:'نسبت بدهی بهره‌دار به حقوق صاحبان سهام (D/E)', liabilitiesEquity:'نسبت کل بدهی به حقوق صاحبان سهام (L/E)', netDebt:'بدهی خالص (ND)', shortDebtShare:'سهم بدهی کوتاه‌مدت', debtMixReconciliation:'تطبیق سررسید بدهی', debtRatio:'نسبت کل بدهی به دارایی', interestCoverage:'نسبت پوشش بهره', evEbitda:'ارزش بنگاه به EBITDA (EV/EBITDA)',
        grossMargin:'حاشیه سود ناخالص', operatingMargin:'حاشیه سود عملیاتی', netMargin:'حاشیه سود خالص', roa:'بازده دارایی‌ها (ROA)', roic:'بازده سرمایه به‌کارگرفته‌شده (ROIC)', dupontMargin:'حاشیه سود خالص DuPont', dupontTurnover:'گردش دارایی DuPont', equityMultiplier:'ضریب فزاینده حقوق صاحبان سهام', dupontRoe:'بازده حقوق صاحبان سهام DuPont', accrualRatio:'اقلام تعهدی به میانگین دارایی', fcfMargin:'حاشیه جریان نقد آزاد', cfoCapexCoverage:'پوشش مخارج سرمایه‌ای با CFO', assetTurnover:'گردش مجموع دارایی‌ها', inventoryTurnover:'گردش موجودی کالا', receivablesTurnover:'گردش حساب‌های دریافتنی',
        workingCapital:'سرمایه در گردش', currentRatio:'نسبت جاری', quickRatio:'نسبت آنی (سریع)', cashRatio:'نسبت وجه نقد', dpo:'دوره پرداخت بدهی (DPO)', dio:'دوره گردش موجودی (DIO)', dso:'دوره وصول مطالبات (DSO)', ccc:'چرخه تبدیل وجه نقد (CCC)', capex:'مخارج سرمایه‌ای سال جاری (CapEx)', fcf:'جریان نقد آزاد (FCF)', fcfYield:'بازده جریان نقد آزاد', pfcf:'نسبت قیمت به جریان نقد آزاد (P/FCF)', cfoNetIncome:'نسبت تبدیل سود به وجه نقد'
    },
    formula: {
        eps:'سود خالص ÷ تعداد سهام منتشرشده', dps:'سود نقدی پرداخت‌شده ÷ تعداد سهام منتشرشده', totalReturn:'(DPS + قیمت فعلی − قیمت اولیه) ÷ قیمت اولیه × ۱۰۰', roe:'سود خالص ÷ میانگین حقوق صاحبان سهام × ۱۰۰', dividendYield:'DPS ÷ قیمت فعلی سهم × ۱۰۰', dpr:'DPS ÷ EPS × ۱۰۰',
        pe:'قیمت فعلی سهم ÷ EPS', pb:'قیمت فعلی سهم ÷ ارزش دفتری هر سهم', ps:'ارزش بازار سهام ÷ فروش', de:'بدهی بهره‌دار ÷ حقوق صاحبان سهام', liabilitiesEquity:'مجموع بدهی‌ها ÷ حقوق صاحبان سهام', netDebt:'بدهی بهره‌دار − وجه نقد و معادل‌ها', shortDebtShare:'بدهی بهره‌دار کوتاه‌مدت ÷ کل بدهی بهره‌دار × ۱۰۰', debtMixReconciliation:'بدهی کوتاه‌مدت + بلندمدت − کل بدهی بهره‌دار', debtRatio:'مجموع بدهی‌ها ÷ مجموع دارایی‌ها × ۱۰۰', interestCoverage:'EBIT ÷ هزینه بهره', evEbitda:'(ارزش بازار + بدهی بهره‌دار − وجه نقد) ÷ (EBIT + استهلاک)',
        grossMargin:'(فروش − COGS) ÷ فروش × ۱۰۰', operatingMargin:'EBIT ÷ فروش × ۱۰۰', netMargin:'سود خالص ÷ فروش × ۱۰۰', roa:'سود خالص ÷ میانگین مجموع دارایی‌ها × ۱۰۰', roic:'NOPAT ÷ (میانگین بدهی بهره‌دار + میانگین حقوق صاحبان سهام) × ۱۰۰', dupontMargin:'سود خالص ÷ فروش × ۱۰۰', dupontTurnover:'فروش ÷ میانگین دارایی‌ها', equityMultiplier:'میانگین دارایی‌ها ÷ میانگین حقوق صاحبان سهام', dupontRoe:'حاشیه سود × گردش دارایی × ضریب حقوق صاحبان سهام', accrualRatio:'(سود خالص − CFO) ÷ میانگین دارایی × ۱۰۰', fcfMargin:'FCF ÷ فروش × ۱۰۰', cfoCapexCoverage:'جریان نقد عملیاتی ÷ CapEx', assetTurnover:'فروش ÷ میانگین مجموع دارایی‌ها', inventoryTurnover:'COGS ÷ میانگین موجودی کالا', receivablesTurnover:'فروش ÷ میانگین حساب‌های دریافتنی',
        workingCapital:'دارایی‌های جاری − بدهی‌های جاری', currentRatio:'دارایی‌های جاری ÷ بدهی‌های جاری', quickRatio:'(دارایی‌های جاری − موجودی کالا) ÷ بدهی‌های جاری', cashRatio:'وجه نقد و معادل‌ها ÷ بدهی‌های جاری', dpo:'میانگین حساب‌های پرداختنی ÷ COGS × ۳۶۵', dio:'میانگین موجودی کالا ÷ COGS × ۳۶۵', dso:'میانگین حساب‌های دریافتنی ÷ فروش × ۳۶۵', ccc:'DSO + DIO − DPO', capex:'دارایی ثابت جاری − دارایی ثابت سال قبل + استهلاک جاری', fcf:'جریان نقد عملیاتی − CapEx', fcfYield:'FCF ÷ ارزش بازار سهام × ۱۰۰', pfcf:'ارزش بازار سهام ÷ جریان نقد آزاد', cfoNetIncome:'جریان نقد عملیاتی ÷ سود خالص'
    },
    charts: {
        'Per-share values':'ارزش‌های هر سهم', 'Returns and percentage ratios':'بازده و نسبت‌های درصدی', 'Capital structure and liquidity ratios':'نسبت‌های سرمایه و نقدینگی', 'Debt profile values':'مقادیر ساختار بدهی', 'Debt structure ratios':'نسبت‌های ساختار بدهی', 'Cash conversion cycle':'چرخه تبدیل وجه نقد', 'Working capital':'سرمایه در گردش', 'Investment':'سرمایه‌گذاری', 'Profitability and margins':'سودآوری و حاشیه سود', 'Equity and enterprise valuation':'ضرایب ارزش‌گذاری سهام و بنگاه', 'Operating efficiency':'کارایی عملیاتی', 'Free cash flow':'جریان نقد آزاد', 'Free cash flow yield':'بازده جریان نقد آزاد', 'Cash conversion of earnings':'تبدیل سود به وجه نقد', 'Cash conversion ratios':'نسبت‌های تبدیل وجه نقد', 'Cash quality ratios (%)':'نسبت‌های کیفیت سود (درصد)'
    },
    units: { 'Currency per share':'واحد پول به‌ازای هر سهم', Percent:'درصد', Ratio:'برابر', Multiple:'برابر', Turnover:'دفعات گردش', Days:'روز', Currency:'واحد پول', 'Cash flow measure':'شاخص جریان نقد' }
};

let lastTradingViewQuote = null;

function formatQuoteValue(value, key = '') {
    if (typeof value === 'number' && Number.isFinite(value)) return new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', { maximumFractionDigits: 2, notation: key === 'quote_field_market_cap' || key === 'quote_field_volume' ? 'compact' : 'standard' }).format(value);
    if (value === null || value === undefined || value === '') return _t('quote_fallback');
    return String(value);
}

function renderTradingViewQuote(quote, symbol) {
    const host = document.getElementById('tradingview-quote-snapshot');
    if (!host) return;
    const rows = [
        ['quote_field_price', quote.lp], ['quote_field_change', quote.chp === undefined ? undefined : `${formatQuoteValue(quote.chp)}%`],
        ['quote_field_volume', quote.volume], ['quote_field_market_cap', quote.market_cap_basic],
        ['quote_field_ttm_eps', quote.earnings_per_share_basic_ttm ?? quote.basic_eps_net_income],
        ['quote_field_pe', quote.price_earnings_ttm], ['quote_field_dividend_yield', quote.dividends_yield], ['quote_field_beta', quote.beta_1_year],
        ['quote_field_sector', quote.sector], ['quote_field_industry', quote.industry], ['quote_field_currency', quote.currency_code]
    ];
    host.replaceChildren();
    for (const [key, rawValue] of rows) {
        if (rawValue === undefined || rawValue === null || rawValue === '') continue;
        const card = document.createElement('div'); card.className = 'quote-snapshot-card';
        const label = document.createElement('span'); label.className = 'quote-snapshot-label'; label.textContent = _t(key);
        const value = document.createElement('strong'); value.className = 'quote-snapshot-value';
        value.textContent = typeof rawValue === 'number' ? formatQuoteValue(rawValue, key) + (key === 'quote_field_change' || key === 'quote_field_dividend_yield' ? '%' : '') : String(rawValue);
        card.append(label, value); host.appendChild(card);
    }
    const source = document.createElement('div'); source.className = 'quote-source-note'; source.textContent = _t('quote_source_note'); host.appendChild(source);
    host.classList.remove('hidden');
    const status = document.getElementById('tradingview-quote-status');
    if (status) status.textContent = _t('quote_success', { symbol: quote.description || quote.short_name || symbol });
    const applyButton = document.getElementById('apply-tradingview-price');
    if (applyButton) applyButton.classList.toggle('hidden', !Number.isFinite(quote.lp));
}

async function fetchTradingViewQuote() {
    const symbolInput = document.getElementById('tradingview-symbol');
    const status = document.getElementById('tradingview-quote-status');
    const button = document.getElementById('fetch-tradingview-quote');
    const snapshot = document.getElementById('tradingview-quote-snapshot');
    const symbol = symbolInput?.value.trim();
    if (!symbol) { if (status) status.textContent = _t('quote_missing_symbol'); return; }
    if (!/^[A-Za-z0-9._!/-]+:[A-Za-z0-9._!/-]+$/.test(symbol)) { if (status) status.textContent = _t('quote_missing_symbol'); return; }
    if (status) status.textContent = _t('quote_fetching');
    if (button) button.disabled = true;
    try {
        const market = /^(NASDAQ|NYSE|AMEX|NYSEARCA|BATS):/i.test(symbol) ? 'america' : 'global';
        const columns = ['name','close','change','change_abs','volume','currency','market_cap_basic','earnings_per_share_basic_ttm','price_earnings_ttm','dividends_yield','beta_1_year','sector','industry'];
        const response = await fetch(`https://scanner.tradingview.com/${market}/scan`, {
            method: 'POST', headers: {'Content-Type':'text/plain;charset=UTF-8'},
            body: JSON.stringify({symbols:{tickers:[symbol]},columns,range:[0,1]}),
            signal: AbortSignal.timeout(20000)
        });
        const body = await response.json();
        const row = body.data?.[0];
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!row || !Array.isArray(row.d) || row.d.length !== columns.length) throw new Error(_t('quote_no_data'));
        const values = Object.fromEntries(columns.map((column,index) => [column,row.d[index]]));
        const quote = {
            lp:values.close, ch:values.change_abs, chp:values.change, volume:values.volume, currency_code:values.currency,
            description:values.name, short_name:values.name, market_cap_basic:values.market_cap_basic,
            earnings_per_share_basic_ttm:values.earnings_per_share_basic_ttm, price_earnings_ttm:values.price_earnings_ttm,
            dividends_yield:values.dividends_yield, beta_1_year:values.beta_1_year, sector:values.sector, industry:values.industry
        };
        lastTradingViewQuote = quote;
        renderTradingViewQuote(quote, row.s || symbol);
    } catch (error) {
        if (status) status.textContent = _t('quote_error', { error: error.name === 'TimeoutError' ? (currentLang === 'fa' ? 'مهلت درخواست پایان یافت' : 'Request timed out') : error.message });
        if (snapshot) snapshot.classList.add('hidden');
        const applyButton = document.getElementById('apply-tradingview-price');
        if (applyButton) applyButton.classList.add('hidden');
    } finally { if (button) button.disabled = false; }
}

function applyTradingViewPrice() {
    const priceField = document.getElementById('financial-current-share-price');
    if (!priceField || !lastTradingViewQuote || !Number.isFinite(lastTradingViewQuote.lp)) return;
    priceField.value = String(lastTradingViewQuote.lp);
    priceField.dispatchEvent(new Event('input', { bubbles: true }));
    updateStatus('quote_price_applied', {}, 'success');
}

function renderFinancialInputs() {
    const host = document.getElementById('financial-input-groups');
    if (!host) return;
    const previousValues = Object.fromEntries([...host.querySelectorAll('[data-financial-input]')].map(input => [input.dataset.financialInput, input.value]));
    const previouslyRendered = host.querySelectorAll('details[data-financial-group]').length > 0;
    const openGroups = new Set([...host.querySelectorAll('details[data-financial-group][open]')].map(group => group.dataset.financialGroup));
    host.innerHTML = financialInputGroups.map((group,index) => `
        <details class="financial-input-group" data-financial-group="${group.title}" ${(openGroups.has(group.title) || (!previouslyRendered && index === 0)) ? 'open' : ''}>
            <summary><span>${currentLang === 'fa' ? financialFa.group[group.title] || group.title : group.title}</span><small>${_t('financial_group_fields',{count:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(group.fields.length)})}</small></summary>
            <div class="financial-input-fields">
                ${group.fields.map(([id, label]) => `<label for="financial-${id}" class="text-sm">${currentLang === 'fa' ? financialFa.fields[id] || label : label}
                    <input type="text" inputmode="decimal" id="financial-${id}" data-financial-input="${id}" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${currentLang === 'fa' ? 'مقدار را وارد کنید' : 'Enter value'}">
                </label>`).join('')}
            </div>
        </details>`).join('');
    host.querySelectorAll('[data-financial-input]').forEach(input => { if (previousValues[input.dataset.financialInput] !== undefined) input.value = previousValues[input.dataset.financialInput]; });
    host.querySelectorAll('[data-financial-input]').forEach(input => input.addEventListener('input', () => {
        financialMetrics = null;
        const resultHost = document.getElementById('financial-results');
        if (resultHost) resultHost.innerHTML = `<p class="text-dark-text-muted">${currentLang === 'fa' ? 'مقادیر تغییر کرده‌اند؛ برای به‌روزرسانی نتایج دوباره محاسبه کنید.' : 'Values changed. Calculate again to refresh the results.'}</p>`;
        const chart = document.getElementById('financial-chart');
        if (chart && window.Plotly) Plotly.purge(chart);
        const quality=document.getElementById('financial-quality-checks');if(quality)quality.innerHTML=`<p class="text-dark-text-muted">${currentLang==='fa'?'ورودی‌ها تغییر کرده‌اند؛ برای تازه‌سازی کنترل‌ها دوباره محاسبه کنید.':'Inputs changed; calculate again to refresh diagnostics.'}</p>`;
        const dcf=document.getElementById('dcf-results');if(dcf)dcf.innerHTML=`<p class="text-dark-text-muted">${currentLang==='fa'?'ورودی‌ها تغییر کرده‌اند؛ محاسبه DCF را دوباره اجرا کنید.':'Inputs changed; rerun the DCF scenarios.'}</p>`;
        const analyst=document.getElementById('analyst-review-notes');if(analyst)analyst.innerHTML=`<p>${_t('analyst_stale')}</p>`;
        const analystStatus=document.getElementById('analyst-data-status');if(analystStatus)analystStatus.textContent=_t('analyst_stale');
        const sensitivity=document.getElementById('dcf-sensitivity');if(sensitivity)sensitivity.replaceChildren();
        const dcfChart=document.getElementById('dcf-chart');if(dcfChart&&window.Plotly)Plotly.purge(dcfChart);
    }));
}

function invalidateDcfResults() {
    const result=document.getElementById('dcf-results');if(result)result.innerHTML=`<p class="text-dark-text-muted">${_t('dcf_stale')}</p>`;
    const sensitivity=document.getElementById('dcf-sensitivity');if(sensitivity)sensitivity.replaceChildren();
    const chart=document.getElementById('dcf-chart');if(chart&&window.Plotly)Plotly.purge(chart);
}

function calculateFinancialMetrics(get, periodMonths = 12, flowBasis = 'annualized') {
    const div = (numerator, denominator, scale = 1) => Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0 ? numerator / denominator * scale : NaN;
    const annualize = flowBasis === 'reported' ? 1 : Number.isFinite(periodMonths) && periodMonths > 0 ? 12 / periodMonths : 1;
    const flow = id => { const value = get(id); return Number.isFinite(value) ? value * annualize : NaN; };
    const shares = get('shares-outstanding');
    const netIncome = flow('net-income');
    const dividends = flow('dividends-paid');
    const periodDps = div(get('dividends-paid'), shares);
    const currentPrice = get('current-share-price');
    const initialPrice = get('initial-share-price');
    const eps = div(netIncome, shares);
    const dps = div(dividends, shares);
    const average = (opening, closing) => Number.isFinite(opening) && Number.isFinite(closing) ? (opening + closing) / 2 : NaN;
    const avgReceivables = average(get('accounts-receivable-prior'), get('accounts-receivable'));
    const avgInventory = average(get('inventory-prior'), get('inventory'));
    const avgPayables = average(get('accounts-payable-prior'), get('accounts-payable'));
    const avgAssets = average(get('total-assets-prior'), get('total-assets'));
    const avgEquity = average(get('shareholders-equity-prior'), get('shareholders-equity'));
    const dso = div(avgReceivables, flow('sales'), 365);
    const dio = div(avgInventory, flow('cogs'), 365);
    const dpo = div(avgPayables, flow('cogs'), 365);
    const capexEstimate = Number.isFinite(get('fixed-assets-current')) && Number.isFinite(get('fixed-assets-prior')) && Number.isFinite(get('depreciation-current')) ? (get('fixed-assets-current') - get('fixed-assets-prior')) * annualize + flow('depreciation-current') : NaN;
    const capexReported = Number.isFinite(flow('reported-capex'))?Math.abs(flow('reported-capex')):NaN;
    const capex = Number.isFinite(capexReported) ? capexReported : Number.isFinite(capexEstimate)&&capexEstimate>=0 ? capexEstimate : NaN;
    const equity = get('shareholders-equity');
    const avgDebt = average(get('interest-bearing-debt-prior'), get('interest-bearing-debt'));
    const debtMixTotal = get('short-term-interest-bearing-debt') + get('long-term-interest-bearing-debt');
    const avgInvestedCapital = Number.isFinite(avgDebt) && Number.isFinite(avgEquity) ? avgDebt + avgEquity : NaN;
    const taxRateRaw = get('tax-rate');
    const taxRate = Number.isFinite(taxRateRaw) && taxRateRaw>=0 && taxRateRaw<=100 ? taxRateRaw / 100 : NaN;
    const nopat = Number.isFinite(taxRate)?flow('ebit') * (1 - taxRate):NaN;
    const dupontMargin = div(netIncome, flow('sales'), 100);
    const dupontTurnover = div(flow('sales'), avgAssets);
    const equityMultiplier = div(avgAssets, avgEquity);
    const accrualRatio = div(netIncome - flow('operating-cash-flow'), avgAssets, 100);
    const specs = [
        { key: 'eps', group: 'Dividend and Return Strategy', label: 'Earnings Per Share (EPS)', formula: 'Net income ÷ shares outstanding', value: eps, unit: 'per share', chartGroup: 'per-share' },
        { key: 'dps', group: 'Dividend and Return Strategy', label: 'Dividends Per Share (DPS)', formula: 'Dividends paid ÷ shares outstanding', value: dps, unit: 'per share', chartGroup: 'per-share' },
        { key: 'totalReturn', group: 'Dividend and Return Strategy', label: 'Total Return', formula: '(DPS + current price − initial price) ÷ initial price × 100', value: div(Number.isFinite(periodDps) && Number.isFinite(currentPrice) && Number.isFinite(initialPrice) ? periodDps + currentPrice - initialPrice : NaN, initialPrice, 100), unit: '%', chartGroup: 'returns' },
        { key: 'roe', group: 'Dividend and Return Strategy', label: 'Return on Equity (ROE)', formula: 'Net income ÷ average shareholders’ equity × 100', value: div(netIncome, avgEquity, 100), unit: '%', chartGroup: 'returns' },
        { key: 'dividendYield', group: 'Dividend and Return Strategy', label: 'Dividend Yield', formula: 'DPS ÷ current share price × 100', value: div(dps, currentPrice, 100), unit: '%', chartGroup: 'returns' },
        { key: 'dpr', group: 'Dividend and Return Strategy', label: 'Dividend Payout Ratio (DPR)', formula: 'DPS ÷ EPS × 100', value: div(dps, eps, 100), unit: '%', chartGroup: 'profitability' },
        { key: 'pe', group: 'Equity Valuation', label: 'Price-to-Earnings (P/E)', formula: 'Current share price ÷ EPS', value: Number.isFinite(eps) && eps > 0 ? div(currentPrice, eps) : NaN, unit: '×', chartGroup: 'valuation' },
        { key: 'pb', group: 'Equity Valuation', label: 'Price-to-Book (P/B)', formula: 'Current share price ÷ book value per share', value: Number.isFinite(get('shareholders-equity')) && get('shareholders-equity') > 0 && shares > 0 ? div(currentPrice, div(get('shareholders-equity'), shares)) : NaN, unit: '×', chartGroup: 'valuation' },
        { key: 'ps', group: 'Equity Valuation', label: 'Price-to-Sales (P/S)', formula: 'Market capitalization ÷ sales', value: Number.isFinite(flow('sales')) && flow('sales') > 0 && shares > 0 && currentPrice > 0 ? div(currentPrice * shares, flow('sales')) : NaN, unit: '×', chartGroup: 'valuation' },
        { key: 'de', group: 'Capital Structure Strategy', label: 'Debt-to-Equity (D/E)', formula: 'Interest-bearing debt ÷ shareholders’ equity', value: div(get('interest-bearing-debt'), equity), unit: '×', chartGroup: 'capital-structure' },
        { key: 'liabilitiesEquity', group: 'Capital Structure Strategy', label: 'Liabilities-to-Equity (L/E)', formula: 'Total liabilities ÷ shareholders’ equity', value: div(get('total-liabilities'), equity), unit: '×', chartGroup: 'capital-structure' },
        { key: 'netDebt', group: 'Capital Structure Strategy', label: 'Net Debt', formula: 'Interest-bearing debt − cash and equivalents', value: Number.isFinite(get('interest-bearing-debt')) && Number.isFinite(get('cash-equivalents')) ? get('interest-bearing-debt') - get('cash-equivalents') : NaN, unit: 'currency', chartGroup: 'debt-profile' },
        { key: 'shortDebtShare', group: 'Capital Structure Strategy', label: 'Short-Term Debt Share', formula: 'Short-term interest-bearing debt ÷ total interest-bearing debt × 100', value: div(get('short-term-interest-bearing-debt'),get('interest-bearing-debt'),100), unit: '%', chartGroup: 'debt-structure' },
        { key: 'debtMixReconciliation', group: 'Capital Structure Strategy', label: 'Debt Maturity Reconciliation', formula: '(Short-term + long-term debt) − total interest-bearing debt', value: Number.isFinite(debtMixTotal)&&Number.isFinite(get('interest-bearing-debt'))?debtMixTotal-get('interest-bearing-debt'):NaN, unit: 'currency', chartGroup: 'debt-profile' },
        { key: 'debtRatio', group: 'Capital Structure Strategy', label: 'Debt Ratio', formula: 'Total liabilities ÷ total assets × 100', value: div(get('total-liabilities'), get('total-assets'), 100), unit: '%', chartGroup: 'profitability' },
        { key: 'interestCoverage', group: 'Capital Structure Strategy', label: 'Interest Coverage', formula: 'EBIT ÷ interest expense', value: div(flow('ebit'), flow('interest-expense')), unit: '×', chartGroup: 'capital-structure' },
        { key: 'evEbitda', group: 'Equity Valuation', label: 'EV / EBITDA', formula: '(Market cap + interest-bearing debt − cash) ÷ (EBIT + depreciation)', value: Number.isFinite(flow('ebit')) && Number.isFinite(flow('depreciation-current')) && flow('ebit') + flow('depreciation-current') > 0 && shares > 0 && currentPrice > 0 ? div(currentPrice * shares + get('interest-bearing-debt') - get('cash-equivalents'), flow('ebit') + flow('depreciation-current')) : NaN, unit: '×', chartGroup: 'valuation' },
        { key: 'grossMargin', group: 'Profitability', label: 'Gross Margin', formula: '(Sales − COGS) ÷ sales × 100', value: div(flow('sales') - flow('cogs'), flow('sales'), 100), unit: '%', chartGroup: 'profitability' },
        { key: 'operatingMargin', group: 'Profitability', label: 'Operating Margin', formula: 'EBIT ÷ sales × 100', value: div(flow('ebit'), flow('sales'), 100), unit: '%', chartGroup: 'profitability' },
        { key: 'netMargin', group: 'Profitability', label: 'Net Profit Margin', formula: 'Net income ÷ sales × 100', value: div(netIncome, flow('sales'), 100), unit: '%', chartGroup: 'profitability' },
        { key: 'roa', group: 'Profitability', label: 'Return on Assets (ROA)', formula: 'Net income ÷ average total assets × 100', value: div(netIncome, avgAssets, 100), unit: '%', chartGroup: 'profitability' },
        { key: 'roic', group: 'Profitability', label: 'Return on Invested Capital (ROIC)', formula: 'NOPAT ÷ (average interest-bearing debt + average shareholders’ equity) × 100', value: div(nopat, avgInvestedCapital, 100), unit: '%', chartGroup: 'profitability' },
        { key: 'dupontMargin', group: 'Profitability', label: 'DuPont Net Margin', formula: 'Net income ÷ sales × 100', value: dupontMargin, unit: '%', chartGroup: 'profitability' },
        { key: 'dupontTurnover', group: 'Profitability', label: 'DuPont Asset Turnover', formula: 'Sales ÷ average assets', value: dupontTurnover, unit: '×', chartGroup: 'efficiency' },
        { key: 'equityMultiplier', group: 'Profitability', label: 'DuPont Equity Multiplier', formula: 'Average assets ÷ average equity', value: equityMultiplier, unit: '×', chartGroup: 'capital-structure' },
        { key: 'dupontRoe', group: 'Profitability', label: 'DuPont ROE', formula: 'Net margin × asset turnover × equity multiplier', value: Number.isFinite(dupontMargin) && Number.isFinite(dupontTurnover) && Number.isFinite(equityMultiplier) ? dupontMargin * dupontTurnover * equityMultiplier : NaN, unit: '%', chartGroup: 'profitability' },
        { key: 'assetTurnover', group: 'Operating Efficiency', label: 'Total Asset Turnover', formula: 'Sales ÷ average total assets', value: div(flow('sales'), avgAssets), unit: '×', chartGroup: 'efficiency' },
        { key: 'inventoryTurnover', group: 'Operating Efficiency', label: 'Inventory Turnover', formula: 'COGS ÷ average inventory', value: div(flow('cogs'), avgInventory), unit: '×', chartGroup: 'efficiency' },
        { key: 'receivablesTurnover', group: 'Operating Efficiency', label: 'Receivables Turnover', formula: 'Sales ÷ average accounts receivable', value: div(flow('sales'), avgReceivables), unit: '×', chartGroup: 'efficiency' },
        { key: 'workingCapital', group: 'Working Capital Strategy', label: 'Working Capital', formula: 'Current assets − current liabilities', value: Number.isFinite(get('current-assets')) && Number.isFinite(get('current-liabilities')) ? get('current-assets') - get('current-liabilities') : NaN, unit: 'currency', chartGroup: 'working-capital' },
        { key: 'currentRatio', group: 'Working Capital Strategy', label: 'Current Ratio', formula: 'Current assets ÷ current liabilities', value: div(get('current-assets'), get('current-liabilities')), unit: '×', chartGroup: 'capital-structure' },
        { key: 'quickRatio', group: 'Working Capital Strategy', label: 'Quick Ratio', formula: '(Current assets − inventory) ÷ current liabilities', value: div(get('current-assets') - get('inventory'), get('current-liabilities')), unit: '×', chartGroup: 'capital-structure' },
        { key: 'cashRatio', group: 'Working Capital Strategy', label: 'Cash Ratio', formula: 'Cash and equivalents ÷ current liabilities', value: div(get('cash-equivalents'), get('current-liabilities')), unit: '×', chartGroup: 'capital-structure' },
        { key: 'dpo', group: 'Working Capital Strategy', label: 'Days Payable Outstanding (DPO)', formula: 'Average accounts payable ÷ COGS × 365', value: dpo, unit: 'days', chartGroup: 'cash-cycle' },
        { key: 'dio', group: 'Working Capital Strategy', label: 'Days Inventory Outstanding (DIO)', formula: 'Average inventory ÷ COGS × 365', value: dio, unit: 'days', chartGroup: 'cash-cycle' },
        { key: 'dso', group: 'Working Capital Strategy', label: 'Days Sales Outstanding (DSO)', formula: 'Average accounts receivable ÷ sales × 365', value: dso, unit: 'days', chartGroup: 'cash-cycle' },
        { key: 'ccc', group: 'Working Capital Strategy', label: 'Cash Conversion Cycle (CCC)', formula: 'DSO + DIO − DPO', value: Number.isFinite(dso) && Number.isFinite(dio) && Number.isFinite(dpo) ? dso + dio - dpo : NaN, unit: 'days', chartGroup: 'cash-cycle' },
        { key: 'capex', group: 'Investment Strategy', label: 'Current-Year Investment (CapEx)', formula: Number.isFinite(capexReported) ? 'Reported capital expenditure (cash flow statement)' : 'Estimated: closing fixed assets − opening fixed assets + depreciation', value: capex, unit: 'currency', chartGroup: 'investment' },
        { key: 'fcf', group: 'Cash Flow Analysis', label: 'Free Cash Flow (FCF)', formula: 'Cash flow from operations − reported CapEx (or estimated CapEx)', value: Number.isFinite(flow('operating-cash-flow')) && Number.isFinite(capex) ? flow('operating-cash-flow') - capex : NaN, unit: 'currency', chartGroup: 'cash-flow' },
        { key: 'fcfYield', group: 'Cash Flow Analysis', label: 'Free Cash Flow Yield', formula: 'FCF ÷ market capitalization × 100', value: div(Number.isFinite(flow('operating-cash-flow')) && Number.isFinite(capex) ? flow('operating-cash-flow') - capex : NaN, currentPrice * shares, 100), unit: '%', chartGroup: 'cash-yield' },
        { key: 'pfcf', group: 'Equity Valuation', label: 'Price-to-Free-Cash-Flow (P/FCF)', formula: 'Market capitalization ÷ free cash flow', value: div(currentPrice * shares, Number.isFinite(flow('operating-cash-flow')) && Number.isFinite(capex) ? flow('operating-cash-flow') - capex : NaN), unit: '×', chartGroup: 'valuation' },
        { key: 'accrualRatio', group: 'Cash Flow Analysis', label: 'Accruals to Average Assets', formula: '(Net income − CFO) ÷ average assets × 100', value: accrualRatio, unit: '%', chartGroup: 'cash-quality-percent' },
        { key: 'fcfMargin', group: 'Cash Flow Analysis', label: 'Free Cash Flow Margin', formula: 'FCF ÷ sales × 100', value: div(flow('operating-cash-flow') - capex, flow('sales'), 100), unit: '%', chartGroup: 'cash-quality-percent' },
        { key: 'cfoCapexCoverage', group: 'Cash Flow Analysis', label: 'CFO / CapEx', formula: 'Cash flow from operations ÷ CapEx', value: div(flow('operating-cash-flow'), capex), unit: '×', chartGroup: 'cash-quality' },
        { key: 'cfoNetIncome', group: 'Cash Flow Analysis', label: 'Cash Conversion of Earnings', formula: 'Cash flow from operations ÷ net income', value: div(flow('operating-cash-flow'), netIncome), unit: '×', chartGroup: 'cash-quality' }
    ];
    return specs;
}

function calculateFinancialStrategyMetrics() {
    const get = id => {
        const field = document.getElementById(`financial-${id}`);
        if (!field || field.value.trim() === '') return NaN;
        const value = parseLocalizedNumber(field.value);
        return Number.isFinite(value) ? value : NaN;
    };
    const rawMonths = Number(document.getElementById('financial-period-months')?.value || 12);
    const months = Number.isInteger(rawMonths) && rawMonths >= 1 && rawMonths <= 60 ? rawMonths : 12;
    financialMetrics = calculateFinancialMetrics(get, months, document.getElementById('financial-flow-basis')?.value || 'annualized');
    renderFinancialResults();
    renderFinancialQualityChecks(get, months);
    drawFinancialChart();
    renderAnalystDashboard(get);
    updateStatus('status_financial_calculated', {}, 'success');
}

function renderAnalystDashboard(get) {
    const metrics=financialMetrics||[],value=key=>metrics.find(metric=>metric.key===key)?.value??NaN;
    const number=n=>Number.isFinite(n)?new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2}).format(n):_t('analyst_missing');
    const quality=[...document.querySelectorAll('#financial-quality-checks .quality-check')];
    const flagged=quality.filter(card=>card.classList.contains('warn')||card.classList.contains('missing')).length;
    const wc=document.getElementById('analyst-data-status');if(wc)wc.textContent=currentLang==='fa'?`${quality.length-flagged} کنترل بدون هشدار · ${flagged} مورد برای بررسی`:`${quality.length-flagged} checks clear · ${flagged} review items`;
    let rawWacc=parseLocalizedNumber(document.querySelector('[data-dcf="base-wacc"]')?.value||'');
    if(document.getElementById('dcf-use-derived-wacc')?.checked){const pct=id=>{const n=parseLocalizedNumber(document.getElementById(id)?.value||'');return Number.isFinite(n)?n/100:NaN;};const taxInput=parseLocalizedNumber(document.getElementById('dcf-tax')?.value||''),tax=Number.isFinite(taxInput)?taxInput/100:get('tax-rate')/100,rf=pct('dcf-risk-free'),erp=pct('dcf-erp'),costDebt=pct('dcf-cost-debt'),costPreferred=pct('dcf-preferred-cost'),beta=parseLocalizedNumber(document.getElementById('dcf-beta')?.value||''),equity=get('current-share-price')*get('shares-outstanding'),debt=get('interest-bearing-debt'),preferred=Number(document.getElementById('dcf-preferred-claim')?.value||0),capital=equity+debt+preferred,coe=rf+beta*erp;rawWacc=Number.isFinite(tax)&&Number.isFinite(coe)&&Number.isFinite(costDebt)&&capital>0&&debt>=0&&preferred>=0&&(preferred===0||Number.isFinite(costPreferred))?(coe*equity+costDebt*(1-tax)*debt+(preferred>0?costPreferred*preferred:0))/capital:NaN;}
    const roic=value('roic'),roe=value('dupontRoe'),margin=value('dupontMargin'),turnover=value('dupontTurnover'),multiplier=value('equityMultiplier'),cfoNetIncome=value('cfoNetIncome'),fcf=value('fcf');
    const months=Number(document.getElementById('financial-period-months')?.value||12),flowBasis=document.getElementById('financial-flow-basis')?.value||'annualized';
    const annualBasisComparable=flowBasis==='annualized'||months===12,wacc=annualBasisComparable&&Number.isFinite(rawWacc)?rawWacc:NaN;
    const ebitda=(get('ebit')+get('depreciation-current'))*12/Math.max(1,months),netDebt=value('netDebt'),netDebtEbitda=Number.isFinite(netDebt)&&Number.isFinite(ebitda)&&ebitda>0?netDebt/ebitda:NaN;
    const kpis=[[_t('analyst_kpi_roic'),annualBasisComparable&&Number.isFinite(roic)&&Number.isFinite(wacc)?`${number(roic)}% / ${number(wacc)}%`:`${number(roic)}% / —`,annualBasisComparable&&Number.isFinite(roic)&&Number.isFinite(wacc)?(roic>wacc?_t('analyst_strong'):_t('analyst_review')):_t('analyst_missing')],[_t('analyst_kpi_roe'),`${number(roe)}%`,_t('analyst_review')],[_t('analyst_kpi_cash'),`${number(cfoNetIncome)}×`,_t('analyst_review')],[_t('analyst_kpi_leverage'),`${number(netDebtEbitda)}×`,_t('analyst_review')]];
    const kh=document.getElementById('analyst-dashboard-kpis');if(kh)kh.innerHTML=kpis.map(([title,val,state])=>`<article class="analyst-kpi"><span>${title}</span><strong>${val}</strong><small>${state}</small></article>`).join('');
    const notes=[];
    if(!annualBasisComparable)notes.push(_t('analyst_basis_warning',{months}));
    if(Number.isFinite(roic)&&Number.isFinite(wacc))notes.push(_t('analyst_roic_wacc',{roic:number(roic),wacc:number(wacc),spread:number(roic-wacc)}));
    if([roe,margin,turnover,multiplier].every(Number.isFinite))notes.push(_t('analyst_roe_driver',{roe:number(roe),margin:number(margin),turnover:number(turnover),multiplier:number(multiplier)}));
    if(Number.isFinite(cfoNetIncome))notes.push(_t('analyst_cash_conversion',{value:number(cfoNetIncome)}));
    if(Number.isFinite(netDebtEbitda))notes.push(_t('analyst_leverage',{value:number(netDebtEbitda)}));
    if(Number.isFinite(fcf))notes.push(_t('analyst_fcf',{value:number(fcf)}));
    notes.push(flagged?_t('analyst_quality',{count:flagged}):_t('analyst_quality_clear'));
    const nh=document.getElementById('analyst-review-notes');if(nh)nh.innerHTML=notes.map((note,index)=>`<article class="analyst-note"><span>${String(index+1).padStart(2,'0')}</span><p>${escapeCompanyHtml(note)}</p></article>`).join('');
    if (kh) decorateResearchTooltips(kh);
}

function renderFinancialQualityChecks(get, months = 12) {
    const host = document.getElementById('financial-quality-checks');
    if (!host) return;
    const checks = [];
    const assets = get('total-assets'), liabilities = get('total-liabilities'), equity = get('shareholders-equity');
    if ([assets,liabilities,equity].every(Number.isFinite)) {
        const difference = assets-liabilities-equity, tolerance = Math.max(Math.abs(assets)*0.01,1e-9);
        checks.push([Math.abs(difference)<=tolerance?'pass':'warn',_t('quality_balance'),`${_t('quality_balance_note')}: ${new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2}).format(difference)}`]);
    } else checks.push(['missing',_t('quality_balance'),_t('quality_missing')]);
    const totalDebt=get('interest-bearing-debt'), shortDebt=get('short-term-interest-bearing-debt'), longDebt=get('long-term-interest-bearing-debt');
    if([totalDebt,shortDebt,longDebt].every(Number.isFinite)){
        const difference=shortDebt+longDebt-totalDebt, tolerance=Math.max(Math.abs(totalDebt)*0.01,1e-9);
        checks.push([Math.abs(difference)<=tolerance?'pass':'warn',currentLang==='fa'?'تطبیق بدهی کوتاه‌مدت و بلندمدت با کل بدهی بهره‌دار':'Short- and long-term debt reconcile to total interest-bearing debt',`${_t('quality_balance_note')}: ${new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2}).format(difference)}`]);
    } else checks.push(['missing',currentLang==='fa'?'تطبیق ترکیب بدهی':'Debt maturity split reconciliation',_t('quality_missing')]);
    const cfo = get('operating-cash-flow'), income = get('net-income');
    if (Number.isFinite(cfo)&&Number.isFinite(income)&&income!==0) {
        const ratio=cfo/income;
        checks.push([ratio<0.5?'warn':'pass',_t('quality_cash'),`${ratio.toFixed(2)}×${ratio<0.5?` · ${_t('quality_warn')}`:''}`]);
    } else checks.push(['missing',_t('quality_cash'),_t('quality_missing')]);
    const avgAssets=(get('total-assets-prior')+assets)/2;
    if (Number.isFinite(income)&&Number.isFinite(cfo)&&Number.isFinite(avgAssets)&&avgAssets!==0) {
        const accrual=(income-cfo)/avgAssets*100;
        checks.push([Math.abs(accrual)>10?'warn':'pass',_t('quality_accrual'),`${accrual.toFixed(2)}%${Math.abs(accrual)>10?` · ${_t('quality_warn')}`:''}`]);
    } else checks.push(['missing',_t('quality_accrual'),_t('quality_missing')]);
    const dividends=get('dividends-paid');
    if (Number.isFinite(dividends)&&Number.isFinite(income)&&income>0) {
        const payout=dividends/income*100;
        checks.push([payout>100?'warn':'pass',_t('quality_payout'),`${payout.toFixed(2)}%${payout>100?` · ${_t('quality_warn')}`:''}`]);
    } else checks.push(['missing',_t('quality_payout'),_t('quality_missing')]);
    const reportedCapex=get('reported-capex'), capexEstimate=Number.isFinite(get('fixed-assets-current'))&&Number.isFinite(get('fixed-assets-prior'))&&Number.isFinite(get('depreciation-current'))?get('fixed-assets-current')-get('fixed-assets-prior')+get('depreciation-current'):NaN;
    const capexBasis=Number.isFinite(reportedCapex)?'quality_capex_reported':Number.isFinite(capexEstimate)&&capexEstimate>=0?'quality_capex_estimated':'quality_capex_unavailable';
    checks.push([capexBasis==='quality_capex_reported'?'pass':'warn',_t('quality_capex'),_t(capexBasis)]);
    checks.push([Number.isFinite(get('total-assets-prior'))&&Number.isFinite(get('shareholders-equity-prior'))?'pass':'warn',_t('quality_opening'),Number.isFinite(get('total-assets-prior'))&&Number.isFinite(get('shareholders-equity-prior'))?_t('quality_pass'):_t('quality_warn')]);
    checks.push([Number.isFinite(get('tax-rate'))&&get('tax-rate')>=0&&get('tax-rate')<=100?'pass':'warn',currentLang==='fa'?'نرخ مالیات برای ROIC':'Tax rate for ROIC',Number.isFinite(get('tax-rate'))&&get('tax-rate')>=0&&get('tax-rate')<=100?_t('quality_pass'):(currentLang==='fa'?'ROIC محاسبه نمی‌شود تا نرخ مالیات معتبر وارد شود.':'ROIC is withheld until a valid 0–100% tax rate is entered.')]);
    const flowBasis=document.getElementById('financial-flow-basis')?.value||'annualized';
    checks.push([months!==12&&flowBasis==='annualized'?'warn':'pass',_t('quality_period'),`${months} ${_t(flowBasis==='annualized'?'quality_period_note':'quality_period_reported')}`]);
    const missingDenominators = ['shares-outstanding','sales','total-assets','shareholders-equity','current-liabilities'].filter(id=>!Number.isFinite(get(id))||Math.abs(get(id))<1e-12);
    if (missingDenominators.length) checks.push(['warn',_t('quality_denominators'),missingDenominators.join(', ')]);
    const currentAssets=get('current-assets'), currentLiabilities=get('current-liabilities');
    if(Number.isFinite(currentAssets)&&Number.isFinite(currentLiabilities)&&currentLiabilities>0){const ratio=currentAssets/currentLiabilities;checks.push([ratio<1?'warn':'pass',currentLang==='fa'?'پوشش بدهی‌های جاری (Current Ratio)':'Current-liability coverage (Current Ratio)',`${ratio.toFixed(2)}×${ratio<1?` · ${_t('quality_warn')}`:''}`]);}
    else checks.push(['missing',currentLang==='fa'?'پوشش بدهی‌های جاری':'Current-liability coverage',_t('quality_missing')]);
    if(Number.isFinite(equity))checks.push([equity<=0?'warn':'pass',currentLang==='fa'?'حقوق صاحبان سهام مثبت':'Positive shareholders’ equity',`${new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2}).format(equity)}${equity<=0?` · ${_t('quality_warn')}`:''}`]);
    else checks.push(['missing',currentLang==='fa'?'حقوق صاحبان سهام':'Shareholders’ equity',_t('quality_missing')]);
    host.innerHTML=checks.map(([status,title,note])=>`<article class="quality-check ${status}"><span class="quality-state">${status==='pass'?'✓':status==='warn'?'!':'…'}</span><div><strong>${escapeCompanyHtml(title)}</strong><p>${escapeCompanyHtml(note)}</p></div></article>`).join('');
    decorateResearchTooltips(host);
}

function runScenarioDCF() {
    const get = id => {const field=document.getElementById(`financial-${id}`);return field&&field.value.trim()!==''?parseLocalizedNumber(field.value):NaN;};
    const host=document.getElementById('dcf-results');
    const monthsRaw=Number(document.getElementById('financial-period-months')?.value||12), periodValid=Number.isInteger(monthsRaw)&&monthsRaw>0&&monthsRaw<=60, annualize=periodValid?12/monthsRaw:1;
    const sales=get('sales')*annualize, ebit=get('ebit')*annualize, reportedCapexRaw=get('reported-capex'), capexReported=Number.isFinite(reportedCapexRaw)?Math.abs(reportedCapexRaw)*annualize:NaN, capexEstimate=Number.isFinite(get('fixed-assets-current'))&&Number.isFinite(get('fixed-assets-prior'))&&Number.isFinite(get('depreciation-current'))?(get('fixed-assets-current')-get('fixed-assets-prior'))*annualize+get('depreciation-current')*annualize:NaN;
    const capex=Number.isFinite(capexReported)?capexReported:capexEstimate, depreciation=get('depreciation-current')*annualize, shares=get('shares-outstanding'), debt=get('interest-bearing-debt'), cash=get('cash-equivalents'), price=get('current-share-price');
    const readClaim=id=>{const field=document.getElementById(id),raw=field?.value?.trim();return !raw?0:parseLocalizedNumber(raw);};
    const preferredClaim=readClaim('dcf-preferred-claim'),minorityClaim=readClaim('dcf-minority-claim'),otherClaim=readClaim('dcf-other-claim'),preferredCostRaw=document.getElementById('dcf-preferred-cost')?.value?.trim(),preferredCost=preferredCostRaw?parseLocalizedNumber(preferredCostRaw)/100:NaN;
    const capexIntensityInput=parseLocalizedNumber(document.getElementById('dcf-capex-sales')?.value||''),daIntensityInput=parseLocalizedNumber(document.getElementById('dcf-da-sales')?.value||'');
    const capexIntensity=Number.isFinite(capexIntensityInput)?capexIntensityInput/100:(Number.isFinite(capex)&&sales>0?capex/sales:NaN),daIntensity=Number.isFinite(daIntensityInput)?daIntensityInput/100:(Number.isFinite(depreciation)&&sales>0?depreciation/sales:NaN);
    const currentNwcItems=[get('accounts-receivable'),get('inventory'),get('accounts-payable')];
    const priorNwcItems=[get('accounts-receivable-prior'),get('inventory-prior'),get('accounts-payable-prior')];
    const currentOperatingNwc=currentNwcItems.every(Number.isFinite)?currentNwcItems[0]+currentNwcItems[1]-currentNwcItems[2]:NaN;
    const priorOperatingNwc=priorNwcItems.every(Number.isFinite)?priorNwcItems[0]+priorNwcItems[1]-priorNwcItems[2]:NaN;
    const openingClosingNwc=Number.isFinite(currentOperatingNwc)&&Number.isFinite(priorOperatingNwc)?(currentOperatingNwc+priorOperatingNwc)/2:currentOperatingNwc;
    const enteredNwc=parseLocalizedNumber(document.getElementById('dcf-nwc-sales')?.value||'');
    const nwcRatio=Number.isFinite(enteredNwc)?enteredNwc/100:(Number.isFinite(openingClosingNwc)&&sales>0?openingClosingNwc/sales:NaN);
    const years=Math.round(Math.max(3,Math.min(10,Number(document.getElementById('dcf-years')?.value)||5)));
    const readPercent=selector=>{const raw=document.querySelector(selector)?.value?.trim();if(raw===' '||raw==='')return NaN;const value=parseLocalizedNumber(raw);return Number.isFinite(value)?value/100:NaN;};
    const taxInput=document.getElementById('dcf-tax')?.value?.trim(), statementTax=get('tax-rate');
    const taxPercent=taxInput?parseLocalizedNumber(taxInput):statementTax;
    const tax=Number.isFinite(taxPercent)&&taxPercent>=0&&taxPercent<=100?taxPercent/100:NaN;
    const inputs=['bear','base','bull'].map(name=>({name,growth:readPercent(`[data-dcf="${name}-growth"]`),margin:readPercent(`[data-dcf="${name}-margin"]`),wacc:readPercent(`[data-dcf="${name}-wacc"]`),terminal:readPercent(`[data-dcf="${name}-terminal"]`)}));
    const derive=document.getElementById('dcf-use-derived-wacc')?.checked;
    const rf=readPercent('#dcf-risk-free'), beta=parseLocalizedNumber(document.getElementById('dcf-beta')?.value||''), erp=readPercent('#dcf-erp'), costDebt=readPercent('#dcf-cost-debt');
    const marketEquity=Number.isFinite(price)&&price>0&&Number.isFinite(shares)&&shares>0?price*shares:NaN;
    const capitalBase=marketEquity+debt+preferredClaim;
    const costEquity=Number.isFinite(rf)&&Number.isFinite(beta)&&Number.isFinite(erp)?rf+beta*erp:NaN;
    const waccDerived=Number.isFinite(costEquity)&&Number.isFinite(costDebt)&&Number.isFinite(tax)&&Number.isFinite(capitalBase)&&capitalBase>0&&marketEquity>=0&&debt>=0&&preferredClaim>=0&&minorityClaim>=0&&otherClaim>=0&&(preferredClaim===0||(Number.isFinite(preferredCost)&&preferredCost>=0))?(costEquity*marketEquity+costDebt*(1-tax)*debt+(preferredClaim>0?preferredCost*preferredClaim:0))/capitalBase:NaN;
    const waccStatus=document.getElementById('dcf-wacc-status');
    if(waccStatus)waccStatus.textContent=derive?(Number.isFinite(waccDerived)?_t('dcf_wacc_derived',{coe:(costEquity*100).toFixed(2),equityWeight:(marketEquity/capitalBase*100).toFixed(2),debtWeight:(debt/capitalBase*100).toFixed(2),preferredWeight:(preferredClaim/capitalBase*100).toFixed(2),wacc:(waccDerived*100).toFixed(2)}):_t('dcf_wacc_missing')):_t('dcf_wacc_manual_note');
    if(derive&&Number.isFinite(waccDerived))inputs.forEach(s=>s.wacc=waccDerived);
    const valid=periodValid&&Number.isFinite(sales)&&sales>0&&Number.isFinite(capexIntensity)&&capexIntensity>=0&&Number.isFinite(daIntensity)&&daIntensity>=0&&Number.isFinite(nwcRatio)&&Number.isFinite(shares)&&shares>0&&Number.isFinite(debt)&&Number.isFinite(cash)&&Number.isFinite(tax)&&Number.isFinite(preferredClaim)&&preferredClaim>=0&&Number.isFinite(minorityClaim)&&minorityClaim>=0&&Number.isFinite(otherClaim)&&otherClaim>=0&&(preferredClaim===0||!derive||(Number.isFinite(preferredCost)&&preferredCost>=0))&&(!derive||Number.isFinite(waccDerived))&&inputs.every(s=>[s.growth,s.margin,s.wacc,s.terminal].every(Number.isFinite)&&s.growth>-.95&&s.growth<=1&&s.margin>=-1&&s.margin<=1&&s.wacc>0&&s.wacc<=1&&s.wacc>s.terminal&&s.terminal>-.25&&s.terminal<1);
    if(!valid){host.innerHTML=`<p class="comparison-warning">${_t('dcf_invalid')}</p>`;if(window.Plotly)Plotly.purge('dcf-chart');return;}
    const project=(s,wacc=s.wacc,terminal=s.terminal)=>{let pv=0,rev=sales,priorNwc=sales*nwcRatio;const fcffs=[];for(let year=1;year<=years;year++){rev*=1+s.growth;const forecastNwc=rev*nwcRatio,deltaNwc=forecastNwc-priorNwc,forecastEbit=rev*s.margin,nopat=forecastEbit-Math.max(forecastEbit,0)*tax;const fcff=nopat+rev*daIntensity-rev*capexIntensity-deltaNwc;fcffs.push(fcff);pv+=fcff/(1+wacc)**year;priorNwc=forecastNwc;}const terminalFcff=fcffs.at(-1)*(1+terminal);const terminalValue=terminalFcff/(wacc-terminal);const ev=pv+terminalValue/(1+wacc)**years;const equityValue=ev+cash-debt-preferredClaim-minorityClaim-otherClaim;return {ev,equityValue,perShare:equityValue/shares,fcffs,terminalValue,terminalShare:ev>0?terminalValue/(1+wacc)**years/ev*100:NaN};};
    const cases=inputs.map(s=>{const result=project(s);return {...s,...result,upside:Number.isFinite(price)&&price>0?(result.perShare/price-1)*100:NaN};});
    const number=value=>new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2}).format(value);
    const currentMargin=Number.isFinite(ebit)&&Number.isFinite(sales)&&sales>0?ebit/sales*100:NaN;
    host.innerHTML=`<p class="text-xs text-dark-text-muted mb-2">${_t('dcf_current_margin',{margin:Number.isFinite(currentMargin)?number(currentMargin):_t('comparison_unavailable')})} · ${_t('dcf_nwc_sales')}: ${number(nwcRatio*100)}% · ${_t('dcf_capex_sales')}: ${number(capexIntensity*100)}% · ${_t('dcf_da_sales')}: ${number(daIntensity*100)}% · ${_t('dcf_claims_deducted')}: ${number(preferredClaim+minorityClaim+otherClaim)} · ${_t('dcf_terminal_share')}: ${number(cases.find(s=>s.name==='base').terminalShare)}%</p><div class="overflow-x-auto"><table class="peer-table dcf-table" role="table" aria-label="${_t('dcf_scenario')}"><thead><tr><th>${_t('dcf_scenario')}</th><th>${_t('dcf_ev')}</th><th>${_t('dcf_equity')}</th><th>${_t('dcf_price')}</th><th>${_t('dcf_current')}</th><th>${_t('dcf_upside')}</th></tr></thead><tbody>${cases.map(s=>`<tr><th scope="row" data-label="${_t('dcf_scenario')}">${_t(`dcf_${s.name}`)}</th><td data-label="${_t('dcf_ev')}">${number(s.ev)}</td><td data-label="${_t('dcf_equity')}">${number(s.equityValue)}</td><td data-label="${_t('dcf_price')}">${number(s.perShare)}</td><td data-label="${_t('dcf_current')}">${Number.isFinite(price)?number(price):_t('comparison_unavailable')}</td><td data-label="${_t('dcf_upside')}">${Number.isFinite(s.upside)?`${number(s.upside)}%`:_t('dcf_share_warning')}</td></tr>`).join('')}</tbody></table></div>`;
    decorateResearchTooltips(host);
    const sensitivityHost=document.getElementById('dcf-sensitivity'),base=inputs.find(s=>s.name==='base'),baseWacc=base.wacc,baseTerm=base.terminal,waccSteps=[-.02,-.01,0,.01,.02],terminalSteps=[-.01,-.005,0,.005,.01];
    if(sensitivityHost){sensitivityHost.innerHTML=`<h3 class="font-semibold mt-4 mb-1">${_t('dcf_sensitivity_title')}</h3><p class="text-xs text-dark-text-muted mb-2">${_t('dcf_sensitivity_note')}</p><table class="peer-table sensitivity-table"><thead><tr><th>WACC \ g</th>${terminalSteps.map(change=>`<th>${number((baseTerm+change)*100)}%</th>`).join('')}</tr></thead><tbody>${waccSteps.map(dw=>`<tr><th>${number((baseWacc+dw)*100)}%</th>${terminalSteps.map(dg=>{const w=baseWacc+dw,g=baseTerm+dg,val=w>g?project(base,w,g).perShare:NaN;return `<td class="${Number.isFinite(val)&&val>=0?'sensitivity-positive':'sensitivity-negative'}">${Number.isFinite(val)?number(val):'—'}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;decorateResearchTooltips(sensitivityHost);}
    if(window.Plotly){const traces=cases.map((s,i)=>({type:'scatter',mode:'lines+markers',name:_t(`dcf_${s.name}`),x:s.fcffs.map((_,n)=>`${_t('dcf_year')} ${n+1}`),y:s.fcffs,line:{color:['#fb7185','#60a5fa','#4ade80'][i]},hovertemplate:'%{x}<br>%{y:.2f}<extra></extra>'}));Plotly.newPlot('dcf-chart',traces,{title:{text:_t('dcf_forecast_chart'),font:{color:'#e2e8f0'}},yaxis:{title:{text:'FCFF'},color:'#cbd5e1',gridcolor:'#334155'},xaxis:{color:'#cbd5e1'},plot_bgcolor:'#1f2937',paper_bgcolor:'#111827',font:{color:'#cbd5e1'},margin:{t:55,r:15,b:45,l:65},legend:{orientation:'h',y:-.2}},{responsive:true,displaylogo:false});}
    if(financialMetrics){const financialGetter=id=>{const field=document.getElementById(`financial-${id}`);return field&&field.value.trim()!==''?parseLocalizedNumber(field.value):NaN;};renderAnalystDashboard(financialGetter);}
}

function formatFinancialValue(metric) {
    if (!Number.isFinite(metric.value)) return _t('value_invalid');
    const value = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(metric.value);
    if (metric.unit === '%') return `${value}%`;
    if (metric.unit === '×') return `${value}×`;
    if (metric.unit === 'days') return currentLang === 'fa' ? `${value} روز` : `${value} days`;
    if (metric.unit === 'per share') return currentLang === 'fa' ? `${value} / سهم` : `${value} / share`;
    if (metric.unit === 'currency') return currentLang === 'fa' ? `${value} واحد پول` : value;
    return value;
}

function renderFinancialResults() {
    const host = document.getElementById('financial-results');
    if (!host || !financialMetrics) return;
    const groups = [...new Set(financialMetrics.map(metric => metric.group))];
    const groupName = group => currentLang === 'fa' ? financialFa.group[group] || group : group;
    const metricName = localizedMetricName;
    const formulaText = metric => currentLang === 'fa' ? financialFa.formula[metric.key] || metric.formula : metric.formula;
    const columnLabels = { metric: currentLang === 'fa' ? 'شاخص' : 'Metric', formula: currentLang === 'fa' ? 'فرمول' : 'Formula', result: currentLang === 'fa' ? 'نتیجه' : 'Result', guidance: _t('financial_guidance_heading') };
    const coverage = document.getElementById('financial-coverage');
    const validCount = financialMetrics.filter(metric => Number.isFinite(metric.value)).length;
    if (coverage) coverage.textContent = currentLang === 'fa' ? `${new Intl.NumberFormat('fa-IR').format(validCount)} از ${new Intl.NumberFormat('fa-IR').format(financialMetrics.length)} شاخص با داده‌های واردشده قابل محاسبه است` : `${validCount} of ${financialMetrics.length} metrics are calculable from the supplied inputs`;
    const kpiHost = document.getElementById('financial-kpis');
    if (kpiHost) kpiHost.innerHTML = ['eps', 'roe', 'pe', 'fcf'].map(key => { const metric = financialMetrics.find(item => item.key === key); return `<article class="kpi-card"><div class="kpi-label" data-help-key="advice_${metric.key}">${metricName(metric)}</div><div class="kpi-value">${formatFinancialValue(metric)}</div></article>`; }).join('');
    host.innerHTML = groups.map(group => `
        <h3 class="text-lg font-semibold mt-4 mb-2">${groupName(group)}</h3>
        <table class="w-full text-left border-collapse" role="table" aria-label="${groupName(group)}">
            <thead><tr class="border-b border-dark-border"><th class="py-2 pr-3">${columnLabels.metric}</th><th class="py-2 pr-3">${columnLabels.formula}</th><th class="py-2 text-right">${columnLabels.result}</th><th class="py-2 pr-3">${columnLabels.guidance}</th></tr></thead>
            <tbody>${financialMetrics.filter(metric => metric.group === group).map(metric => `<tr class="border-b border-dark-border"><td class="py-2 pr-3" data-label="${columnLabels.metric}"><span class="metric-name" data-help-key="advice_${metric.key}">${metricName(metric)}</span></td><td class="py-2 pr-3 text-dark-text-muted" data-label="${columnLabels.formula}">${formulaText(metric)}</td><td class="py-2 text-right font-mono" data-label="${columnLabels.result}">${formatFinancialValue(metric)}</td><td class="py-2 pr-3" data-label="${columnLabels.guidance}"><details class="metric-guidance"><summary>${_t('financial_guidance_expand')}</summary><p>${_t(`advice_${metric.key}`)}</p></details></td></tr>`).join('')}</tbody>
        </table>`).join('');
    decorateResearchTooltips(host);
}

function drawFinancialChart() {
    const host = document.getElementById('financial-chart');
    const selector = document.getElementById('financial-chart-group');
    if (!host || !selector || !window.Plotly || !financialMetrics) return;
    const chartGroup = financialChartGroups[selector.value];
    if (!chartGroup) return;
    const metrics = chartGroup.keys.map(key => financialMetrics.find(metric => metric.key === key)).filter(metric => metric && Number.isFinite(metric.value));
    const chartTitle = currentLang === 'fa' ? financialFa.charts[chartGroup.title] || chartGroup.title : chartGroup.title;
    const chartUnit = currentLang === 'fa' ? financialFa.units[chartGroup.unit] || chartGroup.unit : chartGroup.unit;
    const chartLabel = localizedMetricName;
    if (!metrics.length) {
        Plotly.purge(host);
        host.innerHTML = `<p class="text-dark-text-muted p-4">${currentLang === 'fa' ? 'برای این گروه داده محاسبه‌شده‌ای وجود ندارد.' : 'No calculated values are available for this chart group.'}</p>`;
        return;
    }
    Plotly.newPlot(host, [{ type: 'bar', x: metrics.map(chartLabel), y: metrics.map(metric => metric.value), marker: { color: '#3b82f6' }, hovertemplate: '%{x}<br>%{y:.2f}<extra></extra>' }], {
        title: { text: chartTitle, font: { color: '#d1d5db' } },
        xaxis: { tickangle: -20, color: '#d1d5db', gridcolor: '#374151' },
        yaxis: { title: { text: chartUnit }, color: '#d1d5db', gridcolor: '#374151', zerolinecolor: '#9ca3af' },
        plot_bgcolor: '#1f2937', paper_bgcolor: '#111827', font: { color: '#d1d5db' }, margin: { t: 55, r: 20, b: 100, l: 65 },
        autosize: true
    }, { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio'] });
}


// --- Multi-company financial history, peer comparison, and trends ---
const companyStorageKey = 'cfaCompanyFinancialsV1';
const companyFieldIds = financialInputGroups.flatMap(group => group.fields.map(([id]) => id));
const comparisonMetricGroups = {
    dividend: ['eps','dps','totalReturn','dividendYield','dpr'],
    profitability: ['grossMargin','operatingMargin','netMargin','roe','roa','roic','dupontRoe'],
    valuation: ['pe','pb','ps','evEbitda','pfcf'],
    leverage: ['de','liabilitiesEquity','debtRatio','interestCoverage','netDebt','shortDebtShare','debtMixReconciliation'],
    liquidity: ['workingCapital','currentRatio','quickRatio','cashRatio'],
    efficiency: ['assetTurnover','inventoryTurnover','receivablesTurnover','dpo','dio','dso','ccc'],
    cashflow: ['capex','fcf','fcfYield','cfoNetIncome','accrualRatio','fcfMargin','cfoCapexCoverage']
};
let companyFinancialRecords = loadCompanyFinancialRecords();
let activeCompanyId = '';
let companyFormDirty = false;
const companyMetricCache = new WeakMap();

function cleanCompanyText(value, max = 80) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function sanitizeCompanyFinancialRecords(input) {
    if (!Array.isArray(input)) return [];
    const ids = new Set();
    return input.slice(0, 100).map((raw, index) => {
        if (!raw || typeof raw !== 'object') return null;
        const name = cleanCompanyText(raw.name);
        if (!name) return null;
        let id = cleanCompanyText(raw.id, 80) || `company-${index}`;
        if (ids.has(id)) id = `${id}-${index}`;
        ids.add(id);
        const periods = {};
        if (raw.periods && typeof raw.periods === 'object' && !Array.isArray(raw.periods)) {
            for (const period of Object.keys(raw.periods).slice(0, 80)) {
                const label = cleanCompanyText(period, 20);
                const source = raw.periods[period];
                if (!label || !source || typeof source !== 'object') continue;
                const values = {};
                for (const field of companyFieldIds) {
                    const value = Number(source[field]);
                    if (source[field] !== '' && source[field] !== null && source[field] !== undefined && Number.isFinite(value)) values[field] = value;
                }
                periods[label] = values;
            }
        }
        const periodMeta = {};
        if (raw.periodMeta && typeof raw.periodMeta === 'object' && !Array.isArray(raw.periodMeta)) {
            for (const period of Object.keys(raw.periodMeta).slice(0,80)) {
                const meta = raw.periodMeta[period];
                if (!meta || typeof meta !== 'object') continue;
                const months = Number(meta.months);
                periodMeta[cleanCompanyText(period,20)] = {
                    months: Number.isInteger(months) && months >= 1 && months <= 60 ? months : 12,
                    scope: ['consolidated','separate'].includes(meta.scope) ? meta.scope : 'consolidated',
                    status: ['audited','reviewed','unaudited','forecast'].includes(meta.status) ? meta.status : 'unaudited',
                    opinion: ['unmodified','qualified','adverse','disclaimer','not_applicable'].includes(meta.opinion) ? meta.opinion : 'not_applicable',
                    sourceFile:cleanCompanyText(meta.sourceFile,160), sourcePage:cleanCompanyText(meta.sourcePage,40), restated:Boolean(meta.restated), savedAt:/^\d{4}-\d\d-\d\dT/.test(meta.savedAt||'')?meta.savedAt:''
                };
            }
        }
        return { id, name, ticker: cleanCompanyText(raw.ticker, 24), industry:cleanCompanyText(raw.industry,60), currency: cleanCompanyText(raw.currency, 12).toUpperCase(), scale: ['units','thousands','millions'].includes(raw.scale) ? raw.scale : 'units', periods, periodMeta };
    }).filter(Boolean);
}
function loadCompanyFinancialRecords() {
    try {
        const parsed = JSON.parse(localStorage.getItem(companyStorageKey) || '[]');
        return sanitizeCompanyFinancialRecords(Array.isArray(parsed) ? parsed : parsed.companies);
    } catch (_) { return []; }
}
function persistCompanyFinancialRecords() {
    try { localStorage.setItem(companyStorageKey, JSON.stringify(companyFinancialRecords)); return true; }
    catch (_) { setCompanyStatus(_t('company_storage_error'), 'error'); return false; }
}
function companyById(id = activeCompanyId) { return companyFinancialRecords.find(company => company.id === id) || null; }
function createCompanyId() { return globalThis.crypto?.randomUUID?.() || `company-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`; }
function escapeCompanyHtml(value) { return String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); }
function setCompanyStatus(message, type = 'info') {
    const node = document.getElementById('company-data-status');
    if (!node) return;
    node.textContent = message;
    node.className = `text-sm my-3 ${type === 'error' ? 'text-red-300' : type === 'success' ? 'text-green-300' : 'text-dark-text-muted'}`;
}
function sortedCompanyPeriods(periods) {
    return Object.keys(periods || {}).sort(new Intl.Collator(undefined, {numeric:true, sensitivity:'base'}).compare);
}
function renderCompanySelector() {
    const select = document.getElementById('company-select');
    if (!select) return;
    const previous = activeCompanyId;
    select.innerHTML = `<option value="">${_t('company_select_empty')}</option>` + companyFinancialRecords.map(company => `<option value="${escapeCompanyHtml(company.id)}">${escapeCompanyHtml(company.name)}${company.ticker ? ` · ${escapeCompanyHtml(company.ticker)}` : ''}</option>`).join('');
    if (previous && companyById(previous)) select.value = previous;
}
function renderCompanyPeriodSelector(selected = '') {
    const select = document.getElementById('company-period-select');
    if (!select) return;
    const company = companyById();
    const periods = company ? sortedCompanyPeriods(company.periods) : [];
    select.innerHTML = `<option value="__new__">${_t('new_period_option')}</option>` + periods.map(period => `<option value="${escapeCompanyHtml(period)}">${escapeCompanyHtml(period)}</option>`).join('');
    select.value = periods.includes(selected) ? selected : '__new__';
}
function currentCompanyEditorTextValues() { return Object.fromEntries([...document.querySelectorAll('[data-company-field]')].map(input => [input.dataset.companyField,input.value])); }
function currentCompanyEditorValues() {
    const values = {};
    document.querySelectorAll('[data-company-field]').forEach(input => {
        const number = parseLocalizedNumber(input.value);
        if (input.value.trim() !== '' && Number.isFinite(number)) values[input.dataset.companyField] = number;
    });
    return values;
}
function currentCompanyPeriodMeta() {
    const rawMonths = document.getElementById('company-period-months')?.value.trim();
    const months = rawMonths === '' ? 12 : Number(rawMonths);
    return { months, scope: document.getElementById('company-reporting-basis')?.value || 'consolidated', status: document.getElementById('company-assurance-status')?.value || 'audited', opinion: document.getElementById('company-audit-opinion')?.value || 'not_applicable', sourceFile:cleanCompanyText(document.getElementById('company-source-document')?.value,160), sourcePage:cleanCompanyText(document.getElementById('company-source-page')?.value,40), restated:Boolean(document.getElementById('company-restated')?.checked) };
}
function companyPeriodMeta(company, period) {
    return company?.periodMeta?.[period] || {months:12,scope:'consolidated',status:'unaudited',opinion:'not_applicable',sourceFile:'',sourcePage:'',restated:false};
}
function localizedPeriodMeta(meta) {
    const labels = {consolidated:'basis_consolidated',separate:'basis_separate',audited:'assurance_audited',reviewed:'assurance_reviewed',unaudited:'assurance_unaudited',forecast:'assurance_forecast',unmodified:'opinion_unmodified',qualified:'opinion_qualified',adverse:'opinion_adverse',disclaimer:'opinion_disclaimer',not_applicable:'opinion_na'};
    const provenance=[meta.sourceFile,meta.sourcePage].filter(Boolean).join(' · ');
    const version=meta.savedAt?` · ${_t('record_saved_at',{date:new Intl.DateTimeFormat(currentLang==='fa'?'fa-IR':'en-US',{dateStyle:'medium',timeStyle:'short'}).format(new Date(meta.savedAt))})}`:'';
    return `${_t('period_meta_badge',{months:meta.months,basis:_t(labels[meta.scope] || 'basis_consolidated'),status:_t(labels[meta.status] || 'assurance_audited'),opinion:_t(labels[meta.opinion] || 'opinion_na')})}${meta.restated?` · ${_t('restated_label')}`:''}${provenance?` · ${provenance}`:''}${version}`;
}
function prefillAttachedCodalReport() {
    if (companyFormDirty && !window.confirm(_t('company_unsaved_confirm'))) return;
    activeCompanyId = '';
    document.getElementById('company-select').value = '';
    document.getElementById('company-name').value = 'Iran Manganese Mines Company';
    document.getElementById('company-ticker').value = 'کمنگنز';
    document.getElementById('company-industry').value = 'Metals & Mining';
    document.getElementById('company-currency').value = 'IRR';
    document.getElementById('company-scale').value = 'millions';
    document.getElementById('company-period').value = 'FY1404';
    document.getElementById('company-source-document').value = 'seo-codal-report (7).pdf';
    loadCompanyPeriodMeta({months:12,scope:'consolidated',status:'audited',opinion:'unmodified'});
    renderCompanyFinancialFields({});
    companyFormDirty = false;
    setCompanyStatus(_t('report_metadata_prefilled'));
}
function loadCompanyPeriodMeta(meta = {}) {
    const normalized = {...companyPeriodMeta(null,''),...meta};
    document.getElementById('company-period-months').value = normalized.months ?? '';
    document.getElementById('company-reporting-basis').value = normalized.scope || 'consolidated';
    document.getElementById('company-assurance-status').value = normalized.status || 'audited';
    document.getElementById('company-audit-opinion').value = normalized.opinion || 'not_applicable';
    document.getElementById('company-source-document').value = normalized.sourceFile || '';
    document.getElementById('company-source-page').value = normalized.sourcePage || '';
    document.getElementById('company-restated').checked = Boolean(normalized.restated);
}
function renderCompanyFinancialFields(values = {}) {
    const host = document.getElementById('company-period-inputs');
    if (!host) return;
    const persisted = values || {};
    host.innerHTML = financialInputGroups.map(group => `<fieldset class="border border-dark-border rounded-lg p-4"><legend class="px-2 text-lg font-semibold">${currentLang === 'fa' ? financialFa.group[group.title] || group.title : group.title}</legend><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${group.fields.map(([id,label]) => `<label for="company-field-${id}" class="text-sm">${currentLang === 'fa' ? financialFa.fields[id] || label : label}<input id="company-field-${id}" data-company-field="${id}" type="text" inputmode="decimal" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-2" placeholder="${currentLang === 'fa' ? 'مقدار را وارد کنید' : 'Enter value'}" value="${Number.isFinite(Number(persisted[id])) ? escapeCompanyHtml(persisted[id]) : ''}"></label>`).join('')}</div></fieldset>`).join('');
    host.querySelectorAll('[data-company-field]').forEach(input => input.addEventListener('input', () => {
        companyFormDirty = true;
        setCompanyStatus(_t('company_unsaved_status'));
    }));
    decorateResearchTooltips(host);
}
function loadCompanyEditor(company, period = '') {
    activeCompanyId = company?.id || '';
    document.getElementById('company-name').value = company?.name || '';
    document.getElementById('company-ticker').value = company?.ticker || '';
    document.getElementById('company-industry').value = company?.industry || '';
    document.getElementById('company-currency').value = company?.currency || '';
    document.getElementById('company-scale').value = company?.scale || 'units';
    const periods = company ? sortedCompanyPeriods(company.periods) : [];
    const selectedPeriod = periods.includes(period) ? period : periods.at(-1) || '';
    document.getElementById('company-period').value = selectedPeriod;
    loadCompanyPeriodMeta(selectedPeriod ? companyPeriodMeta(company, selectedPeriod) : {});
    renderCompanyPeriodSelector(selectedPeriod);
    renderCompanyFinancialFields(selectedPeriod ? company.periods[selectedPeriod] : {});
    companyFormDirty = false;
    renderCompanySelector();
    if (company) setCompanyStatus(_t('company_records_loaded',{company:company.name,count:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(periods.length)}));
}
function refreshCompanyComparison(preferredPeriod = '') {
    renderCompanySelector();
    renderCompanyPeriodSelector(document.getElementById('company-period')?.value || '');
    renderComparisonPeriodSelector(preferredPeriod);
    renderComparisonMetricSelector();
    renderIndustryPeerSelector();
    renderCompanyComparisonTable();
    drawCompanyTrendChart();
}
function companyMetricDefinitions() { return calculateFinancialMetrics(() => NaN); }
const financialMetricAbbreviations = {
    eps:'EPS', dps:'DPS', totalReturn:'TR', roe:'ROE', dividendYield:'DY', dpr:'DPR', pe:'P/E', pb:'P/B', ps:'P/S', de:'D/E', liabilitiesEquity:'L/E', netDebt:'ND', shortDebtShare:'ST Debt %', debtMixReconciliation:'Debt Reconciliation', debtRatio:'DR', interestCoverage:'ICR', evEbitda:'EV/EBITDA',
    grossMargin:'GM', operatingMargin:'OPM', netMargin:'NPM', roa:'ROA', roic:'ROIC', dupontMargin:'DuPont NPM', dupontTurnover:'DuPont AT', equityMultiplier:'EM', dupontRoe:'DuPont ROE', accrualRatio:'Accruals/Assets', fcfMargin:'FCF Margin', cfoCapexCoverage:'CFO/CapEx', assetTurnover:'AT', inventoryTurnover:'InvT', receivablesTurnover:'ART', workingCapital:'WC', currentRatio:'CR', quickRatio:'QR', cashRatio:'CaR',
    dpo:'DPO', dio:'DIO', dso:'DSO', ccc:'CCC', capex:'CapEx', fcf:'FCF', fcfYield:'FCFY', pfcf:'P/FCF', cfoNetIncome:'CFO/NI'
};
function localizedMetricName(metric) {
    const fullName = currentLang === 'fa' ? financialFa.metric[metric.key] || metric.label : metric.label;
    const abbreviation = financialMetricAbbreviations[metric.key];
    return abbreviation && !fullName.toUpperCase().includes(`(${abbreviation.toUpperCase()})`) ? `${fullName} (${abbreviation})` : fullName;
}
function localizedMetricUnit(metric) {
    const units = { '%': currentLang === 'fa' ? '٪' : '%', '×': '×', days: currentLang === 'fa' ? 'روز' : 'days', 'per share': currentLang === 'fa' ? 'هر سهم' : 'per share', currency: currentLang === 'fa' ? 'مبلغ' : 'currency' };
    return units[metric.unit] || metric.unit;
}
function formatPeerMetric(metric, value, company) {
    if (!Number.isFinite(value)) return _t('comparison_unavailable');
    if (metric.unit === 'currency') {
        const formatted = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', {maximumFractionDigits:2}).format(value);
        const currency = company.currency || (currentLang === 'fa' ? 'ارز نامشخص' : 'currency n/a');
        return `${formatted} ${escapeCompanyHtml(currency)} · ${_t(`scale_${company.scale || 'units'}`)}`;
    }
    if (metric.unit === 'per share') {
        const formatted = new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', {maximumFractionDigits:2}).format(value);
        return `${formatted} ${company.currency ? `(${escapeCompanyHtml(company.currency)})` : ''} / ${currentLang === 'fa' ? 'سهم' : 'share'}`;
    }
    return formatFinancialValue({value, unit:metric.unit});
}
function renderComparisonPeriodSelector(preferred = '') {
    const select = document.getElementById('compare-period-select');
    if (!select) return;
    const old = select.value;
    const periods = [...new Set(companyFinancialRecords.flatMap(company => sortedCompanyPeriods(company.periods)))].sort(new Intl.Collator(undefined,{numeric:true,sensitivity:'base'}).compare);
    select.innerHTML = periods.length ? periods.map(period => `<option value="${escapeCompanyHtml(period)}">${escapeCompanyHtml(period)}</option>`).join('') : `<option value="">${_t('no_periods_option')}</option>`;
    select.value = periods.includes(preferred) ? preferred : periods.includes(old) ? old : periods.at(-1) || '';
}
function renderComparisonMetricSelector() {
    const groupSelect = document.getElementById('compare-group-select');
    const metricSelect = document.getElementById('compare-trend-metric');
    if (!groupSelect || !metricSelect) return;
    const keys = comparisonMetricGroups[groupSelect.value] || comparisonMetricGroups.dividend;
    const old = metricSelect.value;
    const definitions = new Map(companyMetricDefinitions().map(metric => [metric.key,metric]));
    metricSelect.innerHTML = keys.map(key => { const metric = definitions.get(key); return metric ? `<option value="${key}">${escapeCompanyHtml(localizedMetricName(metric))}</option>` : ''; }).join('');
    if (keys.includes(old)) metricSelect.value = old;
}
function renderIndustryPeerSelector() {
    const select=document.getElementById('compare-industry-select');if(!select)return;
    const previous=select.value, industries=[...new Set(companyFinancialRecords.map(company=>company.industry).filter(Boolean))].sort(new Intl.Collator(undefined,{sensitivity:'base'}).compare);
    select.innerHTML=`<option value="__all__">${_t('compare_all_companies')}</option>`+industries.map(industry=>`<option value="${escapeCompanyHtml(industry)}">${_t('compare_industry_only',{industry:escapeCompanyHtml(industry)})}</option>`).join('');
    select.value=industries.includes(previous)?previous:'__all__';
}
function computeCompanyPeriodMetrics(company, period) {
    const values = company.periods[period];
    if (!values) return null;
    const periodMeta = companyPeriodMeta(company,period);
    const months = periodMeta.months || 12;
    let cache=companyMetricCache.get(company);
    if(!cache){cache=new Map();companyMetricCache.set(company,cache);}
    const previous=cache.get(period);
    if(previous?.source===values && previous?.months===months)return previous.metrics;
    const metrics=calculateFinancialMetrics(id => Number.isFinite(values[id]) ? values[id] : NaN,months);
    cache.set(period,{source:values,months,metrics});
    return metrics;
}
function formatPeerMetricChange(metric, value, company) {
    if(metric.unit==='%') {
        const formatted=new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US',{maximumFractionDigits:2,signDisplay:'always'}).format(value);
        return `${formatted} ${currentLang==='fa'?'واحد درصد':'pp'}`;
    }
    return formatPeerMetric(metric,value,company);
}
function renderCompanyComparisonTable() {
    const host = document.getElementById('company-comparison-table');
    const warning = document.getElementById('company-comparison-warning');
    const insightHost = document.getElementById('company-peer-insights');
    if (!host) return;
    const period = document.getElementById('compare-period-select')?.value || '';
    const group = document.getElementById('compare-group-select')?.value || 'dividend';
    const trendKey = document.getElementById('compare-trend-metric')?.value || comparisonMetricGroups[group][0];
    const definitions = new Map(companyMetricDefinitions().map(metric => [metric.key, metric]));
    const peerIndustry=document.getElementById('compare-industry-select')?.value||'__all__';
    const companies = peerIndustry==='__all__'?companyFinancialRecords:companyFinancialRecords.filter(company=>company.industry===peerIndustry);
    const periodsForComparison = companies.map(company => company.periods[period] ? company : null).filter(Boolean);
    if (warning) {
        const units = [...new Set(periodsForComparison.map(company => `${company.currency || '?'} · ${_t(`scale_${company.scale || 'units'}`)}`))];
        const unitsUnknown = periodsForComparison.some(company => !company.currency);
        const metas = periodsForComparison.map(company => companyPeriodMeta(company,period));
        const metaKeys = new Set(metas.map(meta => `${meta.months}|${meta.scope}|${meta.status}|${meta.opinion}|${Boolean(meta.restated)}`));
        const metaMissing = periodsForComparison.some(company => !company.periodMeta?.[period]);
        const messages = [];
        if (units.length > 1 || unitsUnknown) messages.push(_t('comparison_currency_warning', {items:units.join(' / ') || '?'}));
        if (metaKeys.size > 1 || metaMissing) messages.push(_t('report_metadata_missing'));
        if(periodsForComparison.some(company=>{const meta=companyPeriodMeta(company,period);return !meta.sourceFile||!meta.sourcePage||!meta.savedAt;}))messages.push(_t('report_source_missing'));
        warning.textContent = messages.join(' ');
        warning.classList.toggle('hidden', messages.length === 0);
    }
    const keys = comparisonMetricGroups[group] || comparisonMetricGroups.dividend;
    const metric = definitions.get(trendKey);
    const observations = periodsForComparison.map(company => ({company, item:computeCompanyPeriodMetrics(company,period)?.find(entry => entry.key === trendKey)})).filter(row => row.item && Number.isFinite(row.item.value));
    const quantile=(sorted,p)=>{const index=(sorted.length-1)*p,lower=Math.floor(index),fraction=index-lower;return sorted[lower]+(sorted[Math.ceil(index)]-sorted[lower])*fraction;};
    if (insightHost) {
        if (observations.length && metric) {
            const values = observations.map(row => row.item.value).sort((a,b) => a-b);
            const median = values.length % 2 ? values[(values.length-1)/2] : (values[values.length/2-1]+values[values.length/2])/2;
            const unitKeys = new Set(observations.map(row => `${row.company.currency || '?'}|${row.company.scale || 'units'}`));
            const periodMetas = observations.map(row => companyPeriodMeta(row.company,period));
            const reportingBases = new Set(periodMetas.map(meta => `${meta.scope}|${meta.status}`));
            const fullBasisKeys=new Set(periodMetas.map(meta=>`${meta.months}|${meta.scope}|${meta.status}|${meta.opinion}|${Boolean(meta.restated)}`));
            const metadataComparable = observations.every(row => Boolean(row.company.periodMeta?.[period])) && reportingBases.size === 1 && fullBasisKeys.size === 1;
            const unitComparable = metadataComparable && (!['currency','per share'].includes(metric.unit) || (unitKeys.size === 1 && observations.every(row=>Boolean(row.company.currency))));
            const guidance = _t(`advice_${metric.key}`);
            const quartileText=unitComparable&&values.length>=4?`${formatPeerMetric(metric,quantile(values,.25),observations[0].company)} / ${formatPeerMetric(metric,median,observations[0].company)} / ${formatPeerMetric(metric,quantile(values,.75),observations[0].company)}`:metadataComparable?_t('peer_sample_small'):_t('report_metadata_missing');
            insightHost.innerHTML = `<article class="peer-insight-card"><span>${_t('peer_insight_coverage')}</span><strong>${_t('peer_insight_values',{count:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(values.length),total:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(companies.length),period:escapeCompanyHtml(period)})}</strong></article>${unitComparable ? `<article class="peer-insight-card"><span>${_t('peer_insight_median')}</span><strong>${escapeCompanyHtml(localizedMetricName(metric))}: ${formatPeerMetric(metric,median,observations[0].company)}</strong></article><article class="peer-insight-card"><span>${_t('peer_insight_spread')}</span><strong>${_t('peer_insight_spread_text',{low:formatPeerMetric(metric,values[0],observations[0].company),high:formatPeerMetric(metric,values.at(-1),observations.at(-1).company)})}</strong></article><article class="peer-insight-card"><span>${_t('peer_quartiles')}</span><strong>${escapeCompanyHtml(quartileText)}</strong></article>` : `<article class="peer-insight-card"><span>${_t('peer_insight_median')}</span><strong>${metadataComparable?_t('trend_currency_warning'):_t('report_metadata_missing')}</strong></article>`}<article class="peer-insight-card"><span>${_t('peer_insight_advice')}</span><strong>${escapeCompanyHtml(guidance)}</strong></article>`;
        } else insightHost.innerHTML = `<article class="peer-insight-card"><span>${_t('peer_insight_coverage')}</span><strong>${_t('peer_insight_no_data')}</strong></article>`;
        decorateResearchTooltips(insightHost);
    }
    if (!periodsForComparison.length) {
        host.innerHTML = `<p class="text-dark-text-muted p-3">${_t(companies.length ? 'comparison_no_metric_data' : 'comparison_empty')}</p>`;
        return;
    }
    const previousByCompany = new Map(periodsForComparison.map(company => {
        const prior = sortedCompanyPeriods(company.periods).filter(item => new Intl.Collator(undefined,{numeric:true,sensitivity:'base'}).compare(item,period) < 0).at(-1);
        return [company.id, prior ? {period:prior, metrics:computeCompanyPeriodMetrics(company,prior)} : null];
    }));
    const metricRows = keys.map(key => definitions.get(key)).filter(Boolean);
    host.innerHTML = `<p class="text-xs text-dark-text-muted mb-2">${_t('comparison_period_note')} ${_t('annualized_metrics_note')}</p><table class="peer-table w-full border-collapse"><thead><tr><th>${_t('comparison_metric_heading')}</th><th>${_t('comparison_unit_heading')}</th>${companies.map(company => {const hasPeriod=Boolean(company.periods[period]);const hasMeta=Boolean(company.periodMeta?.[period]);const meta=companyPeriodMeta(company,period);return `<th><span>${escapeCompanyHtml(company.name)}</span><small>${escapeCompanyHtml([company.ticker,company.currency, _t(`scale_${company.scale || 'units'}`)].filter(Boolean).join(' · '))}</small>${hasPeriod?`<small class="report-meta-badge">${escapeCompanyHtml(hasMeta?localizedPeriodMeta(meta):_t('report_metadata_unknown'))}</small>`:''}</th>`;}).join('')}</tr></thead><tbody>${metricRows.map(item => `<tr><th scope="row"><span>${escapeCompanyHtml(localizedMetricName(item))}</span><details class="metric-guidance"><summary>${_t('financial_guidance_expand')}</summary><p>${_t(`advice_${item.key}`)}</p></details></th><td>${escapeCompanyHtml(localizedMetricUnit(item))}</td>${companies.map(company => {
        const current = company.periods[period] ? computeCompanyPeriodMetrics(company,period)?.find(entry => entry.key === item.key)?.value : NaN;
        const prior = previousByCompany.get(company.id);
        const before = prior?.metrics?.find(entry => entry.key === item.key)?.value;
        const change = Number.isFinite(current) && Number.isFinite(before) ? current-before : NaN;
        const changeText = Number.isFinite(change) ? `<small class="peer-yoy">${formatPeerMetricChange(item,change,company)} <span>${_t('yoy_change_caption',{period:escapeCompanyHtml(prior.period)})}</span></small>` : '';
        return `<td>${Number.isFinite(current) ? `<strong>${formatPeerMetric(item,current,company)}</strong>${changeText}` : `<span class="text-dark-text-muted">${_t('comparison_unavailable')}</span>`}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table>`;
}
function drawCompanyTrendChart() {
    const host = document.getElementById('company-trend-chart');
    const key = document.getElementById('compare-trend-metric')?.value;
    if (!host || !key || !window.Plotly) return;
    const definition = companyMetricDefinitions().find(item => item.key === key);
    if (!definition) return;
    const periods = [...new Set(companyFinancialRecords.flatMap(company => sortedCompanyPeriods(company.periods)))].sort(new Intl.Collator(undefined,{numeric:true,sensitivity:'base'}).compare);
    const selectedIndustry=document.getElementById('compare-industry-select')?.value||'__all__';
    const peerCompanies=selectedIndustry==='__all__'?companyFinancialRecords:companyFinancialRecords.filter(company=>company.industry===selectedIndustry);
    const chartCompanies = peerCompanies.filter(company => sortedCompanyPeriods(company.periods).some(period => computeCompanyPeriodMetrics(company,period)?.some(item => item.key===key && Number.isFinite(item.value))));
    const chartUnits = new Set(chartCompanies.map(company => `${company.currency || '?'}|${company.scale || 'units'}`));
    if (['currency','per share'].includes(definition.unit) && (chartUnits.size > 1 || chartCompanies.some(company=>!company.currency))) {
        Plotly.purge(host); host.innerHTML = `<p class="text-dark-text-muted p-4">${_t('trend_currency_warning')}</p>`; return;
    }
    const traces = peerCompanies.map(company => {
        const x = [], y = [], customdata=[];
        periods.forEach(period => {
            const metric = computeCompanyPeriodMetrics(company,period)?.find(item => item.key === key);
            if (metric && Number.isFinite(metric.value)) { x.push(period); y.push(metric.value); customdata.push(escapeCompanyHtml(localizedPeriodMeta(companyPeriodMeta(company,period)))); }
        });
        return {type:'scatter',mode:'lines+markers',name:company.name,x,y,customdata,connectgaps:false,hovertemplate:`%{x}<br>%{y:.3f}<br>%{customdata}<extra>${escapeCompanyHtml(company.name)}</extra>`};
    }).filter(trace => trace.x.length);
    if (!traces.length) {
        Plotly.purge(host); host.innerHTML = `<p class="text-dark-text-muted p-4">${_t('trend_no_data')}</p>`; return;
    }
    const commonUnit = chartCompanies[0];
    const unitSuffix = ['currency','per share'].includes(definition.unit) ? ` · ${commonUnit.currency} · ${_t(`scale_${commonUnit.scale || 'units'}`)}` : '';
    Plotly.newPlot(host,traces,{title:{text:localizedMetricName(definition),font:{color:'#d1d5db'}},xaxis:{title:{text:_t('trend_axis_period')},color:'#d1d5db',gridcolor:'#374151'},yaxis:{title:{text:`${_t('trend_axis_value')} · ${localizedMetricUnit(definition)}${unitSuffix}`},color:'#d1d5db',gridcolor:'#374151'},plot_bgcolor:'#1f2937',paper_bgcolor:'#111827',font:{color:'#d1d5db'},margin:{t:55,r:20,b:65,l:70},legend:{orientation:'h',y:-.2},autosize:true},{responsive:true,displaylogo:false,modeBarButtonsToRemove:['sendDataToCloud','editInChartStudio']});
}
function addCompanyProfile() {
    const name = cleanCompanyText(document.getElementById('company-name').value);
    if (!name) { setCompanyStatus(_t('company_create_name_required'),'error'); return; }
    const currency=cleanCompanyText(document.getElementById('company-currency').value,12);
    if(!currency){setCompanyStatus(_t('company_currency_required'),'error');return;}
    const draftPeriod=cleanCompanyText(document.getElementById('company-period').value,20);
    const draftValues=currentCompanyEditorTextValues();
    const draftMeta=currentCompanyPeriodMeta();
    const company = {id:createCompanyId(),name,ticker:cleanCompanyText(document.getElementById('company-ticker').value,24),industry:cleanCompanyText(document.getElementById('company-industry').value,60),currency:currency.toUpperCase(),scale:document.getElementById('company-scale').value,periods:{}};
    companyFinancialRecords.push(company);
    if (!persistCompanyFinancialRecords()) { companyFinancialRecords.pop(); return; }
    loadCompanyEditor(company);
    if(draftPeriod){document.getElementById('company-period').value=draftPeriod;loadCompanyPeriodMeta(draftMeta);renderCompanyFinancialFields(draftValues);companyFormDirty=Object.values(draftValues).some(value=>String(value).trim()!=='');}
    refreshCompanyComparison();
    setCompanyStatus(_t('company_created'),'success');
}
function saveCompanyPeriod() {
    const company = companyById();
    if (!company) { setCompanyStatus(_t('company_select_required'),'error'); return; }
    const name = cleanCompanyText(document.getElementById('company-name').value);
    const currency=cleanCompanyText(document.getElementById('company-currency').value,12);
    const period = cleanCompanyText(document.getElementById('company-period').value,20);
    const periodMeta = currentCompanyPeriodMeta();
    if (!name) { setCompanyStatus(_t('company_create_name_required'),'error'); return; }
    if(!currency){setCompanyStatus(_t('company_currency_required'),'error');return;}
    if (!period) { setCompanyStatus(_t('company_period_required'),'error'); return; }
    if (!Number.isInteger(periodMeta.months) || periodMeta.months < 1 || periodMeta.months > 60) { setCompanyStatus(_t('metadata_months_invalid'),'error'); return; }
    const invalid=document.querySelectorAll('[data-company-field]');
    if([...invalid].some(input=>input.value.trim()!==''&&!Number.isFinite(parseLocalizedNumber(input.value)))){setCompanyStatus(_t('company_invalid_numeric'),'error');return;}
    const before = JSON.stringify(company);
    company.name = name;
    company.ticker = cleanCompanyText(document.getElementById('company-ticker').value,24);
    company.industry = cleanCompanyText(document.getElementById('company-industry').value,60);
    company.currency = currency.toUpperCase();
    company.scale = document.getElementById('company-scale').value;
    company.periods[period] = currentCompanyEditorValues();
    company.periodMeta ||= {};
    periodMeta.savedAt=new Date().toISOString();
    company.periodMeta[period] = periodMeta;
    if (!persistCompanyFinancialRecords()) { Object.assign(company,JSON.parse(before)); return; }
    companyFormDirty = false;
    renderCompanyPeriodSelector(period);
    refreshCompanyComparison(period);
    setCompanyStatus(_t('company_period_saved',{company:company.name,period}),'success');
}
async function deleteSelectedCompany() {
    const company = companyById();
    if (!company) { setCompanyStatus(_t('company_select_required'),'error'); return; }
    const result = await Swal.fire({title:_t('warning_title'),text:_t('company_delete_confirm',{company:company.name}),icon:'warning',showCancelButton:true,confirmButtonText:_t('company_delete_button'),cancelButtonText:_t('company_cancel_button')});
    if (!result.isConfirmed) return;
    const oldRecords = companyFinancialRecords;
    companyFinancialRecords = companyFinancialRecords.filter(item => item.id !== company.id);
    if (!persistCompanyFinancialRecords()) { companyFinancialRecords = oldRecords; return; }
    activeCompanyId = '';
    loadCompanyEditor(null);
    refreshCompanyComparison();
    setCompanyStatus(_t('company_deleted'),'success');
}
function exportCompanyFinancialRecords() {
    if (!companyFinancialRecords.length) { setCompanyStatus(_t('company_no_data_export'),'error'); return; }
    const file = new Blob([JSON.stringify({format:'cfa-company-data',version:1,companies:companyFinancialRecords},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a'); anchor.href=url; anchor.download='cfa-company-financials-backup.json'; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    setCompanyStatus(_t('company_export_done'),'success');
}
async function importCompanyFinancialRecords(file) {
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        if (!data || data.format !== 'cfa-company-data' || data.version !== 1 || !Array.isArray(data.companies)) throw new Error('format');
        const imported = sanitizeCompanyFinancialRecords(data.companies);
        if (!imported.length && data.companies.length) throw new Error('records');
        const result = await Swal.fire({title:_t('warning_title'),text:_t('company_import_confirm'),icon:'warning',showCancelButton:true,confirmButtonText:_t('import_company_data_button'),cancelButtonText:_t('company_cancel_button')});
        if (!result.isConfirmed) return;
        const before = companyFinancialRecords;
        companyFinancialRecords = imported;
        if (!persistCompanyFinancialRecords()) { companyFinancialRecords = before; return; }
        activeCompanyId = '';
        loadCompanyEditor(companyFinancialRecords[0] || null);
        refreshCompanyComparison();
        setCompanyStatus(_t('company_import_done',{count:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(imported.length)}),'success');
    } catch (_) { setCompanyStatus(_t('company_import_invalid'),'error'); }
}
let stagedFinancialWorkbookRows = [];
let stagedFinancialWorkbookSource = '';
function normalizeWorkbookHeader(value) { return String(value??'').replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[\s_-]+/g,''); }
function workbookCell(row, aliases) { const keys=Object.keys(row);const key=keys.find(item=>aliases.includes(normalizeWorkbookHeader(item)));return key===undefined?undefined:row[key]; }
async function parseFinancialWorkbook(file) {
    if(!file) throw new Error('missing-file');
    await ensureSpreadsheetLibrary();
    const buffer=await file.arrayBuffer(),workbook=XLSX.read(buffer,{type:'array',cellDates:false}),first=workbook.SheetNames[0];
    if(!first)throw new Error('sheet');
    return XLSX.utils.sheet_to_json(workbook.Sheets[first],{defval:'',raw:false});
}
function workbookFieldId(raw) {
    const field=String(raw??'').trim();
    if(companyFieldIds.includes(field)) return field;
    const normalized=normalizeWorkbookHeader(field);
    return companyFieldIds.find(id=>normalizeWorkbookHeader(id)===normalized || normalizeWorkbookHeader(financialFa.fields[id]||'')===normalized) || '';
}
async function previewFinancialWorkbook() {
    const file=document.getElementById('financial-workbook-file')?.files?.[0], host=document.getElementById('financial-workbook-preview'), apply=document.getElementById('apply-financial-workbook');
    if(!file){host.innerHTML=`<p class="comparison-warning">${_t('workbook_choose')}</p>`;return;}
    try {
        const source=await parseFinancialWorkbook(file), rows=[];
        for(const raw of source){
            const name=cleanCompanyText(String(workbookCell(raw,['company','companyname','name','issuer'])??''),80), period=cleanCompanyText(String(workbookCell(raw,['period','fiscalperiod','year','fiscalyear'])??''),20), field=workbookFieldId(workbookCell(raw,['field','metric','account','statementfield'])), rawValue=workbookCell(raw,['value','amount','reportedvalue']);
            const value=typeof rawValue==='number'?rawValue:parseLocalizedNumber(String(rawValue??''));
            if(!name||!period||!field||!Number.isFinite(value)) continue;
            const monthsRaw=workbookCell(raw,['months','periodmonths','durationmonths']);const months=monthsRaw===''||monthsRaw===undefined?12:Number(parseLocalizedNumber(String(monthsRaw)));
            if(!Number.isInteger(months)||months<1||months>60) continue;
            rows.push({name,period,field,value,ticker:cleanCompanyText(String(workbookCell(raw,['ticker','symbol','identifier'])??''),24),industry:cleanCompanyText(String(workbookCell(raw,['industry','sector','peergroup'])??''),60),currency:cleanCompanyText(String(workbookCell(raw,['currency','currencycode'])??''),12).toUpperCase(),scale:['units','thousands','millions'].includes(String(workbookCell(raw,['scale','unitsscale'])??'').toLowerCase())?String(workbookCell(raw,['scale','unitsscale'])).toLowerCase():'units',months,scope:['separate','consolidated'].includes(String(workbookCell(raw,['scope','basis','reportingscope'])??'').toLowerCase())?String(workbookCell(raw,['scope','basis','reportingscope'])).toLowerCase():'consolidated',status:['audited','reviewed','unaudited','forecast'].includes(String(workbookCell(raw,['status','assurance'])??'').toLowerCase())?String(workbookCell(raw,['status','assurance'])).toLowerCase():'unaudited',opinion:['unmodified','qualified','adverse','disclaimer','not_applicable'].includes(String(workbookCell(raw,['opinion','auditopinion'])??'').toLowerCase())?String(workbookCell(raw,['opinion','auditopinion'])).toLowerCase():'not_applicable',sourcePage:cleanCompanyText(String(workbookCell(raw,['sourcepage','page','note'])??''),40),restated:['true','yes','1','y'].includes(String(workbookCell(raw,['restated','isrestated'])??'').toLowerCase())});
        }
        stagedFinancialWorkbookRows=rows;stagedFinancialWorkbookSource=cleanCompanyText(file.name,160);
        const groups=new Set(rows.map(row=>`${row.name}|${row.period}`)), companies=new Set(rows.map(row=>row.name));
        const invalid=source.length-rows.length;
        host.innerHTML=`<p class="text-sm text-dark-text-muted my-2">${_t('workbook_preview_result',{valid:rows.length,skipped:Math.max(0,invalid),companies:companies.size,periods:groups.size})}</p>${rows.length?`<div class="overflow-x-auto"><table class="peer-table workbook-preview-table"><thead><tr><th>${_t('workbook_company')}</th><th>${_t('workbook_period_col')}</th><th>${_t('workbook_field')}</th><th>${_t('workbook_value')}</th><th>${_t('workbook_status')}</th></tr></thead><tbody>${rows.slice(0,20).map(row=>`<tr><td>${escapeCompanyHtml(row.name)}</td><td>${escapeCompanyHtml(row.period)}</td><td>${escapeCompanyHtml(row.field)}</td><td>${escapeCompanyHtml(row.value)}</td><td>${escapeCompanyHtml(_t(`assurance_${row.status}`))}</td></tr>`).join('')}</tbody></table></div><p class="report-basis-footnote">${_t('workbook_rows_sample')}</p>`:''}`;
        apply.disabled=!rows.length;
    } catch(error){stagedFinancialWorkbookRows=[];apply.disabled=true;host.innerHTML=`<p class="comparison-warning">${_t(error.message==='xlsx-unavailable'?'workbook_no_xlsx':'workbook_invalid')}</p>`;}
}
function applyFinancialWorkbook() {
    const rows=stagedFinancialWorkbookRows;
    if(!rows.length)return;
    if(!window.confirm(_t('workbook_apply_confirm',{count:rows.length})))return;
    const before=JSON.stringify(companyFinancialRecords), byName=new Map(companyFinancialRecords.map(company=>[`${company.name.toLowerCase()}|${company.currency}`,company]));
    for(const row of rows){
        const mapKey=`${row.name.toLowerCase()}|${row.currency}`;
        let company=byName.get(mapKey);
        if(!company){company={id:createCompanyId(),name:row.name,ticker:row.ticker,industry:row.industry,currency:row.currency,scale:row.scale,periods:{},periodMeta:{}};companyFinancialRecords.push(company);byName.set(mapKey,company);}
        if(!company.ticker&&row.ticker)company.ticker=row.ticker;if(!company.currency&&row.currency)company.currency=row.currency;if(!company.industry&&row.industry)company.industry=row.industry;
        company.periods[row.period]||={};company.periods[row.period][row.field]=row.value;company.periodMeta||={};company.periodMeta[row.period]={months:row.months,scope:row.scope,status:row.status,opinion:row.opinion,sourceFile:stagedFinancialWorkbookSource,sourcePage:row.sourcePage,restated:row.restated};
    }
    if(!persistCompanyFinancialRecords()){companyFinancialRecords=sanitizeCompanyFinancialRecords(JSON.parse(before));return;}
    stagedFinancialWorkbookRows=[];stagedFinancialWorkbookSource='';document.getElementById('apply-financial-workbook').disabled=true;refreshCompanyComparison();
    const host=document.getElementById('financial-workbook-preview');host.insertAdjacentHTML('afterbegin',`<p class="text-green-300 my-2">${_t('workbook_done',{count:rows.length})}</p>`);
}
function downloadFinancialWorkbookTemplate() {
    const headers=['company','ticker','industry','currency','scale','period','field','value','months','scope','status','opinion','source_page','restated'];
    const csv=headers.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})),anchor=document.createElement('a');anchor.href=url;anchor.download='financial-analysis-import-template.csv';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function initializeCompanyComparison() {
    const companySelect = document.getElementById('company-select');
    const periodSelect = document.getElementById('company-period-select');
    const nameInput = document.getElementById('company-name');
    if (!companySelect) return;
    renderCompanyFinancialFields({});
    renderCompanySelector();
    const first = companyFinancialRecords[0] || null;
    if (first) loadCompanyEditor(first);
    document.getElementById('create-company-button').addEventListener('click',addCompanyProfile);
    document.getElementById('prefill-codal-report-button').addEventListener('click',prefillAttachedCodalReport);
    document.getElementById('save-company-period-button').addEventListener('click',saveCompanyPeriod);
    document.getElementById('delete-company-button').addEventListener('click',deleteSelectedCompany);
    document.getElementById('copy-current-financials-button').addEventListener('click',() => { if(!companyById()){setCompanyStatus(_t('company_select_required'),'error');return;} const values={}; companyFieldIds.forEach(id=>{const input=document.getElementById(`financial-${id}`);if(input)values[id]=input.value;});renderCompanyFinancialFields(values);companyFormDirty=true;setCompanyStatus(_t('company_copy_success'),'success'); });
    document.getElementById('load-company-period-button').addEventListener('click',() => { const company=companyById();const period=periodSelect.value;if(!company||!period||period==='__new__'||!company.periods[period]){setCompanyStatus(_t('company_load_missing'),'error');return;}companyFieldIds.forEach(id=>{const input=document.getElementById(`financial-${id}`);if(input)input.value=company.periods[period][id]??'';});document.getElementById('financial-period-months').value=companyPeriodMeta(company,period).months;calculateFinancialStrategyMetrics(); });
    document.getElementById('export-company-data-button').addEventListener('click',exportCompanyFinancialRecords);
    document.getElementById('import-company-data-button').addEventListener('click',() => document.getElementById('import-company-data-file').click());
    document.getElementById('import-company-data-file').addEventListener('change',event => { importCompanyFinancialRecords(event.target.files?.[0]); event.target.value=''; });
    companySelect.addEventListener('change',() => {
        if (companyFormDirty && !window.confirm(_t('company_unsaved_confirm'))) { companySelect.value=activeCompanyId; return; }
        loadCompanyEditor(companyById(companySelect.value)); refreshCompanyComparison();
    });
    periodSelect.addEventListener('change',() => {
        if (companyFormDirty && !window.confirm(_t('company_unsaved_confirm'))) { renderCompanyPeriodSelector(document.getElementById('company-period').value); return; }
        const company=companyById(); const selected=periodSelect.value;
        document.getElementById('company-period').value=selected==='__new__'?'':selected;
        loadCompanyPeriodMeta(selected==='__new__'?{}:companyPeriodMeta(company,selected));
        renderCompanyFinancialFields(selected==='__new__'?{}:(company?.periods[selected]||{}));
        companyFormDirty=false;
    });
    [nameInput,document.getElementById('company-ticker'),document.getElementById('company-industry'),document.getElementById('company-currency'),document.getElementById('company-scale'),document.getElementById('company-period')].forEach(input => input.addEventListener('input',() => { if(activeCompanyId){companyFormDirty=true;setCompanyStatus(_t('company_unsaved_status'));} }));
    document.getElementById('company-scale').addEventListener('change',() => { if(activeCompanyId){companyFormDirty=true;setCompanyStatus(_t('company_unsaved_status'));} });
    ['company-period-months','company-reporting-basis','company-assurance-status','company-audit-opinion','company-source-document','company-source-page','company-restated'].forEach(id => document.getElementById(id).addEventListener('input',() => { if(activeCompanyId){companyFormDirty=true;setCompanyStatus(_t('company_unsaved_status'));} }));
    ['company-reporting-basis','company-assurance-status','company-audit-opinion','company-restated'].forEach(id => document.getElementById(id).addEventListener('change',() => { if(activeCompanyId){companyFormDirty=true;setCompanyStatus(_t('company_unsaved_status'));} }));
    document.getElementById('compare-period-select').addEventListener('change',renderCompanyComparisonTable);
    document.getElementById('compare-group-select').addEventListener('change',() => {renderComparisonMetricSelector();renderCompanyComparisonTable();drawCompanyTrendChart();});
    document.getElementById('compare-trend-metric').addEventListener('change',() => {renderCompanyComparisonTable();drawCompanyTrendChart();});
    document.getElementById('compare-industry-select').addEventListener('change',() => {renderCompanyComparisonTable();drawCompanyTrendChart();});
    document.getElementById('company-source-pdf').addEventListener('change',event=>{const file=event.target.files?.[0];if(!file)return;document.getElementById('company-source-document').value=cleanCompanyText(file.name,160);event.target.value='';if(activeCompanyId){companyFormDirty=true;setCompanyStatus(_t('company_unsaved_status'));}});
    refreshCompanyComparison();
    document.getElementById('preview-financial-workbook').addEventListener('click',previewFinancialWorkbook);
    document.getElementById('apply-financial-workbook').addEventListener('click',applyFinancialWorkbook);
    document.getElementById('download-financial-template').addEventListener('click',downloadFinancialWorkbookTemplate);
}
function redrawCompanyComparisonForLanguageChange() {
    if (!document.getElementById('company-select')) return;
    const values=currentCompanyEditorTextValues();
    renderCompanyFinancialFields(values);
    renderCompanySelector();
    const company=companyById();
    renderCompanyPeriodSelector(document.getElementById('company-period').value);
    renderComparisonMetricSelector();
    renderComparisonPeriodSelector();
    renderIndustryPeerSelector();
    renderCompanyComparisonTable();
    drawCompanyTrendChart();
    document.getElementById('company-data-status').textContent=companyFormDirty?_t('company_unsaved_status'):(company?_t('company_records_loaded',{company:company.name,count:new Intl.NumberFormat(currentLang==='fa'?'fa-IR':'en-US').format(sortedCompanyPeriods(company.periods).length)}):_t('company_data_empty'));
}

Object.assign(texts, {
  company_actions_label:{en:'Company data actions',fa:'عملیات داده‌های شرکت'},company_setup_actions_label:{en:'Company and period setup',fa:'تعریف شرکت و دوره'},company_workflow_actions_label:{en:'Analysis workflow',fa:'گردش‌کار تحلیل'},company_data_actions_label:{en:'Company data management',fa:'مدیریت داده‌های شرکت'},company_setup_actions_title:{en:'Company & period',fa:'شرکت و دوره مالی'},company_workflow_actions_title:{en:'Analysis workflow',fa:'گردش‌کار تحلیل'},company_data_actions_title:{en:'Data management',fa:'مدیریت داده‌ها'}
});

// --- Advanced financial models ---
function modelNumber(id) {
    const element = document.getElementById(id);
    if (!element || element.value.trim() === '') return NaN;
    return element.type === 'number' ? Number(element.value) : parseLocalizedNumber(element.value);
}
function modelFormat(value, digits = 2) {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat(currentLang === 'fa' ? 'fa-IR' : 'en-US', {maximumFractionDigits:digits, minimumFractionDigits:digits}).format(value);
}
function modelPercent(value, digits = 2) { return Number.isFinite(value) ? `${modelFormat(value * 100, digits)}%` : '—'; }
function setModelStatus(id, message, kind = 'info') {
    const el = document.getElementById(id); if (!el) return;
    el.textContent = message; el.dataset.state = kind;
}
function calculateCapitalBudget() {
    const raw = document.getElementById('capital-cashflows')?.value || '';
    const flows = raw.split(/[\n;\t]+/).map(s => parseLocalizedNumber(s.trim())).filter(Number.isFinite);
    const freq = ({annual:1,quarterly:4,monthly:12})[document.getElementById('capital-period')?.value] || 1;
    const annualDiscount = modelNumber('capital-discount-rate') / 100;
    const annualReinvest = modelNumber('capital-reinvest-rate') / 100;
    const valid = flows.length >= 2 && flows.some(v => v < 0) && flows.some(v => v > 0) && Number.isFinite(annualDiscount) && annualDiscount > -1 && Number.isFinite(annualReinvest) && annualReinvest > -1;
    if (!valid) {
        ['capital-npv-result','capital-irr-result','capital-mirr-result','capital-pi-result','capital-payback-result','capital-discounted-payback-result','capital-eaa-result'].forEach(id => {const e=document.getElementById(id);if(e)e.textContent='—';});
        setModelStatus('capital-budget-status', _t('capital_invalid'), 'error');
        if (window.Plotly) Plotly.purge('capital-budget-chart'); return;
    }
    const n=flows.length-1, periodicRate=Math.pow(1+annualDiscount,1/freq)-1, periodicReinvest=Math.pow(1+annualReinvest,1/freq)-1;
    const discounted=flows.map((v,i)=>v/Math.pow(1+periodicRate,i));
    const npv=discounted.reduce((a,b)=>a+b,0), positivePV=discounted.slice(1).filter(v=>v>0).reduce((a,b)=>a+b,0);
    const pi=flows[0]<0?positivePV/Math.abs(flows[0]):NaN;
    function npvAtGross(g) { return flows.reduce((sum,cf,t)=>sum+cf/Math.pow(g,t),0); }
    // Scan logarithmically in gross periodic return, then bisect each sign-changing bracket.
    const roots=[]; let prevG=0.0001, prev=npvAtGross(prevG);
    for(let i=1;i<=1800;i++) {
        const g=0.0001*Math.pow(1000000,i/1800), value=npvAtGross(g);
        if(Number.isFinite(prev)&&Number.isFinite(value)&&prev*value<0) {
            let lo=prevG,hi=g,flo=prev;
            for(let j=0;j<70;j++){const mid=(lo+hi)/2,fmid=npvAtGross(mid);if(flo*fmid<=0)hi=mid;else{lo=mid;flo=fmid;}}
            const annual=(Math.pow((lo+hi)/2,freq)-1)*100;
            if(Number.isFinite(annual)&&!roots.some(r=>Math.abs(r-annual)<1e-5))roots.push(annual);
        }
        prevG=g;prev=value;
    }
    let pvNeg=0,fvPos=0;flows.forEach((cf,t)=>{if(cf<0)pvNeg+=cf/Math.pow(1+periodicRate,t);if(cf>0)fvPos+=cf*Math.pow(1+periodicReinvest,n-t);});
    const mirr=pvNeg<0&&fvPos>0?(Math.pow(fvPos/-pvNeg,1/n)-1):NaN;
    function payback(values) {let cumulative=0;for(let t=0;t<values.length;t++){const before=cumulative;cumulative+=values[t];if(cumulative>=0&&t>0&&values[t]>0)return (t-1)+(-before/values[t]);}return NaN;}
    const nominalPayback=payback(flows), discountedPayback=payback(discounted);
    const eaa=Math.abs(periodicRate)<1e-10?npv/n:npv*periodicRate/(1-Math.pow(1+periodicRate,-n));
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    set('capital-npv-result',modelFormat(npv)); set('capital-irr-result',roots.length?roots.map(r=>`${modelFormat(r)}%`).join(' / '):_t('capital_no_irr'));
    set('capital-mirr-result',modelPercent((Math.pow(1+mirr,freq)-1))); set('capital-pi-result',modelFormat(pi,3));
    set('capital-payback-result',Number.isFinite(nominalPayback)?`${modelFormat(nominalPayback,2)} ${_t(`capital_period_${freq}`)}`:_t('capital_not_recovered'));
    set('capital-discounted-payback-result',Number.isFinite(discountedPayback)?`${modelFormat(discountedPayback,2)} ${_t(`capital_period_${freq}`)}`:_t('capital_not_recovered'));
    set('capital-eaa-result',modelFormat(eaa));
    setModelStatus('capital-budget-status', roots.length>1?_t('capital_multiple_irr',{count:roots.length}):roots.length===0?_t('capital_no_irr_hint'):_t('capital_calculated'), roots.length>1?'warning':'success');
    const host=document.getElementById('capital-budget-chart');
    if(host&&window.Plotly){
        const cumulative=[],cumDiscounted=[];flows.forEach((v,i)=>{cumulative.push((cumulative.at(-1)||0)+v);cumDiscounted.push((cumDiscounted.at(-1)||0)+discounted[i]);});
        const periods=flows.map((_,i)=>`${_t('capital_t')} ${i}`);
        Plotly.react(host,[{type:'bar',name:_t('capital_flow'),x:periods,y:flows,marker:{color:flows.map(x=>x<0?'#fb7185':'#4ade80')},hovertemplate:'%{x}<br>%{y:,.2f}<extra></extra>'},{type:'scatter',mode:'lines+markers',name:_t('capital_cumulative'),x:periods,y:cumulative,line:{color:'#60a5fa',width:3},yaxis:'y2'},{type:'scatter',mode:'lines',name:_t('capital_cumulative_pv'),x:periods,y:cumDiscounted,line:{color:'#c084fc',dash:'dot'},yaxis:'y2'}],{margin:{t:28,r:22,b:55,l:65},legend:{orientation:'h',y:-.3},xaxis:{color:'#a9bbca',gridcolor:'#283b4f'},yaxis:{title:_t('capital_flow'),color:'#a9bbca',gridcolor:'#283b4f'},yaxis2:{title:_t('capital_cumulative'),overlaying:'y',side:'right',showgrid:false,color:'#a9bbca'},paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{color:'#dce8f2'},autosize:true},{responsive:true,displaylogo:false,modeBarButtonsToRemove:['sendDataToCloud','editInChartStudio']});
    }
}
function calculateWaccModel() {
    const E=modelNumber('wacc-equity-value'),D=modelNumber('wacc-debt-value'),P=modelNumber('wacc-preferred-value');
    const re=modelNumber('wacc-cost-equity')/100,rd=modelNumber('wacc-cost-debt')/100,rp=modelNumber('wacc-cost-preferred')/100,tax=modelNumber('wacc-tax')/100,total=E+D+P;
    const valid=[E,D,P,re,rd,rp,tax].every(Number.isFinite)&&E>=0&&D>=0&&P>=0&&total>0&&tax>=0&&tax<=1;
    if(!valid){['wacc-result','wacc-equity-weight-result','wacc-debt-weight-result','wacc-preferred-weight-result'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='—';});setModelStatus('wacc-status',_t('wacc_invalid'),'error');return;}
    const weights=[E/total,D/total,P/total],wacc=weights[0]*re+weights[1]*rd*(1-tax)+weights[2]*rp;
    document.getElementById('wacc-result').textContent=modelPercent(wacc);
    ['wacc-equity-weight-result','wacc-debt-weight-result','wacc-preferred-weight-result'].forEach((id,i)=>document.getElementById(id).textContent=modelPercent(weights[i]));
    setModelStatus('wacc-status',_t('wacc_calculated'),'success');
}
function normalPdf(x){return Math.exp(-.5*x*x)/Math.sqrt(2*Math.PI);}
function normalCdf(x){const z=Math.abs(x),t=1/(1+.2316419*z),poly=t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));const p=1-normalPdf(z)*poly;return x>=0?p:1-p;}
function calculateOptionModel() {
    const S=modelNumber('option-spot'),K=modelNumber('option-strike'),T=modelNumber('option-maturity'),r=modelNumber('option-rate')/100,q=modelNumber('option-dividend')/100,sigma=modelNumber('option-volatility')/100;
    if(![S,K,T,r,q,sigma].every(Number.isFinite)||S<=0||K<=0||T<=0||sigma<=0){['option-call-result','option-put-result','option-call-delta','option-put-delta','option-gamma','option-vega','option-call-theta','option-put-theta','option-call-rho','option-put-rho'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='—';});setModelStatus('option-status',_t('options_invalid'),'error');if(window.Plotly)Plotly.purge('option-payoff-chart');return;}
    const root=sigma*Math.sqrt(T),d1=(Math.log(S/K)+(r-q+.5*sigma*sigma)*T)/root,d2=d1-root,dfq=Math.exp(-q*T),dfr=Math.exp(-r*T),n1=normalCdf(d1),n2=normalCdf(d2),phi=normalPdf(d1);
    const call=S*dfq*n1-K*dfr*n2,put=K*dfr*normalCdf(-d2)-S*dfq*normalCdf(-d1),callDelta=dfq*n1,putDelta=dfq*(n1-1),gamma=dfq*phi/(S*root),vega=S*dfq*phi*Math.sqrt(T)/100;
    const callTheta=(-S*dfq*phi*sigma/(2*Math.sqrt(T))-r*K*dfr*n2+q*S*dfq*n1),putTheta=(-S*dfq*phi*sigma/(2*Math.sqrt(T))+r*K*dfr*normalCdf(-d2)-q*S*dfq*normalCdf(-n1));
    const callRho=K*T*dfr*n2/100,putRho=-K*T*dfr*normalCdf(-d2)/100;
    const values={'option-call-result':call,'option-put-result':put,'option-call-delta':callDelta,'option-put-delta':putDelta,'option-gamma':gamma,'option-vega':vega,'option-call-theta':callTheta,'option-put-theta':putTheta,'option-call-rho':callRho,'option-put-rho':putRho};
    Object.entries(values).forEach(([id,v])=>document.getElementById(id).textContent=modelFormat(v,4));setModelStatus('option-status',_t('options_calculated'),'success');
    const host=document.getElementById('option-payoff-chart');if(host&&window.Plotly){const spots=Array.from({length:81},(_,i)=>S*(.2+i*1.6/80)),calls=spots.map(x=>{const a=(Math.log(x/K)+(r-q+.5*sigma*sigma)*T)/root,b=a-root;return x*dfq*normalCdf(a)-K*dfr*normalCdf(b);}),puts=spots.map(x=>{const a=(Math.log(x/K)+(r-q+.5*sigma*sigma)*T)/root,b=a-root;return K*dfr*normalCdf(-b)-x*dfq*normalCdf(-a);});Plotly.react(host,[{type:'scatter',mode:'lines',name:_t('option_call'),x:spots,y:calls,line:{color:'#4ade80',width:3}},{type:'scatter',mode:'lines',name:_t('option_put'),x:spots,y:puts,line:{color:'#60a5fa',width:3}},{type:'scatter',mode:'lines',name:_t('option_intrinsic_call'),x:spots,y:spots.map(x=>Math.max(x-K,0)),line:{color:'#86efac',dash:'dot'}},{type:'scatter',mode:'lines',name:_t('option_intrinsic_put'),x:spots,y:spots.map(x=>Math.max(K-x,0)),line:{color:'#93c5fd',dash:'dot'}}],{margin:{t:25,r:20,b:55,l:60},legend:{orientation:'h',y:-.3},xaxis:{title:_t('option_spot'),color:'#a9bbca',gridcolor:'#283b4f'},yaxis:{title:_t('option_value'),color:'#a9bbca',gridcolor:'#283b4f'},paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{color:'#dce8f2'},autosize:true},{responsive:true,displaylogo:false});}
}

// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Language
    const languageSelect = document.getElementById('lang-select');
    try { currentLang = localStorage.getItem('preferredLang') === 'fa' ? 'fa' : 'en'; } catch (_) { currentLang = 'en'; }
    try { currentTheme = localStorage.getItem('preferredTheme') === 'light' ? 'light' : 'dark'; } catch (_) { currentTheme = 'dark'; }
    setAppTheme(currentTheme);
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        setAppTheme(currentTheme === 'dark' ? 'light' : 'dark');
        try { localStorage.setItem('preferredTheme', currentTheme); } catch (_) {}
    });
    if (languageSelect) {
        languageSelect.value = currentLang;
        languageSelect.addEventListener('change', () => {
            currentLang = languageSelect.value === 'fa' ? 'fa' : 'en';
            try { localStorage.setItem('preferredLang', currentLang); } catch (_) {}
            updateLanguageUI();
            updateDataDisplay(); updateMarketDataDisplay(); updateBenchmarkDataDisplay();
            updatePortfolioAssetUI(); renderFinancialInputs(); redrawCompanyComparisonForLanguageChange();
            if (lastTradingViewQuote) renderTradingViewQuote(lastTradingViewQuote, document.getElementById('tradingview-symbol')?.value || '');
            if (financialMetrics) { renderFinancialResults(); drawFinancialChart(); const get=id=>{const field=document.getElementById(`financial-${id}`);return field&&field.value.trim()!==''?parseLocalizedNumber(field.value):NaN;};renderFinancialQualityChecks(get,Number(document.getElementById('financial-period-months')?.value)||12);renderAnalystDashboard(get); }
            calculateTimeValueModel(); calculateAssetPricingModels(); calculateCapitalBudget(); calculateWaccModel(); calculateOptionModel();
            if (statusBar && statusBar.dataset.statusKey) updateStatus(statusBar.dataset.statusKey, {}, statusBar.dataset.statusType || 'info');
            decorateResearchTooltips(document);
        });
    }
    updateLanguageUI();
    initializeCompanyComparison();

    const tvmControls = ['tvm-target','tvm-pv','tvm-pmt','tvm-fv','tvm-rate','tvm-years','tvm-frequency','tvm-timing'];
    tvmControls.forEach(id => document.getElementById(id)?.addEventListener('input',calculateTimeValueModel));
    tvmControls.filter(id => ['tvm-target','tvm-frequency','tvm-timing'].includes(id)).forEach(id => document.getElementById(id)?.addEventListener('change',calculateTimeValueModel));
    document.getElementById('calculate-tvm-button')?.addEventListener('click',calculateTimeValueModel);
    document.getElementById('reset-tvm-button')?.addEventListener('click',() => {
        const defaults={'tvm-target':'fv','tvm-pv':'10000','tvm-pmt':'500','tvm-fv':'25000','tvm-rate':'8','tvm-years':'10','tvm-frequency':'12','tvm-timing':'end'};
        Object.entries(defaults).forEach(([id,value])=>{const control=document.getElementById(id);if(control)control.value=value;});
        calculateTimeValueModel();
    });
    ['pricing-rf','pricing-market-return','pricing-market-beta','apt-premium-1','apt-premium-2','apt-premium-3','apt-beta-1','apt-beta-2','apt-beta-3'].forEach(id=>document.getElementById(id)?.addEventListener('input',calculateAssetPricingModels));
    document.getElementById('calculate-pricing-button')?.addEventListener('click',calculateAssetPricingModels);
    const capitalControls=['capital-cashflows','capital-discount-rate','capital-reinvest-rate','capital-period'];
    capitalControls.forEach(id=>document.getElementById(id)?.addEventListener('input',calculateCapitalBudget));
    document.getElementById('capital-period')?.addEventListener('change',calculateCapitalBudget);
    document.getElementById('calculate-capital-budget-button')?.addEventListener('click',calculateCapitalBudget);
    document.getElementById('reset-capital-budget-button')?.addEventListener('click',()=>{document.getElementById('capital-cashflows').value='-100000\n30000\n35000\n40000\n45000';document.getElementById('capital-discount-rate').value='10';document.getElementById('capital-reinvest-rate').value='8';document.getElementById('capital-period').value='annual';calculateCapitalBudget();});
    ['wacc-equity-value','wacc-debt-value','wacc-preferred-value','wacc-cost-equity','wacc-cost-debt','wacc-cost-preferred','wacc-tax'].forEach(id=>document.getElementById(id)?.addEventListener('input',calculateWaccModel));
    ['option-spot','option-strike','option-maturity','option-rate','option-dividend','option-volatility'].forEach(id=>document.getElementById(id)?.addEventListener('input',calculateOptionModel));
    calculateTimeValueModel(); calculateAssetPricingModels(); calculateCapitalBudget(); calculateWaccModel(); calculateOptionModel();

    // Tab Navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    const fundamentalSideMenu=document.getElementById('fundamental-side-nav');
    fundamentalSideMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
        fundamentalSideMenu.querySelectorAll('a').forEach(item=>{item.classList.toggle('active',item===link);if(item===link)item.setAttribute('aria-current','location');else item.removeAttribute('aria-current');});
    }));
    window.addEventListener('resize',()=>syncFundamentalSidebar());
    syncFundamentalSidebar();

    // Asset Data
    if (addButton) addButton.addEventListener('click', addAssetDataPoint);
    if (valueEntry) valueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addAssetDataPoint(); } });
    if (editSelect) editSelect.addEventListener('change', loadValueForEditFromMenu);
    if (saveEditButton) saveEditButton.addEventListener('click', saveEditedValue);
    if (editValueEntry) editValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveEditedValue(); } });
    if (deleteButton) deleteButton.addEventListener('click', deleteSelectedData);
    if (clearListButton) clearListButton.addEventListener('click', clearAssetDataList);
    setupDragAndDrop(dedicatedFileDropAreaAsset, fileImporterInputAsset, dataPoints, 'data_list_title', 'add_data_title', updateDataDisplay);

    // Market Data
    if (addMarketDataButton) addMarketDataButton.addEventListener('click', addMarketDataPoint);
    if (marketValueEntry) marketValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMarketDataPoint(); } });
    if (clearMarketDataButton) clearMarketDataButton.addEventListener('click', clearMarketDataPoints);

    // Benchmark Data
    if (addBenchmarkDataButton) addBenchmarkDataButton.addEventListener('click', addBenchmarkDataPoint);
    if (benchmarkValueEntry) benchmarkValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addBenchmarkDataPoint(); } });
    if (clearBenchmarkDataButton) clearBenchmarkDataButton.addEventListener('click', clearBenchmarkDataPoints);

    // Equity Valuation
    if (calculateEquityButton) calculateEquityButton.addEventListener('click', calculateEquityValuation);

    // Fixed Income
    if (calculateBondButton) calculateBondButton.addEventListener('click', calculateFixedIncome);
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.addEventListener('click', () => plotActionWrapper(plotBondPriceYieldCurveLogic, 'bond_price_yield_plot_title'));

    // Financial Strategy Analysis
    renderFinancialInputs();
    const quoteButton = document.getElementById('fetch-tradingview-quote');
    const quotePriceButton = document.getElementById('apply-tradingview-price');
    const quoteSymbolInput = document.getElementById('tradingview-symbol');
    if (quoteButton) quoteButton.addEventListener('click', fetchTradingViewQuote);
    if (quotePriceButton) quotePriceButton.addEventListener('click', applyTradingViewPrice);
    if (quoteSymbolInput) quoteSymbolInput.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); fetchTradingViewQuote(); } });
    const calculateFinancialButton = document.getElementById('calculate-financial-strategy');
    if (calculateFinancialButton) calculateFinancialButton.addEventListener('click', calculateFinancialStrategyMetrics);
    const runDcfButton=document.getElementById('run-dcf-button');if(runDcfButton)runDcfButton.addEventListener('click',runScenarioDCF);
    document.querySelectorAll('[data-dcf],#dcf-years,#dcf-tax,#dcf-nwc-sales,#dcf-capex-sales,#dcf-da-sales,#dcf-risk-free,#dcf-beta,#dcf-erp,#dcf-cost-debt,#dcf-preferred-claim,#dcf-preferred-cost,#dcf-minority-claim,#dcf-other-claim,#dcf-use-derived-wacc').forEach(input=>input.addEventListener('input',invalidateDcfResults));
    document.getElementById('dcf-use-derived-wacc')?.addEventListener('change',()=>{invalidateDcfResults();if(document.getElementById('dcf-wacc-status'))document.getElementById('dcf-wacc-status').textContent=document.getElementById('dcf-use-derived-wacc').checked?_t('dcf_wacc_missing'):_t('dcf_wacc_manual_note');});
    document.getElementById('financial-period-months')?.addEventListener('input',()=>{financialMetrics=null;const result=document.getElementById('financial-results');if(result)result.textContent=currentLang==='fa'?'طول دوره تغییر کرده است؛ محاسبات را دوباره اجرا کنید.':'Reporting period changed; calculate again to refresh results.';const quality=document.getElementById('financial-quality-checks');if(quality)quality.textContent=currentLang==='fa'?'دوره تغییر کرده است؛ محاسبات را دوباره اجرا کنید.':'Reporting period changed; recalculate diagnostics.';const dcf=document.getElementById('dcf-results');if(dcf)dcf.textContent=currentLang==='fa'?'دوره تغییر کرده است؛ DCF را دوباره اجرا کنید.':'Reporting period changed; rerun DCF.';if(window.Plotly){Plotly.purge('financial-chart');Plotly.purge('dcf-chart');}});
    document.getElementById('financial-period-months')?.addEventListener('input',()=>{const notes=document.getElementById('analyst-review-notes');if(notes)notes.innerHTML=`<p>${_t('analyst_stale')}</p>`;const status=document.getElementById('analyst-data-status');if(status)status.textContent=_t('analyst_stale');const sensitivity=document.getElementById('dcf-sensitivity');if(sensitivity)sensitivity.replaceChildren();});
    const financialChartGroupSelect = document.getElementById('financial-chart-group');
    if (financialChartGroupSelect) financialChartGroupSelect.addEventListener('change', drawFinancialChart);
    document.getElementById('financial-flow-basis')?.addEventListener('change',()=>{if(financialMetrics)calculateFinancialStrategyMetrics();});

    // Portfolio Management
    if (addPortfolioAssetButton) addPortfolioAssetButton.addEventListener('click', addPortfolioAsset);
    if (calculatePortfolioButton) calculatePortfolioButton.addEventListener('click', calculatePortfolioManagement);

    // Calculate (Asset Analysis)
    if (calculateButton) calculateButton.addEventListener('click', calculateMetrics);
    document.getElementById('return-frequency')?.addEventListener('change', () => { if (dataPoints.length >= 2) calculateMetrics(); });

    // Initial setup for Portfolio Management tab
    if (portfolioAssetsContainer) {
        portfolioAssetsContainer.addEventListener('change', event => {
            const input = event.target.closest('[data-portfolio-asset-id][data-portfolio-field]');
            if (input) updatePortfolioAssetData(Number(input.dataset.portfolioAssetId),input.dataset.portfolioField,input.value);
            const correlation = event.target.closest('[data-portfolio-correlation]');
            if (correlation) {
                const [assetId,otherId] = correlation.dataset.portfolioCorrelation.split(':').map(Number);
                updatePortfolioAssetCorrelation(assetId,otherId,correlation.value);
            }
        });
        portfolioAssetsContainer.addEventListener('click', event => {
            const button = event.target.closest('[data-remove-portfolio-asset]');
            if (button) removePortfolioAsset(Number(button.dataset.removePortfolioAsset));
        });
    }
    if (portfolioAssets.length === 0) {
        addPortfolioAsset(); // Add first asset
        addPortfolioAsset(); // Add second asset
    }
    updatePortfolioAssetUI();

    // Plot Buttons (Asset Analysis)
    const plotButtonConfigs = [
        { el: plotHistButton, func: plotHistogramLogic, title: 'plot_hist_title' },
        { el: plotBoxButton, func: plotBoxplotLogic, title: 'plot_box_title' },
        { el: plotEquityButton, func: plotEquityCurveLogic, title: 'plot_equity_title' },
        { el: plotQqButton, func: plotQqplotLogic, title: 'plot_qq_title' },
        { el: plotRegressionButton, func: plotRegressionLogic, title: 'plot_regression_title' }
    ];
    plotButtonConfigs.forEach(cfg => {
        if (cfg.el) cfg.el.addEventListener('click', () => plotActionWrapper(cfg.func, cfg.title));
    });

    // Export
    if (exportResultsButton) exportResultsButton.addEventListener('click', async () => {
        const { value: format } = await Swal.fire({ title: _t('export_format_title'), input: 'select', inputOptions: { 'txt': _t('export_txt'), 'excel': _t('export_excel')}, inputPlaceholder: _t('select_option'), showCancelButton: true, confirmButtonText: _t('ok_button'), cancelButtonText: _t('cancel_button'),customClass: { popup: 'swal2-popup', title: 'swal2-title', input: 'swal2-input', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'} });
        if (format === 'txt') exportResultsToTxtFile();
        else if (format === 'excel') exportResultsToExcelFile();
        else if (format) updateStatus('status_save_cancel', {}, 'info');
    });

    // Modal
    if (plotModalCloseButton) plotModalCloseButton.addEventListener('click', closeModalHandler);
    if (plotModal) {
        plotModal.addEventListener('click', backdropClickHandler); // For clicking outside
        // Ensure escape key listener is added when modal is shown, removed when hidden
        // This is now handled inside plotActionWrapper and closeModal
    }

    // Initial UI State
    updateEditControlsState();
    updateActionButtonsState();
    resetResultsDisplay(); // Important to show N/A initially
    updateDataDisplay(); // Show "List Empty" for asset data
    updateMarketDataDisplay(); // Show "List Empty" for market data
    updateBenchmarkDataDisplay(); // Show "List Empty" for benchmark data
    resetEquityResultsDisplay();
    resetFixedIncomeResultsDisplay();
    resetPortfolioResultsDisplay();
    decorateResearchTooltips(document);
    initializeSweetAlertTooltips();
    updateStatus('status_ready');
    console.log("Application initialized.");
});

    // Add missing item prefix keys for generic display
    texts['market_data_item_prefix'] = { 'en': 'Market {index}:' };
    texts['benchmark_data_item_prefix'] = { 'en': 'Benchmark {index}:' };
    texts['correlations_title'] = { 'en': 'Correlations:' };
    texts['delete_data_point_confirm'] = { 'en': 'Delete data point {index}?' };

// --- Advanced Statistical Functions (using simple-statistics) ---
function calculateSkewness(data) {
    if (!data || data.length < 3) return NaN;
    if (typeof ss === 'undefined' || typeof ss.skewness === 'undefined') {
        console.error("simple-statistics (ss) is not loaded or skewness function is missing.");
        return NaN;
    }
    try { return ss.skewness(data); } catch (e) { console.error("Error calculating skewness:", e); return NaN; }
}

function calculateKurtosis(data) {
    if (!data || data.length < 4) return NaN;
    if (typeof ss === 'undefined' || typeof ss.kurtosis === 'undefined') {
        console.error("simple-statistics (ss) is not loaded or kurtosis function is missing.");
        return NaN;
    }
    try { return ss.kurtosis(data); } catch (e) { console.error("Error calculating kurtosis:", e); return NaN; }
}

function calculateCVaR(data, confidenceLevel = 5) {
    if (!data || data.length === 0 || confidenceLevel <= 0 || confidenceLevel >= 100) return NaN;
    const sortedData = [...data].sort((a, b) => a - b);
    // VaR at confidenceLevel (e.g., 5%) means the value at the (100-confidenceLevel)th percentile.
    // CVaR is the average of returns *below* (or equal to) VaR.
    const varValue = calculatePercentile(data, confidenceLevel); // This is the VaR value (e.g., 5th percentile)

    const tailReturns = sortedData.filter(r => r <= varValue); // Returns that are worse than or equal to VaR
    if (tailReturns.length === 0) return NaN; // No returns in the tail
    return calculateMean(tailReturns);
}

// --- CFA Metrics ---

// Treynor Ratio: (Portfolio Return - Risk-Free Rate) / Beta
function calculateTreynorRatio(portfolioReturnPerc, riskFreeRatePerc, beta) {
    if (isNaN(portfolioReturnPerc) || isNaN(riskFreeRatePerc) || isNaN(beta) || beta === 0) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    const excessReturn = portfolioReturn_dec - riskFreeRate_dec;
    return (excessReturn / beta) * 100;
}

// Calmar Ratio: (Annualized Return) / |Max Drawdown|
function calculateCalmarRatio(annualizedReturnPerc, maxDrawdownPerc) {
    if (isNaN(annualizedReturnPerc) || isNaN(maxDrawdownPerc) || maxDrawdownPerc === 0) return NaN;
    const annualizedReturn_dec = annualizedReturnPerc / 100;
    const maxDrawdown_dec = maxDrawdownPerc / 100;
    return annualizedReturn_dec / Math.abs(maxDrawdown_dec);
}

// Jensen's Alpha: Portfolio Return - [Risk-Free Rate + Beta * (Market Return - Risk-Free Rate)]
function calculateJensenAlpha(portfolioReturnPerc, riskFreeRatePerc, marketReturnPerc, beta) {
    if (isNaN(portfolioReturnPerc) || isNaN(riskFreeRatePerc) || isNaN(marketReturnPerc) || isNaN(beta)) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    const marketReturn_dec = marketReturnPerc / 100;
    return (portfolioReturn_dec - (riskFreeRate_dec + beta * (marketReturn_dec - riskFreeRate_dec))) * 100;
}

// M2 Measure (Modigliani-Modigliani Measure): Risk-Free Rate + [(Portfolio Return - Risk-Free Rate) * (Market StdDev / Portfolio StdDev)]
function calculateM2Measure(portfolioReturnPerc, portfolioStdDevPerc, marketStdDevPerc, riskFreeRatePerc) {
    if (isNaN(portfolioReturnPerc) || isNaN(portfolioStdDevPerc) || isNaN(marketStdDevPerc) || isNaN(riskFreeRatePerc) || portfolioStdDevPerc === 0) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const portfolioStdDev_dec = portfolioStdDevPerc / 100;
    const marketStdDev_dec = marketStdDevPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    return (riskFreeRate_dec + ((portfolioReturn_dec - riskFreeRate_dec) * (marketStdDev_dec / portfolioStdDev_dec))) * 100;
}

// Sharpe Ratio: (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation
function calculateSharpeRatio(returns, riskFreeRatePerc) {
    if (!returns || returns.length === 0) return NaN;
    const rf_dec = riskFreeRatePerc / 100; // Convert RF to decimal for calculation
    const excessReturns = returns.map(r => r / 100 - rf_dec); // Convert returns to decimal and subtract RF
    const meanExcessReturn = calculateMean(excessReturns);
    const stdDevExcessReturn = calculateStdDev(excessReturns);
    if (stdDevExcessReturn === 0) return NaN;
    return meanExcessReturn / stdDevExcessReturn;
}

// Sortino Ratio: (Portfolio Return - Risk-Free Rate) / Downside Deviation
function calculateSortinoRatio(returns, riskFreeRatePerc, targetReturn = 0) {
    if (!returns || returns.length === 0) return NaN;
    const rf_dec = riskFreeRatePerc / 100; // Convert RF to decimal for calculation
    const excessReturns = returns.map(r => r / 100 - rf_dec); // Convert returns to decimal and subtract RF
    const downsideDeviation = calculateDownsideDeviation(returns.map(r => r / 100), targetReturn / 100); // Convert returns and target to decimal
    if (downsideDeviation === 0) return NaN;
    return calculateMean(excessReturns) / downsideDeviation;
}

// Omega Ratio: (Sum of (Returns - Threshold) for Returns > Threshold) / (Sum of (Threshold - Returns) for Returns <= Threshold)
function calculateOmegaRatio(returns, thresholdPerc = 0) {
    if (!returns || returns.length === 0) return NaN;
    const threshold_dec = thresholdPerc / 100; // Convert threshold to decimal
    const returns_dec = returns.map(r => r / 100); // Convert returns to decimal

    let gains = 0;
    let losses = 0;

    for (const r of returns_dec) {
        if (r > threshold_dec) {
            gains += (r - threshold_dec);
        } else {
            losses += (threshold_dec - r);
        }
    }
    return losses === 0 ? Infinity : gains / losses;
}
