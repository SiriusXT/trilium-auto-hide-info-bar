/*
trilium-auto-hide-info-bar
https://github.com/SiriusXT/trilium-auto-hide-info-bar
version:0.5
*/
var hidden_title = true; //true:hidden false:display
var hidden_ribbon = true; //true:hidden false:display
var pin_ribbon_title = false; //hidden by default
var delay_execution_time = 300 //The event that the mouse needs to stay when the mouse moves in, default:100ms




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
        $('div.component.note-split:not(.hidden-ext) div.shared-info-widget.alert.alert-warning.component').css('display', 'block');
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
        $('div.component.note-split:not(.hidden-ext) div.shared-info-widget.alert.alert-warning.component').css('display', 'none');
    }
    if (hidden_title) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('display', 'none');
    }
    if (!hidden_title && hidden_ribbon) {
        $('div.component.note-split:not(.hidden-ext) div.component.title-row').css('border-bottom', '1px solid var(--main-border-color)');
    }
    if (hidden_title && hidden_ribbon) {
        $('div#rest-pane.component div.tab-row-widget.component').css('border-bottom', '0px solid var(--main-border-color)');//1px
    }
}

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
		content: "\\ee70";
	}
</style>`);
        return this.$widget;
    }

    async refreshWithNote(note) {
        $(document).ready(function () {            
            if (!$("div.component.note-split:not(.hidden-ext) div.ribbon-tab-title").hasClass('hidden-ribbon-pin')) {
                $("div.component.note-split:not(.hidden-ext) .ribbon-tab-title:not(.backToHis)").last().after(`<div class="hidden-ribbon-pin ribbon-tab-spacer" ></div>
<div  class="hidden-ribbon-pin ribbon-tab-title" >
	<span  class="hidden-ribbon-pin ribbon-tab-title-icon bx hidden" title="Pin Ribbon Tab Title"></span>
</div>`);
            }
            $('div.component.note-split:not(.hidden-ext) div.hidden-ribbon-pin.ribbon-tab-title').off("click", pinButton);
            $('div.component.note-split:not(.hidden-ext) div.hidden-ribbon-pin.ribbon-tab-title').on("click", pinButton);
            if (pin_ribbon_title==true){
                $('.hidden-ribbon-pin.ribbon-tab-title-icon.bx').removeClass('hidden').addClass('pin');
            }
            display();
            var timeoutEnter,timeoutLeave;
            $("div.component.note-split:not(.hidden-ext) div.component.scrolling-container").mouseenter(function () {
                clearTimeout(timeoutEnter); 
                clearTimeout(timeoutLeave);
                timeoutEnter = setTimeout(function () {
                    if (!pin_ribbon_title) {
                    hidden(); 
                }
                }, delay_execution_time); 
            })
            $('div.component.note-split:not(.hidden-ext) div.component.title-row').mouseenter(function (event) {
                clearTimeout(timeoutEnter); 
                clearTimeout(timeoutLeave);
                timeoutLeave = setTimeout(function () {
                        display();
                    },delay_execution_time);
            });
            $('div.tab-row-widget.component').mouseenter(function (event) {
                clearTimeout(timeoutEnter); 
                clearTimeout(timeoutLeave);
                timeoutLeave = setTimeout(function () {
                        display();
                    },delay_execution_time);
            });
            $('div.component.note-split:not(.hidden-ext) div.ribbon-container.component').mouseenter(function (event) {
                clearTimeout(timeoutEnter); 
                clearTimeout(timeoutLeave);
                timeoutLeave = setTimeout(function () {
                        display();
                    },delay_execution_time);
            });
          
        });
    }

}

module.exports = new hiddenRibbon();


