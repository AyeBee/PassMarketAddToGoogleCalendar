// ==UserScript==
// @name         PassMarketのイベント概要Googleカレンダー連携
// @namespace    http://ayebee.net/
// @version      1.0
// @description  PassMarketのイベント概要ページに、イベント内容のGoogleカレンダー登録ボタンを追加します。
// @author       ayebee
// @match        https://passmarket.yahoo.co.jp/event/show/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const datetimeToObject = t => {const m = t.match(/^(\d+)\/(\d+)\/(\d+)\(.\) (\d+):(\d+)/); return [1*m[1], 1*m[2], 1*m[3], 1*m[4], 1*m[5]]};
    const formatDate = ([year,month,day,hours,minutes])=>`${year}${p(month)}${p(day)}T${p(hours)}${p(minutes)}00`;
    const p = (v, n=2, s='0') => String(v).padStart(n, s);

    const title = document.querySelector('#evtname > p.elItemName')?.textContent?.trim() ?? '';
    const openingTime = document.querySelector('#evtname > p.elStTime')?.textContent?.replace(/^イベント受付開始時間　(.+)～$/, "$1") ?? '-';
    const eventTimeBetween = document.querySelector('#evtname > p.elPeriod')?.textContent?.split('～') ?? Array(2);
    const start = formatDate(datetimeToObject(eventTimeBetween[0]));
    const end = formatDate(datetimeToObject(eventTimeBetween[1]));

    const place = document.querySelector('#acpthow > p.decPlace')?.textContent?.trim() ?? '';
    const address = document.querySelector('#acpthow > p.decAdd')?.textContent?.trim() ?? '';

    const data = {
        text: title,
        dates: `${start}/${end}`,
        location: `${place}, ${address}`,
        description: document.querySelector('#evtinf').textContent.trim()
    };

    data.details = `
日程: 開場 ${openingTime} 開演 ${eventTimeBetween[0]} 終演 ${eventTimeBetween[1]}
会場: ${data.location}

${data.description}
`.trim();

    const button = document.createElement('a');
    button.className = 'libButton sizSS elMail';
    button.rel = 'external';
    button.textContent = 'Google Calendar に登録';
    button.href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.text)}&dates=${data.dates}&location=${encodeURIComponent(data.location)}&details=${encodeURIComponent(data.details)}`;
    const li = document.createElement('li');
    li.append(button);
    document.querySelector('#shr > ul').append(li);
})();
