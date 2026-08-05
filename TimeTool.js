import { BaseComponent } from '../components/BaseComponent.js';

const LOCAL_ZONE_VALUE = '__local__';

const TIME_ZONES = [
    { label: '本地时区', zone: LOCAL_ZONE_VALUE },
    { label: 'UTC', zone: 'UTC' },
    { label: '北京时间', zone: 'Asia/Shanghai' },
    { label: '东京', zone: 'Asia/Tokyo' },
    { label: '纽约', zone: 'America/New_York' },
    { label: '洛杉矶', zone: 'America/Los_Angeles' },
    { label: '伦敦', zone: 'Europe/London' },
    { label: '柏林', zone: 'Europe/Berlin' },
    { label: '新加坡', zone: 'Asia/Singapore' },
    { label: '悉尼', zone: 'Australia/Sydney' },
];

const FORMAT_PRESETS = [
    { label: '日期时间', value: 'yyyy-MM-dd HH:mm:ss' },
    { label: '仅时间', value: 'HH:mm:ss' },
    { label: '仅日期', value: 'yyyy-MM-dd' },
    { label: '斜杠日期', value: 'yyyy/MM/dd HH:mm:ss' },
    { label: '紧凑格式', value: 'yyyyMMddHHmmss' },
    { label: '含毫秒', value: 'yyyy-MM-dd HH:mm:ss.SSS' },
    { label: '含时区', value: 'yyyy-MM-dd HH:mm:ss Z' },
    { label: '12小时制', value: 'yyyy-MM-dd hh:mm:ss A' },
];

export class TimeTool extends BaseComponent {
    render() {
        const zoneOptions = TIME_ZONES.map(t => `
            <option value="${t.zone}">${t.label}</option>
        `).join('');

        const formatOptions = FORMAT_PRESETS.map(t => `
            <option value="${t.value}">${t.label}</option>
        `).join('');

        const timeZoneItems = TIME_ZONES.map(t => `
            <button type="button" class="time-zone-item" data-time-zone="${t.zone}">
                <span class="time-zone-label">${t.label}</span>
                <strong class="time-zone-value">--</strong>
                <span class="time-zone-meta">${t.zone === LOCAL_ZONE_VALUE ? 'Local' : t.zone}</span>
            </button>
        `).join('');

        return `
            <div class="tool-page">
                <div class="tool-section">
                    <h2>时间转换器</h2>
                    <p>Unix 时间戳、本地时间、ISO 8601、UTC 与常用时区互转</p>

                    <div class="time-workspace">
                        <section class="time-block">
                            <div class="time-block-title">
                                <h3>输入时间</h3>
                                <span>修改任意一项后自动同步</span>
                            </div>

                            <div class="time-input-grid">
                                <div class="time-field">
                                    <label for="timeLocalInput">本地时间</label>
                                    <input type="datetime-local" id="timeLocalInput" class="time-input" step="1">
                                </div>

                                <div class="time-field">
                                    <div class="time-field-header">
                                        <label for="timeTimestampInput">Unix 时间戳</label>
                                        <div class="time-unit-toggle" role="group" aria-label="时间戳单位">
                                            <button type="button" class="time-unit-btn active" data-unit="seconds">秒</button>
                                            <button type="button" class="time-unit-btn" data-unit="milliseconds">毫秒</button>
                                        </div>
                                    </div>
                                    <input type="number" id="timeTimestampInput" class="time-input" inputmode="numeric" step="1">
                                </div>

                                <div class="time-field time-field-full">
                                    <label for="timeIsoInput">ISO / 日期字符串 / 时间戳</label>
                                    <input type="text" id="timeIsoInput" class="time-input" spellcheck="false" placeholder="例如 2026-08-05T12:30:00Z">
                                </div>
                            </div>
                        </section>

                        <section class="time-block">
                            <div class="time-block-title">
                                <h3>输出设置</h3>
                                <span>格式结果按目标时区生成</span>
                            </div>

                            <div class="time-settings-grid">
                                <div class="time-field">
                                    <label for="timeTargetZone">目标时区</label>
                                    <select id="timeTargetZone" class="time-select">${zoneOptions}</select>
                                </div>

                                <div class="time-field">
                                    <label for="timeFormatPreset">常用格式</label>
                                    <select id="timeFormatPreset" class="time-select">${formatOptions}</select>
                                </div>

                                <div class="time-field time-field-full">
                                    <label for="timeFormatPattern">自定义格式</label>
                                    <input type="text" id="timeFormatPattern" class="time-input" spellcheck="false" value="yyyy-MM-dd HH:mm:ss" placeholder="例如 HH:mm:ss">
                                </div>
                            </div>

                            <div class="time-format-output-row">
                                <div>
                                    <span>格式化结果</span>
                                    <strong id="timeFormattedValue">--</strong>
                                </div>
                                <button type="button" class="btn btn-ghost" id="timeCopyFormattedBtn">复制格式化结果</button>
                            </div>
                        </section>

                        <div class="time-toolbar">
                            <div class="time-adjust-row" aria-label="快速调整时间">
                                <span>快速调整</span>
                                <button type="button" class="btn btn-ghost time-adjust-btn" data-offset-ms="-86400000">-1 天</button>
                                <button type="button" class="btn btn-ghost time-adjust-btn" data-offset-ms="-3600000">-1 小时</button>
                                <button type="button" class="btn btn-ghost time-adjust-btn" data-offset-ms="3600000">+1 小时</button>
                                <button type="button" class="btn btn-ghost time-adjust-btn" data-offset-ms="86400000">+1 天</button>
                            </div>

                            <div class="time-actions-row">
                                <button type="button" class="btn btn-secondary" id="timeNowBtn">现在</button>
                                <button type="button" class="btn btn-ghost" id="timeCopyTimestampBtn">复制时间戳</button>
                                <button type="button" class="btn btn-accent" id="timeCopyAllBtn">复制全部</button>
                            </div>

                            <span class="time-status" id="timeStatus"></span>
                        </div>

                        <section class="time-block">
                            <div class="time-block-title">
                                <h3>转换结果</h3>
                                <span id="timeTargetZoneValue">--</span>
                            </div>

                            <div class="time-result-list">
                                <div class="time-result-row">
                                    <span>Unix 秒</span>
                                    <strong id="timeSecondsValue">--</strong>
                                </div>
                                <div class="time-result-row">
                                    <span>Unix 毫秒</span>
                                    <strong id="timeMillisecondsValue">--</strong>
                                </div>
                                <div class="time-result-row">
                                    <span>本地时间</span>
                                    <strong id="timeLocalValue">--</strong>
                                </div>
                                <div class="time-result-row">
                                    <span>UTC 时间</span>
                                    <strong id="timeUtcValue">--</strong>
                                </div>
                                <div class="time-result-row">
                                    <span>ISO 8601</span>
                                    <strong id="timeIsoValue">--</strong>
                                </div>
                                <div class="time-result-row">
                                    <span>目标时区</span>
                                    <strong id="timeTargetSummaryValue">--</strong>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div class="tool-sidebar">
                    <div class="tool-section">
                        <h3>常用时区</h3>
                        <div class="time-zone-grid" id="timeZoneGrid">${timeZoneItems}</div>
                    </div>

                    <div class="tool-section">
                        <h3>说明</h3>
                        <ul>
                            <li>支持秒级和毫秒级 Unix 时间戳</li>
                            <li>ISO 输入支持带时区的 RFC 3339 字符串</li>
                            <li>无时区日期会按当前浏览器本地时区解析</li>
                            <li>点击侧边栏时区可快速切换目标时区</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        const localInput = this.querySelector('#timeLocalInput');
        const timestampInput = this.querySelector('#timeTimestampInput');
        const isoInput = this.querySelector('#timeIsoInput');
        const targetZoneSelect = this.querySelector('#timeTargetZone');
        const targetZoneValue = this.querySelector('#timeTargetZoneValue');
        const formatPreset = this.querySelector('#timeFormatPreset');
        const formatPattern = this.querySelector('#timeFormatPattern');
        const formattedValue = this.querySelector('#timeFormattedValue');
        const unitButtons = this.querySelectorAll('.time-unit-btn');
        const adjustButtons = this.querySelectorAll('.time-adjust-btn');
        const nowBtn = this.querySelector('#timeNowBtn');
        const copyTimestampBtn = this.querySelector('#timeCopyTimestampBtn');
        const copyFormattedBtn = this.querySelector('#timeCopyFormattedBtn');
        const copyAllBtn = this.querySelector('#timeCopyAllBtn');
        const status = this.querySelector('#timeStatus');
        const zoneItems = this.querySelectorAll('.time-zone-item');
        const outputEls = {
            secondsValue: this.querySelector('#timeSecondsValue'),
            millisecondsValue: this.querySelector('#timeMillisecondsValue'),
            localValue: this.querySelector('#timeLocalValue'),
            utcValue: this.querySelector('#timeUtcValue'),
            isoValue: this.querySelector('#timeIsoValue'),
            targetSummaryValue: this.querySelector('#timeTargetSummaryValue'),
        };

        if (!localInput || !timestampInput || !isoInput || !targetZoneSelect || !formatPattern) return;

        const state = {
            unit: 'seconds',
            currentDate: new Date(),
        };

        const setStatus = (message, isError = false) => {
            if (!status) return;
            status.textContent = message;
            status.classList.toggle('error', isError);
        };

        const clearOutputs = () => {
            Object.values(outputEls).forEach(el => {
                if (el) el.textContent = '--';
            });
            if (targetZoneValue) targetZoneValue.textContent = '--';
            if (formattedValue) formattedValue.textContent = '--';
            zoneItems.forEach(item => {
                const value = item.querySelector('.time-zone-value');
                if (value) value.textContent = '--';
            });
        };

        const getTargetZone = () => this.normalizeZone(targetZoneSelect.value);

        const setDate = (date, options = {}) => {
            const {
                syncLocal = true,
                syncTimestamp = true,
                syncIso = true,
                statusMessage,
            } = options;

            if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
                clearOutputs();
                setStatus('请输入有效时间', true);
                return;
            }

            state.currentDate = date;

            if (syncLocal) {
                localInput.value = this.formatDateTimeLocal(date);
            }

            if (syncTimestamp) {
                timestampInput.value = this.formatTimestamp(date, state.unit);
            }

            if (syncIso) {
                isoInput.value = date.toISOString();
            }

            this.updateTimeOutputs(date, {
                ...outputEls,
                targetZoneValue,
                formattedValue,
                zoneItems,
                targetZone: getTargetZone(),
                formatPattern: formatPattern.value.trim(),
            });

            setStatus(statusMessage || `本地时区：${this.getLocalTimeZone()}`);
        };

        const setActiveUnit = (unit) => {
            state.unit = unit;
            unitButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.unit === unit);
            });
            timestampInput.value = this.formatTimestamp(state.currentDate, state.unit);
        };

        const parseTimestamp = () => {
            const date = this.parseTimestampValue(timestampInput.value.trim(), state.unit);
            setDate(date, { syncTimestamp: false });
        };

        this.addEventListener(localInput, 'input', () => {
            setDate(new Date(localInput.value), { syncLocal: false });
        });

        this.addEventListener(timestampInput, 'input', parseTimestamp);

        this.addEventListener(isoInput, 'input', () => {
            const raw = isoInput.value.trim();
            if (!raw) {
                clearOutputs();
                setStatus('请输入 ISO 时间、日期字符串或时间戳');
                return;
            }
            setDate(this.parseDateText(raw), { syncIso: false });
        });

        this.addEventListener(targetZoneSelect, 'change', () => {
            setDate(state.currentDate, {
                syncLocal: false,
                syncTimestamp: false,
                syncIso: false,
                statusMessage: `目标时区：${this.getZoneLabel(getTargetZone())}`,
            });
        });

        this.addEventListener(formatPreset, 'change', () => {
            formatPattern.value = formatPreset.value;
            setDate(state.currentDate, {
                syncLocal: false,
                syncTimestamp: false,
                syncIso: false,
                statusMessage: `格式：${formatPattern.value}`,
            });
        });

        this.addEventListener(formatPattern, 'input', () => {
            setDate(state.currentDate, {
                syncLocal: false,
                syncTimestamp: false,
                syncIso: false,
                statusMessage: `格式：${formatPattern.value.trim() || '请输入格式'}`,
            });
        });

        unitButtons.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                setActiveUnit(btn.dataset.unit || 'seconds');
                setDate(state.currentDate, {
                    syncLocal: false,
                    syncTimestamp: false,
                    syncIso: false,
                    statusMessage: `时间戳单位：${state.unit === 'seconds' ? '秒' : '毫秒'}`,
                });
            });
        });

        adjustButtons.forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const offset = Number(btn.dataset.offsetMs);
                if (!Number.isFinite(offset)) return;
                setDate(new Date(state.currentDate.getTime() + offset), {
                    statusMessage: `已调整 ${btn.textContent.trim()}`,
                });
            });
        });

        zoneItems.forEach(item => {
            this.addEventListener(item, 'click', () => {
                targetZoneSelect.value = item.dataset.timeZone || LOCAL_ZONE_VALUE;
                setDate(state.currentDate, {
                    syncLocal: false,
                    syncTimestamp: false,
                    syncIso: false,
                    statusMessage: `目标时区：${this.getZoneLabel(getTargetZone())}`,
                });
            });
        });

        this.addEventListener(nowBtn, 'click', () => {
            setDate(new Date(), { statusMessage: '已切换到当前时间' });
        });

        this.addEventListener(copyTimestampBtn, 'click', async () => {
            await this.copyWithFeedback(
                this.formatTimestamp(state.currentDate, state.unit),
                copyTimestampBtn,
                setStatus,
                '时间戳已复制'
            );
        });

        this.addEventListener(copyFormattedBtn, 'click', async () => {
            await this.copyWithFeedback(
                this.formatWithPattern(state.currentDate, formatPattern.value.trim(), getTargetZone()),
                copyFormattedBtn,
                setStatus,
                '格式化结果已复制'
            );
        });

        this.addEventListener(copyAllBtn, 'click', async () => {
            await this.copyWithFeedback(
                this.buildCopyText(state.currentDate, getTargetZone(), formatPattern.value.trim()),
                copyAllBtn,
                setStatus,
                '全部结果已复制'
            );
        });

        setDate(state.currentDate);
    }

    updateTimeOutputs(date, elements) {
        const {
            secondsValue,
            millisecondsValue,
            localValue,
            utcValue,
            isoValue,
            targetSummaryValue,
            targetZoneValue,
            formattedValue,
            zoneItems,
            targetZone,
            formatPattern,
        } = elements;

        const targetText = this.formatZoneTime(date, targetZone);
        const formattedText = this.formatWithPattern(date, formatPattern, targetZone);

        if (secondsValue) secondsValue.textContent = this.formatTimestamp(date, 'seconds');
        if (millisecondsValue) millisecondsValue.textContent = this.formatTimestamp(date, 'milliseconds');
        if (localValue) localValue.textContent = `${this.formatZoneTime(date)} ${this.getZoneOffsetLabel(date)}`;
        if (utcValue) utcValue.textContent = `${this.formatZoneTime(date, 'UTC')} UTC`;
        if (isoValue) isoValue.textContent = date.toISOString();
        if (targetSummaryValue) targetSummaryValue.textContent = `${targetText} ${this.getZoneLabel(targetZone)}`;
        if (targetZoneValue) targetZoneValue.textContent = `${targetText} ${this.getZoneOffsetLabel(date, targetZone)}`;
        if (formattedValue) formattedValue.textContent = formattedText;

        zoneItems.forEach(item => {
            const zone = this.normalizeZone(item.dataset.timeZone);
            const value = item.querySelector('.time-zone-value');
            const meta = item.querySelector('.time-zone-meta');
            item.classList.toggle('active', this.sameZone(zone, targetZone));
            if (value) value.textContent = this.formatZoneTime(date, zone);
            if (meta) meta.textContent = `${this.getZoneName(zone)} · ${this.getZoneOffsetLabel(date, zone)}`;
        });
    }

    formatTimestamp(date, unit) {
        return unit === 'milliseconds'
            ? String(date.getTime())
            : String(Math.floor(date.getTime() / 1000));
    }

    parseTimestampValue(raw, unit) {
        if (!raw) return new Date(NaN);

        const value = Number(raw);
        if (!Number.isFinite(value)) return new Date(NaN);

        const milliseconds = unit === 'milliseconds' ? value : value * 1000;
        return new Date(milliseconds);
    }

    parseDateText(raw) {
        if (!raw) return new Date(NaN);

        if (/^-?\d+(\.\d+)?$/.test(raw)) {
            const value = Number(raw);
            const milliseconds = Math.abs(value) >= 100000000000 ? value : value * 1000;
            return new Date(milliseconds);
        }

        const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateOnly) {
            return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
        }

        const localDateTime = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)$/);
        const normalized = localDateTime ? `${localDateTime[1]}T${localDateTime[2]}` : raw;
        return new Date(normalized);
    }

    formatDateTimeLocal(date) {
        const pad = value => String(value).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    formatZoneTime(date, timeZone) {
        return new Intl.DateTimeFormat('zh-CN', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        }).format(date).replace(/\//g, '-');
    }

    getZoneOffsetLabel(date, timeZone) {
        const zonePart = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset',
        }).formatToParts(date).find(part => part.type === 'timeZoneName');

        return zonePart ? zonePart.value.replace('GMT', 'UTC') : '';
    }

    buildCopyText(date, targetZone, formatPattern) {
        return [
            `Unix 秒: ${this.formatTimestamp(date, 'seconds')}`,
            `Unix 毫秒: ${this.formatTimestamp(date, 'milliseconds')}`,
            `本地时间: ${this.formatZoneTime(date)} ${this.getZoneOffsetLabel(date)} (${this.getLocalTimeZone()})`,
            `UTC 时间: ${this.formatZoneTime(date, 'UTC')} UTC`,
            `ISO 8601: ${date.toISOString()}`,
            `目标时区: ${this.formatZoneTime(date, targetZone)} ${this.getZoneOffsetLabel(date, targetZone)} (${this.getZoneLabel(targetZone)})`,
            `格式化结果: ${this.formatWithPattern(date, formatPattern, targetZone)}`,
        ].join('\n');
    }

    formatWithPattern(date, pattern = 'yyyy-MM-dd HH:mm:ss', timeZone) {
        const safePattern = pattern || 'yyyy-MM-dd HH:mm:ss';
        const parts = this.getZoneParts(date, timeZone);
        const hour24 = Number(parts.HH);
        const hour12 = hour24 % 12 || 12;
        const offset = this.getZoneOffsetPattern(date, timeZone);
        const unixSeconds = Math.floor(date.getTime() / 1000);

        const tokens = {
            yyyy: parts.yyyy,
            YYYY: parts.yyyy,
            yy: parts.yyyy.slice(-2),
            MM: parts.MM,
            M: String(Number(parts.MM)),
            dd: parts.dd,
            d: String(Number(parts.dd)),
            HH: parts.HH,
            H: String(hour24),
            hh: String(hour12).padStart(2, '0'),
            h: String(hour12),
            mm: parts.mm,
            m: String(Number(parts.mm)),
            ss: parts.ss,
            s: String(Number(parts.ss)),
            SSS: parts.SSS,
            A: hour24 < 12 ? 'AM' : 'PM',
            a: hour24 < 12 ? 'am' : 'pm',
            EEE: parts.EEE,
            Z: offset.colon,
            ZZ: offset.compact,
            X: String(unixSeconds),
            x: String(date.getTime()),
        };

        return safePattern.replace(/yyyy|YYYY|SSS|EEE|ZZ|yy|MM|dd|HH|hh|mm|ss|M|d|H|h|m|s|A|a|Z|X|x/g, token => tokens[token]);
    }

    getZoneParts(date, timeZone) {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            weekday: 'short',
            hourCycle: 'h23',
        }).formatToParts(date);

        const values = {};
        parts.forEach(part => {
            values[part.type] = part.value;
        });

        return {
            yyyy: values.year,
            MM: values.month,
            dd: values.day,
            HH: values.hour,
            mm: values.minute,
            ss: values.second,
            SSS: values.fractionalSecond || '000',
            EEE: values.weekday,
        };
    }

    getZoneOffsetPattern(date, timeZone) {
        const offsetLabel = this.getZoneOffsetLabel(date, timeZone);
        const normalized = offsetLabel
            .replace('UTC', '')
            .replace(/^$/, '+00:00');

        if (normalized === '0') {
            return { colon: '+00:00', compact: '+0000' };
        }

        const match = normalized.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
        if (!match) {
            return { colon: '+00:00', compact: '+0000' };
        }

        const sign = match[1];
        const hour = match[2].padStart(2, '0');
        const minute = (match[3] || '00').padStart(2, '0');

        return {
            colon: `${sign}${hour}:${minute}`,
            compact: `${sign}${hour}${minute}`,
        };
    }

    async copyWithFeedback(text, button, setStatus, successMessage) {
        if (!text || !button) return;

        try {
            await this.copyText(text);
            const originalText = button.textContent;
            button.textContent = '已复制';
            setStatus(successMessage);
            window.setTimeout(() => {
                button.textContent = originalText;
            }, 1200);
        } catch (error) {
            setStatus('复制失败，请手动复制', true);
        }
    }

    normalizeZone(zone) {
        return zone === LOCAL_ZONE_VALUE ? undefined : zone;
    }

    sameZone(left, right) {
        return (left || LOCAL_ZONE_VALUE) === (right || LOCAL_ZONE_VALUE);
    }

    getZoneName(timeZone) {
        return timeZone || this.getLocalTimeZone();
    }

    getZoneLabel(timeZone) {
        const found = TIME_ZONES.find(t => this.sameZone(this.normalizeZone(t.zone), timeZone));
        return found ? found.label : this.getZoneName(timeZone);
    }

    getLocalTimeZone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    }

    copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const copied = document.execCommand('copy');
                document.body.removeChild(textarea);
                copied ? resolve() : reject(new Error('Copy command failed'));
            } catch (error) {
                document.body.removeChild(textarea);
                reject(error);
            }
        });
    }
}
