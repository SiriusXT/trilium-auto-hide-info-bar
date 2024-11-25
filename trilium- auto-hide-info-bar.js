/*
trilium-auto-hide-info-bar
Version:0.6
https://github.com/SiriusXT/trilium-auto-hide-info-bar
*/
const hidden_title = true; //true:hidden false:display
const hidden_ribbon = true; //true:hidden false:display
const pin_ribbon_title = false; //hidden by default
const delay_execution_time = 300 //The event that the mouse needs to stay when the mouse moves in, default:300ms

// ---------------------------------------------------------------------------
if (!hidden_title && !hidden_ribbon) return;
let timeoutChange;
let justLeaveSCup = false; // justLeaveSCup
let styles = `
body.tahib-pin .ribbon-tab-title.ribbon-tab-pin .bxs-pin{
    font-size: 130%;
    top: 5px;
}
body:not(.tahib-pin) .ribbon-tab-title.ribbon-tab-pin .bxs-pin{
    font-size: 130%;
    top: 5px;
    color: transparent;
    -webkit-text-stroke: 1.5px var(--left-pane-text-color);
}`
if (hidden_title) {
    styles += `body.tahib-hidden:not(.tahib-pin) .title-row {
        display: none !important;
    }`
}
if (hidden_ribbon) {
    styles += `body.tahib-hidden:not(.tahib-pin) .ribbon-container {
        display: none !important;
    }`
}

let style = document.createElement('style');
style.innerHTML = styles;
document.head.appendChild(style);

function show() {
    clearTimeout(timeoutChange);
    timeoutChange = setTimeout(() => {
        document.body.classList.remove('tahib-hidden');
    }, delay_execution_time);
}

function hidden() {
    if (hidden_title || hidden_ribbon) {
        clearTimeout(timeoutChange);
        timeoutChange = setTimeout(() => {
            document.body.classList.add('tahib-hidden');
        }, delay_execution_time);
    }
}
function togglePin() {
    document.body.classList.toggle('tahib-pin');
}

// Monitor tab bar
let retries = 0;
let interval = setInterval(() => {
    let $tabRowWidget = $('.tab-row-widget');
    let $launcherPane = $('#launcher-pane');
    let $leftPane = $('#left-pane');
    if ($tabRowWidget.length > 0 && $launcherPane.length > 0 && $leftPane.length > 0) {
        clearInterval(interval);
        $tabRowWidget.add($launcherPane).add($leftPane).mouseenter((event) => {
            show();
        });
        if (pin_ribbon_title) {
            document.body.classList.add('tahib-pin');
        }
    } else if (retries >= 100) {
        console.log('Element not found. Stopping attempts.');
        clearInterval(interval);
    }
    retries++;
}, 100);

/*No action is taken when moving out of window*/
document.addEventListener('mouseleave', (event) => {
    if (!event.relatedTarget && !justLeaveSCup) {
        clearTimeout(timeoutChange);
    }
});

const button = `<div class="ribbon-tab-title ribbon-tab-pin"'>
    <span class="ribbon-tab-title-icon bx bxs-pin"></span>
</div><div class="ribbon-tab-spacer ribbon-tab-pin"></div>`
module.exports = class extends api.NoteContextAwareWidget {
    get position() {
        return 50;
    }
    static get parentWidget() {
        return 'note-detail-pane';
    }
    constructor() {
        super();
    }
    isEnabled() {
        return super.isEnabled();
    }
    doRender() {
        this.$widget = $(``);
        return this.$widget;

    }
    async addButton() {
        const $ribbonTab = $(`.note-split[data-ntx-id="${this.noteContext.ntxId}"]`).find('.ribbon-tab-container');

        setTimeout(() => {
            if ($ribbonTab.children('.ribbon-tab-pin').length > 0) { return; }
            const $button = $(button);
            $button.first().on('click', async () => {
                togglePin();
            });
            $ribbonTab.append($button);
        }, 300);
    }
    async refreshWithNote(note) {
        this.addButton();
        const $noteSplit = $(`.note-split[data-ntx-id="${this.noteContext.ntxId}"]`);
        const $scrollingContainer = $noteSplit.find('.scrolling-container')
        const $titleAndRibbon = $noteSplit.find('.title-row, .ribbon-container');
        $scrollingContainer.mouseenter((event) => {
            hidden();
        });
        $scrollingContainer.mouseleave(function (e) {
            if (e.clientY < $(this).offset().top) {
                justLeaveSCup = true;
                setTimeout(() => { justLeaveSCup = false; }, 100);
                show();
            }
        });

        $titleAndRibbon.mouseenter((event) => {
            show();
        });
    }
}

