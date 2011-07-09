/*!
Copyright (c) 2011, Luke Gotszling
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Luke Gotszling nor the
      names of contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Luke Gotszling BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Closure
(function(){

// Load jQuery UI CSS
var css=document.createElement("link");
css.setAttribute("rel", "stylesheet");
css.setAttribute("type", "text/css");
css.setAttribute("href", "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/themes/base/jquery-ui.css");
document.getElementsByTagName("head")[0].appendChild(css);

// From http://www.logiclabz.com/javascript/dynamically-loading-javascript-file-with-callback-event-handlers.aspx
function loadScript(sScriptSrc,callbackfunction) {  
     //gets document head element  
     var oHead = document.getElementsByTagName('head')[0];  
     if(oHead)  
     {  
         //creates a new script tag        
         var oScript = document.createElement('script');  
                   
         //adds src and type attribute to script tag  
         oScript.setAttribute('src',sScriptSrc);  
         oScript.setAttribute('type','text/javascript');  
   
         //calling a function after the js is loaded (IE)  
         var loadFunction = function()  
             {  
                 if (this.readyState == 'complete' || this.readyState == 'loaded')  
                 {  
                     callbackfunction();   
                 }  
             };  
         oScript.onreadystatechange = loadFunction;  
   
         //calling a function after the js is loaded (Firefox)  
         oScript.onload = callbackfunction;  
           
         //append the script tag to document head element          
         oHead.appendChild(oScript);  
     }  
} 

// Define unique method 
Array.prototype.unique = function () {
    var r = [];
    o:for(var i = 0, n = this.length; i < n; i++)
    {
        for(var x = 0, y = r.length; x < y; x++)
        {
            if(r[x]==this[i])
            {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
};

bttrwrtr_init = function () {
    // Insert DOM container for dialog
    if ($('.bttrwrtr').length < 1) { 
        $('body').append('<div class="bttrwrtr" style="display:none;">\
            <div id="bttrwrtr_dialog" title="BttrWrtr grammar check">\
                <p id="bttrwrtr_input">The following matches have been found in input elements:</p>\
                <ul id="bttrwrtr_input_list">\
                </ul>\
                <p id="bttrwrtr_page">The following matches have been found on the page:</p>\
                <ul id="bttrwrtr_page_list">\
                </ul>\
            </div>\
        </div>');
    }

    // Weasel words
    var weasels = {
        check: function (element) {
            //this.regex.lastIndex = 0;
            return element.match(this.regex);
        },
        regex: /many|various|very|fairly|several|extremely|exceedingly|quite|remarkably|few|surprisingly|mostly|largely|huge|tiny|((are|is) a number)|excellent|interestingly|significantly|substantially|clearly|vast|relatively|completely/gim
    },

    // Passive voice
    passive = {
        check: function (element) {
            return element.match(this.regex);
        },
        regex: /(am|are|were|being|is|been|was|be)[ ]*(\w+ed|(awoken|been|born|beat|become|begun|bent|beset|bet|bid|bidden|bound|bitten|bled|blown|broken|bred|brought|broadcast|built|burnt|burst|bought|cast|caught|chosen|clung|come|cost|crept|cut|dealt|dug|dived|done|drawn|dreamt|driven|drunk|eaten|fallen|fed|felt|fought|found|fit|fled|flung|flown|forbidden|forgotten|foregone|forgiven|forsaken|frozen|gotten|given|gone|ground|grown|hung|heard|hidden|hit|held|hurt|kept|knelt|knit|known|laid|led|leapt|learnt|left|lent|let|lain|lighted|lost|made|meant|met|misspelt|mistaken|mown|overcome|overdone|overtaken|overthrown|paid|pled|proven|put|quit|read|rid|ridden|rung|risen|run|sawn|said|seen|sought|sold|sent|set|sewn|shaken|shaven|shorn|shed|shone|shod|shot|shown|shrunk|shut|sung|sunk|sat|slept|slain|slid|slung|slit|smitten|sown|spoken|sped|spent|spilt|spun|spit|split|spread|sprung|stood|stolen|stuck|stung|stunk|stridden|struck|strung|striven|sworn|swept|swollen|swum|swung|taken|taught|torn|told|thought|thrived|thrown|thrust|trodden|understood|upheld|upset|woken|worn|woven|wed|wept|wound|won|withheld|withstood|wrung|written))/gim
    },

    // Duplicate words (lexical illusions), case insensitive
    // TODO: Skip punctuation
    duplicates = {
        check: function (element) {
            return element.match(this.regex);
        },
        regex: /\b(\w+) \1\b/gim
    };

    // Input elements
    var results = {'input': {'weasels': [], 'passive': [], 'duplicates': []},
                   'page': {'weasels': [], 'passive': [], 'duplicates': []}   
    };
    var lookup_dict = {'weasels': 'Weasel words:', 'passive': 'Passive voice:', 'duplicates': 'Duplicate words:'};
    var checker = function (type, element, value) {
        var weasel_result = weasels.check(value),
            passive_result = passive.check(value),
            duplicates_result = duplicates.check(value);

        if (weasel_result){
            results[type]['weasels'] = results[type]['weasels'].concat(weasel_result).unique();
        }

        if (passive_result){
            results[type]['passive'] = results[type]['passive'].concat(passive_result).unique();
        }

        if (duplicates_result){
            results[type]['duplicates'] = results[type]['duplicates'].concat(duplicates_result).unique();
        }
    };

    // Page elements
    // Not empty and visible: div, span, p, h1, h2, h3, h4, h5, h6, a, label
    // Filtered to contain only leaf nodes
    $('div:not(:empty):visible, span:not(:empty):visible, p:not(:empty):visible, :header:not(:empty):visible, a:not(:empty):visible, label:not(:empty):visible').each(function (index) {
        if ($(this).children().length < 1) {
            checker('page',this,$(this).html()); 
            //console.log($(this).html());
            //return;
        }
    });
    // Alternate method
    $('div:not(:empty):visible, span:not(:empty):visible, p:not(:empty):visible, :header:not(:empty):visible, a:not(:empty):visible, label:not(:empty):visible').text(function (index,text) {
        return; // checker('page',this,$(this).clone().find("*").remove().end().text());
    });

    // Input text elements
    $('textarea:visible, input[type=text]:visible').each(function (index) {
        checker('input',this,$(this).val()); 
    });

    var list_builder = function (i,that,$top_ul) {
        $ul = $('<ul style="margin-left:-50px;margin-bottom:20px;font-style:italic;">'+lookup_dict[i]+'</ul>');
        $.each(that, function () {
            $('<li style="margin-left:160px;font-style:normal;">' + this + '</li>').appendTo($ul);
        });
        // Add to the top level UL
        $ul.appendTo($top_ul);
    };

    var $page_ul = $("#bttrwrtr_page_list").empty().eq(0);
    // Loop through our data
    $.each(results.page, function (i) {
        if (this.length > 0) {
            list_builder(i,this,$page_ul);
        }
    });
    var $input_ul = $("#bttrwrtr_input_list").empty().eq(0);
    // Loop through our data
    $.each(results.input, function (i) {
        if (this.length > 0) {
            list_builder(i,this,$input_ul);
        }
    });

    //console.log(results);
    $("#bttrwrtr_dialog").dialog({width:700});
};

// Load jQuery and jQueryUI
jquery_UI_init = function () { 
    if (typeof jQuery.ui !== 'object' || jQuery.ui.version !== '1.8.14' || typeof jQuery.ui.dialog !== 'function') {
        loadScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js",bttrwrtr_init);
    } else {
        bttrwrtr_init();
    }
};
if (typeof jQuery !== 'function' || jQuery.fn.jquery !== '1.6.2')
    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js",jquery_UI_init);
else {
    jquery_UI_init();
}

// End closure
})();
