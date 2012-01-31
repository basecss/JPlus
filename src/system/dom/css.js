//===========================================
//  动态CSS  css.js      A
//===========================================



namespace("CSS.",  function(){
	var rules = null;
   	var doc = document;

    var camelRe = /(-[a-z])/gi;
    var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

   return {
   
   createStyleSheet : function(cssText){
       var ss;
       if(Ext.isIE){
           ss = doc.createStyleSheet();
           ss.cssText = cssText;
       }else{
           var head = doc.getElementsByTagName("head")[0];
           var rules = doc.createElement("style");
           rules.setAttribute("type", "text/css");
           try{
                rules.appendChild(doc.createTextNode(cssText));
           }catch(e){
               rules.cssText = cssText; 
           }
           head.appendChild(rules);
           ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length-1]);
       }
       this.cacheStyleSheet(ss);
       return ss;
   },

   
   removeStyleSheet : function(id){
       var existing = doc.getElementById(id);
       if(existing){
           existing.parentNode.removeChild(existing);
       }
   },

   
   swapStyleSheet : function(id, url){
       this.removeStyleSheet(id);
       var ss = doc.createElement("link");
       ss.setAttribute("rel", "stylesheet");
       ss.setAttribute("type", "text/css");
       ss.setAttribute("id", id);
       ss.setAttribute("href", url);
       doc.getElementsByTagName("head")[0].appendChild(ss);
   },
   
   
   refreshCache : function(){
       return this.getRules(true);
   },

   
   cacheStyleSheet : function(ss){
       if(!rules){
           rules = {};
       }
       try{
           var ssRules = ss.cssRules || ss.rules;
           for(var j = ssRules.length-1; j >= 0; --j){
               rules[ssRules[j].selectorText] = ssRules[j];
           }
       }catch(e){}
   },
   
   
   getRules : function(refreshCache){
   		if(rules == null || refreshCache){
   			rules = {};
   			var ds = doc.styleSheets;
   			for(var i =0, len = ds.length; i < len; i++){
   			    try{
    		        this.cacheStyleSheet(ds[i]);
    		    }catch(e){} 
	        }
   		}
   		return rules;
   	},
   	
   	
   getRule : function(selector, refreshCache){
   		var rs = this.getRules(refreshCache);
   		if(!(selector instanceof Array)){
   		    return rs[selector];
   		}
   		for(var i = 0; i < selector.length; i++){
			if(rs[selector[i]]){
				return rs[selector[i]];
			}
		}
		return null;
   	},
   	
   	
   	
   updateRule : function(selector, property, value){
   		if(!(selector instanceof Array)){
   			var rule = this.getRule(selector);
   			if(rule){
   				rule.style[property.replace(camelRe, camelFn)] = value;
   				return true;
   			}
   		}else{
   			for(var i = 0; i < selector.length; i++){
   				if(this.updateRule(selector[i], property, value)){
   					return true;
   				}
   			}
   		}
   		return false;
   	},
   	
   	/**
     * dynamicStyleMap - <Hash> used to keep a reference to dynamically
     * created style sheets for quick access
     */
    dynamicStyleMap: new Hash(),
    /**
     * APIMethod: getCssRule
     * retrieve a reference to a CSS rule in a specific style sheet based on
     * its selector.  If the rule does not exist, create it.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to get the rule from
     *
     * Returns:
     * <CSSRule> - the requested rule
     */
    getCssRule: function(selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule = null,
            i;
        if (ss.indicies) {
            i = ss.indicies.indexOf(selector);
            if (i == -1) {
                rule = this.insertCssRule(selector, '', styleSheetName);
            } else {
                if (Browser.Engine.trident) {
                    rule = ss.sheet.rules[i];
                } else {
                    rule = ss.sheet.cssRules[i];
                }
            }
        }
        return rule;
    },
    /**
     * APIMethod: insertCssRule
     * insert a new dynamic rule into the given stylesheet.  If no name is
     * given for the stylesheet then the default stylesheet is used.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * declaration - <String> CSS-formatted rules to include.  May be empty,
     * in which case you may want to use the returned rule object to
     * manipulate styles
     * styleSheetName - <String> the name of the sheet to place the rules in,
     * or empty to put them in a default sheet.
     *
     * Returns:
     * <CSSRule> - a CSS Rule object with properties that are browser
     * dependent.  In general, you can use rule.styles to set any CSS
     * properties in the same way that you would set them on a DOM object.
     */
    insertCssRule: function (selector, declaration, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule,
            text = selector + " {" + declaration + "}",
            index;
        if (Browser.Engine.trident) {
            if (declaration == '') {
                //IE requires SOME text for the declaration. Passing '{}' will
                //create an empty rule.
                declaration = '{}';
            }
            index = ss.styleSheet.addRule(selector,declaration);
            rule = ss.styleSheet.rules[index];
        } else {
            ss.sheet.insertRule(text, ss.indicies.length);
            rule = ss.sheet.cssRules[ss.indicies.length];
        }
        ss.indicies.push(selector);
        return rule;
    },
    /**
     * APIMethod: removeCssRule
     * removes a CSS rule from the named stylesheet.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to remove the rule
     * from,  or empty to remove them from the default sheet.
     *
     * Returns:
     * <Boolean> true if the rule was removed, false if it was not.
     */
    removeCssRule: function (selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            i = ss.indicies.indexOf(selector),
            result = false;
        ss.indicies.splice(i, 1);
        if (Browser.Engine.trident) {
            ss.removeRule(i);
            result = true;
        } else {
            ss.sheet.deleteRule(i);
            result = true;
        }
        return result;
    },
    /**
     * APIMethod: getDynamicStyleSheet
     * return a reference to a styleSheet based on its title.  If the sheet
     * does not already exist, it is created.
     *
     * Parameter:
     * name - <String> the title of the stylesheet to create or obtain
     *
     * Returns:
     * <StyleSheet> a StyleSheet object with browser dependent capabilities.
     */
    getDynamicStyleSheet: function (name) {
        name = (name) ? name : 'default';
        if (!this.dynamicStyleMap.has(name)) {
            var sheet = new Element('style').set('type', 'text/css').inject(document.head);
            sheet.indicies = [];
            this.dynamicStyleMap.set(name, sheet);
        }
        return this.dynamicStyleMap.get(name);
    },
    /**
     * APIMethod: enableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to enable
     */
    enableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = false;
    },
    /**
     * APIMethod: disableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to disable
     */
    disableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = true;
    },
    /**
     * APIMethod: removeStyleSheet
     * Removes a style sheet
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    removeStyleSheet: function (name) {
      this.disableStyleSheet(name);
      this.getDynamicStyleSheet(name).dispose();
      this.dynamicStyleMap.erase(name);
    },
    /**
     * APIMethod: isStyleSheetDefined
     * Determined if the passed in name is a defined dynamic style sheet.
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    isStyleSheetDefined: function (name) {
      return this.dynamicStyleMap.has(name);
    }
   };	
});
