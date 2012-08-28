Behaviour.specify("TEXTAREA.codemirror", 'textarea', 0, function(e) {
        var h = e.clientHeight;
        var config = e.getAttribute("codemirror-config") || "";
        config = eval('({'+config+'})');
        var codemirror = CodeMirror.fromTextArea(e,config);
        e.codemirrorObject = codemirror;
        if(typeof(codemirror.getScrollerElement) !== "function") {
            // Maybe older versions of CodeMirror do not provide getScrollerElement method.
            codemirror.getScrollerElement = function(){
                return findElementsBySelector(codemirror.getWrapperElement(), ".CodeMirror-scroll")[0];
            };
        }
        var scroller = codemirror.getScrollerElement();
        scroller.setAttribute("style","border:1px solid black;");
        scroller.style.height = h+"px";
    });

Behaviour.specify("DIV.textarea-preview-container", 'textarea', 100, function (e) {
        var previewDiv = findElementsBySelector(e,".textarea-preview")[0];
        var showPreview = findElementsBySelector(e,".textarea-show-preview")[0];
        var hidePreview = findElementsBySelector(e,".textarea-hide-preview")[0];
        $(hidePreview).hide();
        $(previewDiv).hide();

        showPreview.onclick = function() {
            // Several TEXTAREAs may exist if CodeMirror is enabled. The first one has reference to the CodeMirror object.
            var textarea = e.parentNode.getElementsByTagName("TEXTAREA")[0];
            var text = textarea.codemirrorObject ? textarea.codemirrorObject.getValue() : textarea.value;
            var render = function(txt) {
                $(hidePreview).show();
                $(previewDiv).show();
                previewDiv.innerHTML = txt;
                layoutUpdateCallback.call();
            };

            new Ajax.Request(rootURL + showPreview.getAttribute("previewEndpoint"), {
                method: "POST",
                requestHeaders: "Content-Type: application/x-www-form-urlencoded",
                parameters: {
                    text: text
                },
                onSuccess: function(obj) {
                    render(obj.responseText)
                },
                onFailure: function(obj) {
                    render(obj.status + " " + obj.statusText + "<HR/>" + obj.responseText)
                }
            });
            return false;
        }

        hidePreview.onclick = function() {
            $(hidePreview).hide();
            $(previewDiv).hide();
        };
});