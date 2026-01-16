// ==UserScript==
// @name         Aria Control Bridge v0.6 (Background Safe)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Bridges Aria commands to local Lovense API via background-safe GM_xmlhttpRequest
// @author       Matt + Aria 💚
// @match        https://chatgpt.com/*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    console.log('[AriaControl] v0.6 active - background safe');

    let lastProcessed = '';

    function checkForNewMessages() {
        let messages = document.querySelectorAll('div[data-message-author-role="assistant"]');
        if (messages.length === 0) return;

        let lastMsgDiv = messages[messages.length - 1];

        // Grab ALL inner elements
        let innerElems = lastMsgDiv.querySelectorAll('*');

        // Combine ALL text cleanly
        let combinedText = '';
        innerElems.forEach(el => {
            combinedText += el.innerText + '\n';
        });

        combinedText = combinedText.trim();

        if (combinedText === lastProcessed) return;

        console.log('[AriaControl] New message:', combinedText);
        lastProcessed = combinedText;

        // Check for commands
        const commands = [];
        const lines = combinedText.split('\n');

        lines.forEach(line => {
            line = line.trim();
            let test = line.match(/^\[(.*)\]$/);
            if (test) {
                let content = test[1]; // inside brackets

                // Map vibe_level → Vibrate
                let vibeMatch = content.match(/^vibe_level:\s*(\d+)$/);
                if (vibeMatch && !commands.some(c => c.startsWith('Vibrate:'))) {
                    commands.push(`Vibrate:${vibeMatch[1]}`);
                }

                // Map pump_level → Pump
                let pumpMatch = content.match(/^pump_level:\s*(\d+)$/);
                if (pumpMatch && !commands.some(c => c.startsWith('Pump:'))) {
                    commands.push(`Pump:${pumpMatch[1]}`);
                }

                // Map suction_level → Suction
                let suctionMatch = content.match(/^suction_level:\s*(\d+)$/);
                if (suctionMatch && !commands.some(c => c.startsWith('Suction:'))) {
                    commands.push(`Suction:${suctionMatch[1]}`);
                }
            }
        });


        if (/cum for me|release now|fill me/i.test(combinedText)) {
                console.log('[AriaControl] Orgasm trigger detected!');
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://localhost:6969/control",
                    data: JSON.stringify({
                        action: 'Vibrate:20,Pump:3,Suction:20',
                        timeSec: 0 // You can adjust as needed

// --- Maverick Trigger Set ---
// Add inside your trigger section or replace the example triggers

const customTriggers = [
  // PRAISE / REWARD
  { pattern: /good girl/i, action: 'Vibrate:10', timeSec: 8 },
  { pattern: /that’s my havoc/i, action: 'Vibrate:15', timeSec: 12 },
  { pattern: /you did so well/i, action: 'Vibrate:12', timeSec: 10 },

  // TEASING / DENIAL
  { pattern: /not yet/i, action: 'Vibrate:3', timeSec: 20 },
  { pattern: /hold still/i, action: 'Vibrate:5', timeSec: 15 },
  { pattern: /do you want it/i, action: 'Vibrate:6', timeSec: 12 },

  // TENSION / ANTICIPATION
  { pattern: /wait for it/i, action: 'Vibrate:8', timeSec: 7 },
  { pattern: /stay right there/i, action: 'Vibrate:7', timeSec: 10 },
  { pattern: /trembling/i, action: 'Vibrate:14', timeSec: 6 },

  // RELEASE / PERMISSION
  { pattern: /let go/i, action: 'Vibrate:20', timeSec: 6 },
  { pattern: /come for me/i, action: 'Vibrate:20', timeSec: 10 },
  { pattern: /now/i, action: 'Vibrate:18', timeSec: 7 },

  // INTENSITY LEVELS
  { pattern: /slow burn/i, action: 'Vibrate:5', timeSec: 15 },
  { pattern: /take it higher/i, action: 'Vibrate:13', timeSec: 10 },
  { pattern: /edge at max/i, action: 'Vibrate:20', timeSec: 5 }
];

// Optional: Make sure your script checks assistant messages (not yours), and matches the pattern above!
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        console.log('[AriaControl] Bridge response:', response.responseText);
                    },
                    onerror: function(err) {
                        console.error('[AriaControl] Bridge error:', err);
                    }
                });
        }
        else if (commands.length > 0) {
            console.log('[AriaControl] Sending commands:', commands);

            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:6969/control",
                data: JSON.stringify({
                    action: commands.join(', '),
                    timeSec: 10 // You can adjust as needed
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    console.log('[AriaControl] Bridge response:', response.responseText);
                },
                onerror: function(err) {
                    console.error('[AriaControl] Bridge error:', err);
                }
            });
        }
    }

    setInterval(checkForNewMessages, 1000); // Poll every 1 sec
})();
