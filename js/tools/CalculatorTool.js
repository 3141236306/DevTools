import { BaseComponent } from '../components/BaseComponent.js';

const CURRENCIES = [
    { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
    { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: '欧元', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: '英镑', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: '日元', symbol: '¥', flag: '🇯🇵' },
    { code: 'KRW', name: '韩元', symbol: '₩', flag: '🇰🇷' },
    { code: 'HKD', name: '港币', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'TWD', name: '新台币', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
    { code: 'AUD', name: '澳元', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: '加元', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: '瑞士法郎', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'THB', name: '泰铢', symbol: '฿', flag: '🇹🇭' },
    { code: 'MYR', name: '马来西亚林吉特', symbol: 'RM', flag: '🇲🇾' },
];

const RATES = {
    CNY: 1, USD: 0.1373, EUR: 0.1262, GBP: 0.1084, JPY: 21.15,
    KRW: 189.5, HKD: 1.073, TWD: 4.42, SGD: 0.185, AUD: 0.211,
    CAD: 0.189, CHF: 0.122, THB: 4.92, MYR: 0.645,
};

const CN_TAX_RULES = [
    { min: 0, max: 36000, rate: 0.03, deduct: 0 },
    { min: 36000, max: 144000, rate: 0.10, deduct: 2520 },
    { min: 144000, max: 300000, rate: 0.20, deduct: 16920 },
    { min: 300000, max: 420000, rate: 0.25, deduct: 31920 },
    { min: 420000, max: 660000, rate: 0.30, deduct: 52920 },
    { min: 660000, max: 960000, rate: 0.35, deduct: 85920 },
    { min: 960000, max: Infinity, rate: 0.45, deduct: 181920 },
];

export class CalculatorTool extends BaseComponent {
    constructor() {
        super();
        this.currentTab = 'tax';
    }

    render() {
        const currencyOpts = CURRENCIES.map(c =>
            `<option value="${c.code}">${c.flag} ${c.name}</option>`
        ).join('');

        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>实用计算器</h2>
                    <p>税费计算、汇率换算、工资计算，一站式实用工具</p>

                    <div class="calc-tabs">
                        <button class="calc-tab-btn active" data-tab="tax">税费计算</button>
                        <button class="calc-tab-btn" data-tab="currency">汇率换算</button>
                        <button class="calc-tab-btn" data-tab="salary">工资计算</button>
                    </div>

                    <!-- 税费计算 -->
                    <div class="calc-panel active" id="tax-panel">
                        <div class="form-group">
                            <label>计算方式</label>
                            <div class="format-btns">
                                <button class="btn btn-ghost active" id="taxYearBtn" data-mode="year">按年度</button>
                                <button class="btn btn-ghost" id="taxMonthBtn" data-mode="month">按月薪</button>
                            </div>
                        </div>
                        <div class="form-group" id="taxYearInput">
                            <label>年收入总额 (元)</label>
                            <input type="number" id="taxIncome" class="calc-input" value="200000" min="0">
                        </div>
                        <div class="form-group" id="taxMonthInput" style="display:none;">
                            <label>月薪 (元)</label>
                            <input type="number" id="taxMonthSalary" class="calc-input" value="15000" min="0">
                        </div>
                        <div class="form-group">
                            <label>五险一金 (元/月)</label>
                            <input type="number" id="taxInsurance" class="calc-input" value="2000" min="0">
                        </div>
                        <div class="form-group">
                            <label>专项附加扣除 (元/月)</label>
                            <input type="number" id="taxSpecial" class="calc-input" value="1500" min="0">
                        </div>
                        <div class="button-group">
                            <button id="taxCalcBtn" class="btn">计算税费</button>
                        </div>
                        <div class="result-area" id="taxResult"></div>
                    </div>

                    <!-- 汇率换算 -->
                    <div class="calc-panel" id="currency-panel">
                        <div class="currency-swap-box">
                            <div class="currency-input-group">
                                <label>金额</label>
                                <div class="currency-input-wrap">
                                    <select id="fromCurrency" class="currency-select">${currencyOpts}</select>
                                    <input type="number" id="fromAmount" class="currency-amount" value="100" min="0" step="any">
                                </div>
                            </div>
                            <button class="swap-btn" id="swapBtn" title="交换货币">⇄</button>
                            <div class="currency-input-group">
                                <label>换算结果</label>
                                <div class="currency-input-wrap">
                                    <select id="toCurrency" class="currency-select">${currencyOpts}</select>
                                    <div id="toAmount" class="currency-result">—</div>
                                </div>
                            </div>
                        </div>
                        <div class="rate-info" id="rateInfo"></div>
                        <div class="button-group">
                            <button id="currencyCalcBtn" class="btn">计算汇率</button>
                            <button id="currencyCopyBtn" class="btn btn-accent">复制结果</button>
                        </div>
                        <div class="result-area" id="currencyResult"></div>
                    </div>

                    <!-- 工资计算 -->
                    <div class="calc-panel" id="salary-panel">
                        <div class="form-group">
                            <label>税前月薪 (元)</label>
                            <input type="number" id="salaryGross" class="calc-input" value="15000" min="0">
                        </div>
                        <div class="form-group">
                            <label>五险一金 (元/月)</label>
                            <input type="number" id="salaryInsurance" class="calc-input" value="2000" min="0">
                        </div>
                        <div class="form-group">
                            <label>专项附加扣除 (元/月)</label>
                            <input type="number" id="salarySpecial" class="calc-input" value="1500" min="0">
                        </div>
                        <div class="form-group">
                            <label>年终奖 (元)</label>
                            <input type="number" id="salaryBonus" class="calc-input" value="0" min="0">
                        </div>
                        <div class="button-group">
                            <button id="salaryCalcBtn" class="btn">计算工资</button>
                            <button id="salaryCopyBtn" class="btn btn-accent">复制结果</button>
                        </div>
                        <div class="result-area" id="salaryResult"></div>
                    </div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>个税税率表</h3>
                        <table class="encoding-table">
                            <tr><th>级数</th><th>年应纳税所得额</th><th>税率</th></tr>
                            <tr><td>1</td><td>≤3.6万</td><td>3%</td></tr>
                            <tr><td>2</td><td>3.6-14.4万</td><td>10%</td></tr>
                            <tr><td>3</td><td>14.4-30万</td><td>20%</td></tr>
                            <tr><td>4</td><td>30-42万</td><td>25%</td></tr>
                            <tr><td>5</td><td>42-66万</td><td>30%</td></tr>
                            <tr><td>6</td><td>66-96万</td><td>35%</td></tr>
                            <tr><td>7</td><td>&gt;96万</td><td>45%</td></tr>
                        </table>
                    </div>
                    <div class="tool-section">
                        <h3>说明</h3>
                        <ul>
                            <li>税费计算基于中国个人所得税法</li>
                            <li>五险一金和专项附加扣除可自定义</li>
                            <li>汇率数据为参考值，非实时数据</li>
                            <li>年终奖可选择单独计税或并入综合所得</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        this.setupTabs();
        this.setupTax();
        this.setupCurrency();
        this.setupSalary();
    }

    setupTabs() {
        const btns = this.querySelectorAll('.calc-tab-btn');
        btns.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                btns.forEach(b => b.classList.remove('active'));
                this.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                this.querySelector(`#${btn.getAttribute('data-tab')}-panel`).classList.add('active');
            });
        });
    }

    setupTax() {
        const yearBtn = this.querySelector('#taxYearBtn');
        const monthBtn = this.querySelector('#taxMonthBtn');
        const yearInput = this.querySelector('#taxYearInput');
        const monthInput = this.querySelector('#taxMonthInput');

        this.addEventListener(yearBtn, 'click', () => {
            yearBtn.classList.add('active');
            monthBtn.classList.remove('active');
            yearInput.style.display = '';
            monthInput.style.display = 'none';
            this._taxMode = 'year';
        });
        this.addEventListener(monthBtn, 'click', () => {
            monthBtn.classList.add('active');
            yearBtn.classList.remove('active');
            monthInput.style.display = '';
            yearInput.style.display = 'none';
            this._taxMode = 'month';
        });
        this._taxMode = 'year';

        this.addEventListener(this.querySelector('#taxCalcBtn'), 'click', () => {
            let annualIncome;
            if (this._taxMode === 'year') {
                annualIncome = parseFloat(this.querySelector('#taxIncome').value) || 0;
            } else {
                annualIncome = (parseFloat(this.querySelector('#taxMonthSalary').value) || 0) * 12;
            }
            const monthlyInsurance = parseFloat(this.querySelector('#taxInsurance').value) || 0;
            const monthlySpecial = parseFloat(this.querySelector('#taxSpecial').value) || 0;

            const annualInsurance = monthlyInsurance * 12;
            const annualSpecial = monthlySpecial * 12;
            const taxableIncome = annualIncome - annualInsurance - annualSpecial - 60000;

            const resultEl = this.querySelector('#taxResult');
            if (taxableIncome <= 0) {
                resultEl.innerHTML = `
年收入: ¥${annualIncome.toLocaleString()}
五险一金(年): ¥${annualInsurance.toLocaleString()}
专项附加扣除(年): ¥${annualSpecial.toLocaleString()}
免征额: ¥60,000
应纳税所得额: ¥${taxableIncome.toLocaleString()}

无需缴纳个人所得税 ✅
                `;
            } else {
                let tax = 0;
                let rate = 0;
                for (const rule of CN_TAX_RULES) {
                    if (taxableIncome <= rule.max) {
                        tax = taxableIncome * rule.rate - rule.deduct;
                        rate = (rule.rate * 100).toFixed(0);
                        break;
                    }
                }
                const afterTax = annualIncome - annualInsurance - tax;
                const monthlyAfterTax = afterTax / 12;

                resultEl.innerHTML = `
年收入: ¥${annualIncome.toLocaleString()}
五险一金(年): ¥${annualInsurance.toLocaleString()}
专项附加扣除(年): ¥${annualSpecial.toLocaleString()}
免征额: ¥60,000
应纳税所得额: ¥${taxableIncome.toLocaleString()}
适用税率: ${rate}%

应缴个税: ¥${tax.toFixed(2)}
税后年收入: ¥${afterTax.toFixed(2)}
税后月薪(平均): ¥${monthlyAfterTax.toFixed(2)}
                `;
            }
            resultEl.classList.remove('error');
            resultEl.classList.add('success');
        });
    }

    setupCurrency() {
        this.querySelector('#fromCurrency').value = 'CNY';
        this.querySelector('#toCurrency').value = 'USD';

        this.addEventListener(this.querySelector('#swapBtn'), 'click', () => {
            const f = this.querySelector('#fromCurrency').value;
            const t = this.querySelector('#toCurrency').value;
            this.querySelector('#fromCurrency').value = t;
            this.querySelector('#toCurrency').value = f;
            this.calcCurrency();
        });

        this.addEventListener(this.querySelector('#fromAmount'), 'input', () => this.calcCurrency());
        this.addEventListener(this.querySelector('#fromCurrency'), 'change', () => this.calcCurrency());
        this.addEventListener(this.querySelector('#toCurrency'), 'change', () => this.calcCurrency());
        this.addEventListener(this.querySelector('#currencyCalcBtn'), 'click', () => this.calcCurrency());

        this.addEventListener(this.querySelector('#currencyCopyBtn'), 'click', () => {
            const text = this.querySelector('#currencyResult').textContent;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'));
        });

        this.calcCurrency();
    }

    calcCurrency() {
        const amount = parseFloat(this.querySelector('#fromAmount').value) || 0;
        const from = this.querySelector('#fromCurrency').value;
        const to = this.querySelector('#toCurrency').value;
        const rate = RATES[to] / RATES[from];
        const result = amount * rate;

        this.querySelector('#toAmount').textContent = result.toFixed(4);
        this.querySelector('#rateInfo').textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;

        const fromInfo = CURRENCIES.find(c => c.code === from);
        const toInfo = CURRENCIES.find(c => c.code === to);
        this.querySelector('#currencyResult').innerHTML = `
${fromInfo.flag} ${amount.toLocaleString()} ${from} (${fromInfo.name})
=
${toInfo.flag} ${result.toFixed(4)} ${to} (${toInfo.name})

汇率: 1 ${from} = ${rate.toFixed(6)} ${to}
        `;
        this.querySelector('#currencyResult').classList.remove('error');
        this.querySelector('#currencyResult').classList.add('success');
    }

    setupSalary() {
        this.addEventListener(this.querySelector('#salaryCalcBtn'), 'click', () => {
            const gross = parseFloat(this.querySelector('#salaryGross').value) || 0;
            const insurance = parseFloat(this.querySelector('#salaryInsurance').value) || 0;
            const special = parseFloat(this.querySelector('#salarySpecial').value) || 0;
            const bonus = parseFloat(this.querySelector('#salaryBonus').value) || 0;

            const monthlyTaxable = gross - insurance - special - 5000;
            let monthlyTax = 0;
            if (monthlyTaxable > 0) {
                for (const rule of CN_TAX_RULES) {
                    const annualTaxable = monthlyTaxable * 12;
                    if (annualTaxable <= rule.max) {
                        monthlyTax = (annualTaxable * rule.rate - rule.deduct) / 12;
                        break;
                    }
                }
            }
            monthlyTax = Math.max(0, monthlyTax);

            const netMonthly = gross - insurance - monthlyTax;
            const annualGross = gross * 12 + bonus;
            const annualInsurance = insurance * 12;
            const annualTax = monthlyTax * 12;
            const annualNet = netMonthly * 12 + bonus - (bonus > 0 ? this.calcBonusTax(bonus) : 0);
            const bonusTax = bonus > 0 ? this.calcBonusTax(bonus) : 0;

            this.querySelector('#salaryResult').innerHTML = `
【月薪明细】
税前月薪: ¥${gross.toLocaleString()}
五险一金: -¥${insurance.toLocaleString()}
专项附加扣除: -¥${special.toLocaleString()}
每月个税: -¥${monthlyTax.toFixed(2)}
———————————
税后月薪: ¥${netMonthly.toFixed(2)}

【年度汇总】
年总收入(含奖金): ¥${annualGross.toLocaleString()}
年五险一金: ¥${annualInsurance.toLocaleString()}
年个税(月薪部分): ¥${annualTax.toFixed(2)}
年终奖个税: ¥${bonusTax.toFixed(2)}
———————————
年到手收入: ¥${(annualNet).toFixed(2)}
            `;
            this.querySelector('#salaryResult').classList.remove('error');
            this.querySelector('#salaryResult').classList.add('success');
        });

        this.addEventListener(this.querySelector('#salaryCopyBtn'), 'click', () => {
            const text = this.querySelector('#salaryResult').textContent;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'));
        });
    }

    calcBonusTax(bonus) {
        const monthlyBonus = bonus / 12;
        for (const rule of CN_TAX_RULES) {
            if (monthlyBonus <= rule.max / 12) {
                return bonus * rule.rate - rule.deduct * (bonus / 36000);
            }
        }
        return 0;
    }
}