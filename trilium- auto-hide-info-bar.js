/*
trilium-auto-hide-info-bar
https://github.com/SiriusXT/trilium-auto-hide-info-bar
version:0.1
*/
var hidden_title = true; //true:hidden false:display
var hidden_ribbon = true; //true:hidden false:display
var pin_ribbon_title = false; //hidden by default
var delay_execution_time = 100 //Delay execution time when the mouse is moved in, default:100ms
if (!hidden_title && !hidden_ribbon) { return }
var pinButton = function () {
    pin_ribbon_title = !pin_ribbon_title;
    if (pin_ribbon_title) {
        $('.hidden-ribbon-pin.ribbon-tab-title-icon.bx').removeClass('hidden').addClass('pin');
    } else {
        $('.hidden-ribbon-pin.ribbon-tab-title-icon.bx').removeClass('pin').addClass('hidden');
    }
};
function display() {
    if (hidden_ribbon) {
        $('div.component.note-split:not(.hidden-ext) div.ribbon-container.component').css('display', 'block');
    }
    if (hidden_title) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('display', 'flex');
    }
    if (!hidden_title && hidden_ribbon) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('border-bottom', '');
    }
    if (hidden_title && hidden_ribbon) {
        $('div#rest-pane.component div.tab-row-widget.component').css('border-bottom', '');
    }
}
function hidden() {
    if (hidden_ribbon) {
        $('div.component.note-split:not(.hidden-ext) div.ribbon-container.component').css('display', 'none');
    }
    if (hidden_title) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('display', 'none');
    }
    if (!hidden_title && hidden_ribbon) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('border-bottom', '1px solid var(--main-border-color)');
    }
    if (hidden_title && hidden_ribbon) {
        $('div#rest-pane.component div.tab-row-widget.component').css('border-bottom', '1px solid var(--main-border-color)');
    }
}

var inTab = false;
class hiddenRibbon extends api.NoteContextAwareWidget {
    get parentWidget() {
        return 'center-pane';
    }
    doRender() {
        this.$widget = $(`<style type="text/css">
	.hidden-ribbon-pin.ribbon-tab-title-icon.bx.hidden:before {
		content: "\\ebbb";
	}
    .hidden-ribbon-pin.ribbon-tab-title-icon.bx.pin::before {
		content: "\\ebbb";
        color: var(--main-text-color);
	}
</style>`);
        return this.$widget;
    }

    async refreshWithNote(note) {
        if (!pin_ribbon_title) {
            hidden();
        }
        $(document).ready(function () {
            if (!$("div.component.note-split:not(.hidden-ext) div.ribbon-tab-title").hasClass('hidden-ribbon-pin')) {
                $("div.component.note-split:not(.hidden-ext) .ribbon-tab-title:not(.backToHis)").last().after(`<div class="hidden-ribbon-pin ribbon-tab-spacer" ></div>
<div  class="hidden-ribbon-pin ribbon-tab-title" >
	<span  class="hidden-ribbon-pin ribbon-tab-title-icon bx hidden" title="Pin Ribbon Tab Title"></span>
</div>`);
            }
            $('div.hidden-ribbon-pin.ribbon-tab-title').click(function () {
                pinButton();
            });

            if (!pin_ribbon_title && !inTab) {
                hidden();
                $('.hidden-ribbon-pin.ribbon-tab-title-icon.bx').removeClass('pin').addClass('hidden');
            }

            else {
                display();
                $('.hidden-ribbon-pin.ribbon-tab-title-icon.bx').removeClass('hidden').addClass('pin');
            }

            var timeoutEnter, timeoutLeave;
            $("div.component.note-split:not(.hidden-ext) div.component.scrolling-container").mouseenter(function () {
                clearTimeout(timeoutEnter);
                clearTimeout(timeoutLeave);
                timeoutEnter = setTimeout(function () {
                    if (!pin_ribbon_title) {
                        hidden();
                        inTab = false;
                    }
                }, delay_execution_time);
            }).mouseleave(function (event) {
                clearTimeout(timeoutEnter);
                clearTimeout(timeoutLeave);
                if (event.pageY < $(this).offset().top) {
                    timeoutLeave = setTimeout(function () {
                        display();
                        inTab = true;
                    }, delay_execution_time);
                }
            });


        });
    }

}

module.exports = new hiddenRibbon();


