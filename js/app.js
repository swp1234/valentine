// Valentine Compatibility Test App
(function() {
    'use strict';

    // State
    let person1 = { name: '', month: 0, day: 0 };
    let person2 = { name: '', month: 0, day: 0 };
    let currentQ = 0;
    let answers1 = {};
    let answers2 = {};
    let currentPerson = 1; // 1 or 2

    // DOM elements
    const screens = {
        intro: document.getElementById('intro-screen'),
        input: document.getElementById('input-screen'),
        question: document.getElementById('question-screen'),
        loading: document.getElementById('loading-screen'),
        result: document.getElementById('result-screen')
    };

    // Init
    function init() {
        document.getElementById('btn-start').addEventListener('click', showInputScreen);
        document.getElementById('btn-next').addEventListener('click', handleInputNext);
        document.getElementById('btn-retry').addEventListener('click', restart);
        document.getElementById('btn-share').addEventListener('click', shareResult);
        document.getElementById('btn-save-image').addEventListener('click', saveImage);
        document.getElementById('btn-premium').addEventListener('click', showPremium);

        // Load count
        const count = parseInt(localStorage.getItem('valentine_count') || '0');
        if (count > 0) {
            const countText = i18n.t('intro.count').replace('{count}', count.toLocaleString());
            document.getElementById('intro-count').textContent = countText;
        }

        // Floating hearts
        createFloatingHearts();
    }

    function createFloatingHearts() {
        const container = document.querySelector('.floating-hearts');
        if (!container) return;
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '🩷', '🤍'];
        for (let i = 0; i < 15; i++) {
            const span = document.createElement('span');
            span.className = 'float-heart';
            span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            span.style.left = Math.random() * 100 + '%';
            span.style.animationDelay = Math.random() * 8 + 's';
            span.style.animationDuration = (6 + Math.random() * 6) + 's';
            span.style.fontSize = (14 + Math.random() * 20) + 'px';
            span.style.opacity = 0.15 + Math.random() * 0.25;
            container.appendChild(span);
        }
    }

    // Screen transitions
    function showScreen(name) {
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screens[name].classList.remove('hidden');
        screens[name].classList.add('active');
        window.scrollTo(0, 0);
    }

    function showInputScreen() {
        currentPerson = 1;
        updateInputUI();
        showScreen('input');
    }

    function updateInputUI() {
        const isMe = currentPerson === 1;
        const infoKey = isMe ? 'input.myInfo' : 'input.partnerInfo';
        const emoji = isMe ? '💕' : '💗';
        document.getElementById('input-label').textContent = i18n.t(infoKey);
        const stepText = i18n.t('input.step').replace('{current}', currentPerson);
        document.getElementById('input-step').textContent = stepText;
        document.getElementById('input-name').value = '';
        document.getElementById('input-month').value = '';
        document.getElementById('input-day').value = '';
        const label = isMe ? i18n.t('input.myInfo') : i18n.t('input.partnerInfo');
        document.getElementById('input-name').placeholder = i18n.t('input.namePlaceholder');
        document.getElementById('input-name').focus();
    }

    function handleInputNext() {
        const name = document.getElementById('input-name').value.trim();
        const month = parseInt(document.getElementById('input-month').value);
        const day = parseInt(document.getElementById('input-day').value);

        if (!name) {
            shakeElement(document.getElementById('input-name'));
            return;
        }
        if (!month || month < 1 || month > 12) {
            shakeElement(document.getElementById('input-month'));
            return;
        }
        if (!day || day < 1 || day > 31) {
            shakeElement(document.getElementById('input-day'));
            return;
        }

        if (currentPerson === 1) {
            person1 = { name, month, day };
            currentPerson = 2;
            updateInputUI();
        } else {
            person2 = { name, month, day };
            startQuiz();
        }
    }

    function shakeElement(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 500);
    }

    // Quiz
    function startQuiz() {
        currentQ = 0;
        answers1 = {};
        answers2 = {};
        currentPerson = 1;
        showQuestion();
        showScreen('question');
    }

    function showQuestion() {
        const q = QUESTIONS[currentQ];
        const who = currentPerson === 1 ? person1.name : person2.name;
        const whoEmoji = currentPerson === 1 ? '💕' : '💗';
        const qKey = currentPerson === 1 ? 'question.myAnswer' : 'question.partnerAnswer';
        const qText = i18n.t(qKey).replace('{name}', `${whoEmoji} ${who}님`);

        document.getElementById('q-who').textContent = qText;
        document.getElementById('q-text').textContent = q.text;

        const total = QUESTIONS.length * 2;
        const current = currentQ + (currentPerson === 1 ? 0 : QUESTIONS.length);
        document.getElementById('progress-fill').style.width = ((current + 1) / total * 100) + '%';
        const progressText = i18n.t('question.progress')
            .replace('{current}', current + 1)
            .replace('{total}', total);
        document.getElementById('progress-text').textContent = progressText;

        const optionsEl = document.getElementById('q-options');
        optionsEl.innerHTML = '';

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'q-option';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => selectOption(opt.type, btn));
            optionsEl.appendChild(btn);
        });
    }

    function selectOption(type, btn) {
        // Disable all buttons
        document.querySelectorAll('.q-option').forEach(b => b.disabled = true);
        btn.classList.add('selected');

        if (currentPerson === 1) {
            answers1[currentQ] = type;
        } else {
            answers2[currentQ] = type;
        }

        setTimeout(() => {
            currentQ++;
            if (currentQ >= QUESTIONS.length) {
                if (currentPerson === 1) {
                    // Switch to person 2
                    currentPerson = 2;
                    currentQ = 0;
                    showQuestion();
                } else {
                    // All done
                    showLoadingScreen();
                }
            } else {
                showQuestion();
            }
        }, 400);
    }

    // Loading
    function showLoadingScreen() {
        showScreen('loading');
        let progress = 0;
        const fill = document.getElementById('loading-fill');
        const msgs = [
            i18n.t('loading.msg1'),
            i18n.t('loading.msg2'),
            i18n.t('loading.msg3'),
            i18n.t('loading.msg4'),
            i18n.t('loading.msg5')
        ];
        const msgEl = document.getElementById('loading-text');

        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(showResult, 500);
            }
            fill.style.width = progress + '%';
            const msgIdx = Math.min(Math.floor(progress / 20), msgs.length - 1);
            msgEl.textContent = msgs[msgIdx];
        }, 400);
    }

    // Calculate compatibility
    function calculateResult() {
        // 1. Name compatibility (30%)
        const nameScore = calcNameCompat(person1.name, person2.name);

        // 2. Zodiac/Birthday compatibility (30%)
        const zodiacScore = calcZodiacCompat(person1.month, person1.day, person2.month, person2.day);

        // 3. Quiz answer compatibility (40%)
        const quizScore = calcQuizCompat();

        // Weighted total
        const total = Math.round(nameScore * 0.3 + zodiacScore * 0.3 + quizScore * 0.4);

        // Determine love types
        const type1 = getDominantType(answers1);
        const type2 = getDominantType(answers2);

        return {
            total: Math.max(10, Math.min(99, total)),
            nameScore,
            zodiacScore,
            quizScore,
            type1,
            type2,
            zodiac1: getZodiacSign(person1.month, person1.day),
            zodiac2: getZodiacSign(person2.month, person2.day)
        };
    }

    function calcNameCompat(name1, name2) {
        // Korean name stroke compatibility
        const strokes1 = getNameStrokes(name1);
        const strokes2 = getNameStrokes(name2);

        if (strokes1.length === 0 || strokes2.length === 0) {
            // Non-Korean names: use character code based
            return hashCompat(name1, name2);
        }

        // Interleave strokes and reduce
        let combined = [];
        const maxLen = Math.max(strokes1.length, strokes2.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < strokes1.length) combined.push(strokes1[i]);
            if (i < strokes2.length) combined.push(strokes2[i]);
        }

        // Reduce by summing adjacent pairs
        while (combined.length > 2) {
            let next = [];
            for (let i = 0; i < combined.length - 1; i++) {
                next.push((combined[i] + combined[i + 1]) % 10);
            }
            combined = next;
        }

        let result = combined[0] * 10 + (combined[1] || 0);
        if (result < 10) result = result * 10 + Math.floor(Math.random() * 3 + 5);
        return Math.min(99, result);
    }

    function getNameStrokes(name) {
        const strokes = [];
        const CHOSEONG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
        const JUNGSEONG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
        const JONGSEONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

        for (const ch of name) {
            const code = ch.charCodeAt(0);
            if (code >= 0xAC00 && code <= 0xD7A3) {
                // Complete Hangul syllable
                const offset = code - 0xAC00;
                const cho = Math.floor(offset / (21 * 28));
                const jung = Math.floor((offset % (21 * 28)) / 28);
                const jong = offset % 28;

                const choChar = CHOSEONG[cho];
                const jungChar = JUNGSEONG[jung];
                const jongChar = JONGSEONG[jong];

                strokes.push(CONSONANT_STROKES[choChar] || 2);
                strokes.push(VOWEL_STROKES[jungChar] || 2);
                if (jong > 0 && jongChar) {
                    strokes.push(JONGSEONG_STROKES[jongChar] || 2);
                }
            } else if (CONSONANT_STROKES[ch]) {
                // Standalone consonant (ㄱ, ㄴ, etc.)
                strokes.push(CONSONANT_STROKES[ch]);
            } else if (VOWEL_STROKES[ch]) {
                // Standalone vowel (ㅏ, ㅓ, etc.)
                strokes.push(VOWEL_STROKES[ch]);
            }
            // Non-Korean characters are skipped
        }
        return strokes;
    }

    function hashCompat(name1, name2) {
        let hash = 0;
        const combined = name1 + name2;
        for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash % 60) + 30; // 30-89
    }

    function getZodiacSign(month, day) {
        // Capricorn spans year boundary (Dec 22 - Jan 19), handle separately
        const capricorn = ZODIAC_SIGNS[11];
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
            return capricorn;
        }
        for (const sign of ZODIAC_SIGNS) {
            const [start, end] = sign.range;
            if (start[0] === 12) continue; // Skip Capricorn in loop
            if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
                return sign;
            }
        }
        return capricorn;
    }

    function calcZodiacCompat(m1, d1, m2, d2) {
        const z1 = getZodiacSign(m1, d1);
        const z2 = getZodiacSign(m2, d2);
        const key = `${z1.element}-${z2.element}`;
        return ELEMENT_COMPAT[key] || 65;
    }

    function calcQuizCompat() {
        let matchCount = 0;
        let typeMatch = 0;

        for (let i = 0; i < QUESTIONS.length; i++) {
            if (answers1[i] === answers2[i]) {
                matchCount++;
            }
            // Check type compatibility
            const key = answers1[i] + answers2[i];
            typeMatch += (TYPE_COMPAT[key] || 60);
        }

        const exactMatch = (matchCount / QUESTIONS.length) * 100;
        const typeAvg = typeMatch / QUESTIONS.length;
        return Math.round(exactMatch * 0.4 + typeAvg * 0.6);
    }

    function getDominantType(answers) {
        const counts = { S: 0, C: 0, A: 0, T: 0 };
        Object.values(answers).forEach(t => counts[t]++);
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    // Show Result
    function showResult() {
        const result = calculateResult();
        const level = RESULT_LEVELS.find(l => result.total >= l.min && result.total <= l.max);

        // Update count
        const count = parseInt(localStorage.getItem('valentine_count') || '0') + 1;
        localStorage.setItem('valentine_count', count);

        // Animate score
        showScreen('result');
        const scoreEl = document.getElementById('result-score');
        animateNumber(scoreEl, 0, result.total, 1500);

        // Heart fill
        const heartFill = document.getElementById('heart-fill');
        setTimeout(() => {
            heartFill.style.height = result.total + '%';
        }, 300);

        // Title & description
        document.getElementById('result-emoji').textContent = level.emoji;
        document.getElementById('result-title').textContent = level.title;
        document.getElementById('result-title').style.color = level.color;
        document.getElementById('result-desc').textContent = level.desc;

        // Names
        document.getElementById('result-names').innerHTML =
            `<span class="name-tag">${person1.name}</span>` +
            `<span class="heart-between">❤️</span>` +
            `<span class="name-tag">${person2.name}</span>`;

        // Detail scores
        document.getElementById('detail-name-score').textContent = result.nameScore + '%';
        document.getElementById('detail-zodiac-score').textContent = result.zodiacScore + '%';
        document.getElementById('detail-quiz-score').textContent = result.quizScore + '%';

        // Name bar
        document.getElementById('detail-name-bar').style.width = result.nameScore + '%';
        document.getElementById('detail-zodiac-bar').style.width = result.zodiacScore + '%';
        document.getElementById('detail-quiz-bar').style.width = result.quizScore + '%';

        // Zodiac info
        document.getElementById('zodiac-info').innerHTML =
            `${result.zodiac1.emoji} ${person1.name} (${result.zodiac1.name}) × ` +
            `${result.zodiac2.emoji} ${person2.name} (${result.zodiac2.name})`;

        // Love types
        const lt1 = LOVE_TYPES[result.type1];
        const lt2 = LOVE_TYPES[result.type2];
        document.getElementById('love-type-1').innerHTML =
            `<div class="lt-emoji">${lt1.emoji}</div>` +
            `<div class="lt-name">${person1.name}</div>` +
            `<div class="lt-type">${lt1.name}</div>`;
        document.getElementById('love-type-2').innerHTML =
            `<div class="lt-emoji">${lt2.emoji}</div>` +
            `<div class="lt-name">${person2.name}</div>` +
            `<div class="lt-type">${lt2.name}</div>`;

        // Love style
        document.getElementById('love-style').textContent = level.loveStyle;

        // Tips
        const tipsList = document.getElementById('result-tips');
        tipsList.innerHTML = level.tips.map(t => `<li>${t}</li>`).join('');

        // Store result for sharing
        window._result = result;
        window._level = level;

        // GA event
        if (typeof gtag === 'function') {
            gtag('event', 'test_complete', {
                event_category: 'valentine',
                event_label: level.title,
                value: result.total
            });
        }
    }

    function animateNumber(el, from, to, duration) {
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(from + (to - from) * eased) + '%';
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Premium
    function showPremium() {
        const overlay = document.getElementById('ad-overlay');
        overlay.classList.remove('hidden');
        let countdown = 5;
        const countEl = document.getElementById('ad-countdown');
        const closeBtn = document.getElementById('btn-close-ad');
        countEl.textContent = countdown;
        closeBtn.classList.add('hidden');

        const timer = setInterval(() => {
            countdown--;
            countEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timer);
                closeBtn.classList.remove('hidden');
            }
        }, 1000);

        closeBtn.onclick = () => {
            overlay.classList.add('hidden');
            showPremiumContent();
        };
    }

    function showPremiumContent() {
        const result = window._result;
        const level = window._level;
        const lt1 = LOVE_TYPES[result.type1];
        const lt2 = LOVE_TYPES[result.type2];

        // Get element names
        const elements = i18n.t('premium.element');
        const getElementName = (e) => elements[e] || e;

        // Build premium content
        const analysisTxt = i18n.t('premium.analysisText')
            .replace('{p1Name}', person1.name)
            .replace('{type1}', lt1.name)
            .replace('{desc1}', lt1.desc)
            .replace('{p2Name}', person2.name)
            .replace('{type2}', lt2.name)
            .replace('{desc2}', lt2.desc);

        const typeCompatTxt = i18n.t('premium.typeCompat')
            .replace('{score}', TYPE_COMPAT[result.type1 + result.type2] || 70);

        const zodiacTxt = i18n.t('premium.zodiacText')
            .replace('{z1Emoji}', result.zodiac1.emoji)
            .replace('{z1Name}', result.zodiac1.name)
            .replace('{z1Element}', getElementName(result.zodiac1.element))
            .replace('{z2Emoji}', result.zodiac2.emoji)
            .replace('{z2Name}', result.zodiac2.name)
            .replace('{z2Element}', getElementName(result.zodiac2.element));

        const coupleAdviceTxt = getCoupleAdvice(result.total, result.type1, result.type2);
        const dateRecTxt = i18n.t('premium.dateRecommendation')
            .replace('{recommendation}', getDateRecommendation(result.type1, result.type2));
        const luckyColorTxt = i18n.t('premium.luckyColor')
            .replace('{color}', getLuckyColor(result.total));

        const content = document.getElementById('premium-content');
        content.innerHTML = `
            <div class="premium-section">
                <h4>${i18n.t('premium.deepAnalysis')}</h4>
                <p>${analysisTxt}</p>
                <p>${typeCompatTxt}</p>
            </div>
            <div class="premium-section">
                <h4>${i18n.t('premium.zodiacAnalysis')}</h4>
                <p>${zodiacTxt}</p>
                <p>${getElementAnalysis(result.zodiac1.element, result.zodiac2.element)}</p>
            </div>
            <div class="premium-section">
                <h4>${i18n.t('premium.coupleAdvice')}</h4>
                <p>${coupleAdviceTxt}</p>
            </div>
            <div class="premium-section">
                <h4>${i18n.t('premium.luckyDate')}</h4>
                <p>${dateRecTxt}</p>
                <p>${luckyColorTxt}</p>
            </div>
        `;

        document.getElementById('premium-result').classList.remove('hidden');
        document.getElementById('premium-result').scrollIntoView({ behavior: 'smooth' });
    }

    function getElementAnalysis(e1, e2) {
        const key1 = `${e1}-${e2}`;
        const key2 = `${e2}-${e1}`;
        const analyses = i18n.t('premium.analysisResult');
        return analyses[key1] || analyses[key2] || i18n.t('premium.analysisResult.default');
    }

    function getCoupleAdvice(score, t1, t2) {
        if (score >= 80) return i18n.t('premium.coupleAdviceHigh');
        if (score >= 60) return i18n.t('premium.coupleAdviceMid');
        return i18n.t('premium.coupleAdviceLow');
    }

    function getDateRecommendation(t1, t2) {
        const types = t1 + t2;
        const recs = i18n.t('dateRecs');
        return recs[types] || recs[t2 + t1] || recs['default'];
    }

    function getLuckyColor(score) {
        const colors = i18n.t('luckyColors');
        if (score >= 80) return colors['high'];
        if (score >= 60) return colors['mid'];
        return colors['low'];
    }

    // Share
    function shareResult() {
        const result = window._result;
        const level = window._level;
        const shareText = i18n.t('share.text')
            .replace('{p1Name}', person1.name)
            .replace('{p2Name}', person2.name)
            .replace('{score}', result.total)
            .replace('{emoji}', level.emoji)
            .replace('{title}', level.title);
        const url = 'https://dopabrain.com/valentine/';

        if (navigator.share) {
            navigator.share({ title: i18n.t('app.title'), text: shareText, url }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareText + ' ' + url).then(() => {
                showToast(i18n.t('share.clipboardSuccess'));
            });
        }
    }

    function saveImage() {
        const canvas = document.getElementById('share-canvas');
        const ctx = canvas.getContext('2d');
        const result = window._result;
        const level = window._level;

        canvas.width = 1080;
        canvas.height = 1080;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, '#1a0011');
        grad.addColorStop(0.5, '#2d0024');
        grad.addColorStop(1, '#0d001a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Decorative hearts
        ctx.font = '80px serif';
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 12; i++) {
            ctx.fillText('💕', Math.random() * 1000, Math.random() * 1000);
        }
        ctx.globalAlpha = 1;

        // Title
        ctx.font = 'bold 48px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(i18n.t('image.title'), 540, 100);

        // Names
        ctx.font = 'bold 56px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = '#ff6b9d';
        ctx.fillText(`${person1.name}  ❤️  ${person2.name}`, 540, 220);

        // Score circle
        ctx.beginPath();
        ctx.arc(540, 440, 160, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 75, 145, 0.15)';
        ctx.fill();
        ctx.strokeStyle = level.color;
        ctx.lineWidth = 8;
        ctx.stroke();

        // Score arc
        ctx.beginPath();
        ctx.arc(540, 440, 160, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * result.total / 100));
        ctx.strokeStyle = level.color;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.font = 'bold 100px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(result.total + '%', 540, 470);

        // Result emoji & title
        ctx.font = '72px serif';
        ctx.fillText(level.emoji, 540, 680);

        ctx.font = 'bold 44px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = level.color;
        ctx.fillText(level.title, 540, 750);

        // Love style
        ctx.font = '28px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(level.loveStyle, 540, 820);

        // Detail scores
        ctx.font = '26px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        const detailText = `${i18n.t('image.nameScoreLabel')} ${result.nameScore}%  |  ${i18n.t('image.zodiacScoreLabel')} ${result.zodiacScore}%  |  ${i18n.t('image.quizScoreLabel')} ${result.quizScore}%`;
        ctx.fillText(detailText, 540, 900);

        // Footer
        ctx.font = '24px "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(i18n.t('image.footer'), 540, 1020);

        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `valentine_${person1.name}_${person2.name}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    function showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function restart() {
        person1 = { name: '', month: 0, day: 0 };
        person2 = { name: '', month: 0, day: 0 };
        currentQ = 0;
        answers1 = {};
        answers2 = {};
        currentPerson = 1;
        document.getElementById('premium-result').classList.add('hidden');
        showScreen('intro');
    }

    // Start
    init();
})();
