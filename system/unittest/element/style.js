module("Styles");

test("Control.prototype.getStyle", function() {

	equals( Dom.get("qunit-fixture").getStyle("display"), "block", "Check for css property \"display\"");

	ok( !Dom.isHidden(Dom.get("nothiddendiv").dom), "Modifying CSS display: Assert element is visible");
	Dom.get("nothiddendiv").setStyle('display', "none");
	ok( Dom.isHidden(Dom.get("nothiddendiv").dom), "Modified CSS display: Assert element is hidden");
	Dom.get("nothiddendiv").setStyle('display', "block");
	ok( ! Dom.isHidden(Dom.get("nothiddendiv").dom), "Modified CSS display: Assert element is visible");

	var div = Dom.parse( "<div>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equals( div.getWidth(), 0, "Width on disconnected node." );
	equals( div.getHeight(), 0, "Height on disconnected node." );

	div.setStyle('width', 4).setStyle('height', 4);

	equals( div.getStyle("width"), "4px", "Width on disconnected node." );
	equals( div.getStyle("height"), "4px", "Height on disconnected node." );

	var div2 = Dom.parse( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo();

	equals( div2.find("input").getStyle("height"), "20px", "Height on hidden input." );
	equals( div2.find("textarea").getStyle("height"), "20px", "Height on hidden textarea." );
	equals( div2.find("div").getStyle("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by ignoring #1599, #4216
	Dom.get("nothiddendiv").setStyle('width', 1).setStyle('height', 1);

	var width = parseFloat(Dom.get("nothiddendiv").getStyle("width")), height = parseFloat(Dom.get("nothiddendiv").getStyle("height"));
	Dom.get("nothiddendiv").setStyle('width', -1).setStyle('height', -1);
	
	equals( Dom.parse("<div style='display: none;'>").getStyle("display"), "none", "Styles on disconnected nodes");

	Dom.get("floatTest").setStyle("float", "right");
	equals( Dom.get("floatTest").getStyle("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	Dom.get("floatTest").setStyle("font-size",  "30px");
	equals( Dom.get("floatTest").getStyle("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	String.map("0 0.25 0.5 0.75 1", function(n, i) {
		Dom.get("foo").setStyle('opacity', n);

		equals( Dom.get("foo").getStyle("opacity"), n, "Assert opacity is " + n + " as a String" );
		Dom.get("foo").setStyle('opacity', parseFloat(n));
		equals( Dom.get("foo").getStyle("opacity"), n, "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	Dom.get("foo").setStyle('opacity', "");
	equals( Dom.get("foo").getStyle("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	Dom.get("empty").setStyle('opacity', "1");
	equals( Dom.get("empty").getStyle("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );
	eval("-[1,]") ?
		ok(true, "Requires the same number of tests"):
		ok( ~Dom.get("empty").dom.currentStyle.filter.indexOf("gradient"), "Assert setting opacity doesn't overwrite other filters of the stylesheet in IE" );

	var div = Dom.get("nothiddendiv"), child = Dom.get("nothiddendivchild");

	equals( parseInt(div.getStyle("fontSize")), 16, "Verify fontSize px set." );
	equals( parseInt(div.getStyle("font-size")), 16, "Verify fontSize px set." );
	equals( parseInt(child.getStyle("fontSize")), 16, "Verify fontSize px set." );
	equals( parseInt(child.getStyle("font-size")), 16, "Verify fontSize px set." );

	child.setStyle("height", "100%");
	equals( child.dom.style.height, "100%", "Make sure the height is being set correctly." );

	child.setAttr("class", "em");
	equals( parseInt(child.getStyle("fontSize")), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.setAttr("class", "prct");
	var prctval = parseInt(child.getStyle("fontSize")), checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equals( prctval, checkval, "Verify fontSize % set." );

	equals( typeof child.getStyle("width"), "string", "Make sure that a string width is returned from css('width')." );

	var old = child.dom.style.height;

	// Test NaN
	//child.setStyle("height", parseFloat("zoo"));
	//equals( child.style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	//child.setStyle("height", null);
	//equals( child.style.height, old, "Make sure height isn't changed on null." );

	old = child.dom.style.fontSize;

	// Test NaN
	//child.setStyle("font-size", parseFloat("zoo"));
	//equals( child.style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.setStyle("font-size", null);
	equals( child.dom.style.fontSize, old, "Make sure font-size isn't changed on null." );
});

test("Control.prototype.setStyle", function() {

	ok( !Dom.isHidden(Dom.get("nothiddendiv").dom), "Modifying CSS display: Assert element is visible");
	Dom.get("nothiddendiv").setStyle("display", "none");
	ok( Dom.isHidden(Dom.get("nothiddendiv").dom), "Modified CSS display: Assert element is hidden");
	Dom.get("nothiddendiv").setStyle("display", "block");
	ok( !Dom.isHidden(Dom.get("nothiddendiv").dom), "Modified CSS display: Assert element is visible");

	Dom.get("nothiddendiv").setStyle("top", "-1em");
	ok( Dom.get("nothiddendiv").getStyle("top"), -16, "Check negative number in EMs." );

	Dom.get("floatTest").setStyle("float", "left");
	equals( Dom.get("floatTest").getStyle("float"), "left", "Modified CSS float using \"float\": Assert float is left");
	Dom.get("floatTest").setStyle("font-size", "20px");
	equals( Dom.get("floatTest").getStyle("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

	String.map("0 0.25 0.5 0.75 1", function(n, i) {
		Dom.get("foo").setStyle("opacity", n);
		equals( Dom.get("foo").getStyle("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		Dom.get("foo").setStyle("opacity", parseFloat(n));
		equals( Dom.get("foo").getStyle("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	Dom.get("foo").setStyle("opacity", "");
	equals( Dom.get("foo").getStyle("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	var j = Dom.get("nonnodes");
	j.setStyle("overflow", "visible");
	equals( j.getStyle("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	
	Dom.get("t2037").innerHTML = Dom.get("t2037").innerHTML;
	equals( Dom.get("t2037").find(".hidden").getStyle("display"), "none", "Make sure browser thinks it is hidden" );

	var div = Dom.get("nothiddendiv"),
		display = div.getStyle("display"),
		ret = div.setStyle("display", '');

	equals( ret, div, "Make sure setting undefined returns the original set." );
	equals( div.getStyle("display"), display, "Make sure that the display wasn't changed." );

	// Test for Bug #5509
	//var success = true;
	//try {
	//	Dom.get("foo").setStyle("backgroundColor", "rgba(0, 0, 0, 0.1)");
	//}
	//catch (e) {
	//	success = false;
	//}
	//ok( success, "Setting RGBA values does not throw Error" );
	
	
	var div = Dom.parse("<div>").appendTo("qunit-fixture");

	div.setStyle("fill-opacity", 0).set({ "fill-opacity": 1.0 });
	
	equal( div.getStyle("fill-opacity"), 1, "Do not append px to 'fill-opacity'");

});

if ( eval("!-[1,]") ) {
	test("setOpacity(String, Object) for MSIE", function() {
		// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
		Dom.get("foo").setStyle("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
		equals( Dom.get("foo").getStyle("opacity"), "1", "Assert opacity is 1 when a different filter is set in IE, #1438" );

		var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal2 = "progid:DXImageTransform.Microsoft.Alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		Dom.get("foo").setStyle("filter", filterVal);
		equals( Dom.get("foo").getStyle("filter"), filterVal, "filter works" );
		Dom.get("foo").setStyle("opacity", 1);
		equals( Dom.get("foo").getStyle("filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter" );
		equals( Dom.get("foo").getStyle("opacity"), "1", "Setting opacity in IE with other filters works" );
		Dom.get("foo").setStyle("filter", filterVal3).setStyle("opacity", 1);
		ok( Dom.get("foo").getStyle("filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters" );
	});

	test( "Setting opacity to 1 properly removes filter: style", function() {
		var rfilter = /filter:[^;]*/i,
			test = Dom.get( "t6652" ).setStyle( "opacity", 1 ),
			test2 = test.find( "div" ).setStyle( "opacity", 1 );

		function hasFilter( elem ) {
			var match = rfilter.exec( elem.dom.style.cssText );
			if ( match ) {
				return true;
			}
			return false;
		}
		//   ok( !hasFilter( test ), "Removed filter attribute on element without filter in stylesheet" );
		ok( hasFilter( test2 ), "Filter attribute remains on element that had filter in stylesheet" );
	});
}

test("getStyle('height') doesn't clear radio buttons", function () {
	expect(4);

	var checkedtest = Dom.get("checkedtest");
	// IE6 was clearing "checked" in getStyle("height");
	checkedtest.getStyle("height");
	ok(  checkedtest.find("[type='radio']").dom.checked, "Check first radio still checked." );
	ok(  !checkedtest.query("[type='radio']").item(-1).dom.checked, "Check last radio still NOT checked." );
	ok( checkedtest.find("[type='checkbox']").dom.checked, "Check first checkbox still checked." );
	ok( !checkedtest.query("[type='checkbox']").item(-1).dom.checked, "Check last checkbox still NOT checked." );
});

/*
test(":visible selector works properly on table elements (bug #4512)", function () {
	expect(1);

	var table = Dom.parse("<table/>").setHtml("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equals(table.find('td').isHidden(), true, "hidden cell is not perceived as visible");
});


*/

/*

test(":visible selector works properly on children with a hidden parent", function () {
	expect(1);
	var table = Dom.parse("<table/>").setStyle("display", "none").setHtml("<tr><td>cell</td><td>cell</td></tr>");
	equals(table.find('td').isHidden(), true, "hidden cell children not perceived as visible");
});


*/

test("internal ref to elem.runtimeStyle", function () {
	expect(1);
	var result = true;
	
	try {
		Dom.get("foo").setStyle('width', "0%").getStyle("width");
	} catch (e) {
		result = false;
	}

	ok( result, "elem.runtimeStyle does not throw exception" );
});

test("marginRight computed style", function() {
	expect(1);

	var div = Dom.get("foo");
	div
		.setStyle('width', '1px')
		.setStyle('marginRight', 0);

	equals(div.getStyle("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
});


/*

test("Element.styles behavior", function() {
	var div = Dom.parse( "<div>" ).appendTo(document.body).set({
		position: "absolute",
		top: 0,
		left: 10
	});
	Element.styles.top = "left";
	equal( div.getStyle("top"), "10px", "the fixed property is used when accessing the computed style");
	div.setStyle("top", "100px");
	equal( div.style.left, "100px", "the fixed property is used when setting the style");
	Element.styles.top = undefined;
});


*/

test("widows & orphans", function () {

	var p = Dom.parse("<p>").appendTo("qunit-fixture");

	if ( "widows" in p.dom.style ) {
		expect(4);	
		p.setStyle('widows', 0).setStyle('orphans', 0);

		equal( p.getStyle("widows"), 0, "widows correctly start with value 0");
		equal( p.getStyle("orphans"), 0, "orphans correctly start with value 0");

		p.setStyle('widows', 3).setStyle('orphans', 3);

		equal( p.getStyle("widows"), 3, "widows correctly start with value 3");
		equal( p.getStyle("orphans"), 3, "orphans correctly start with value 3");

	} else {

		expect(1);
		ok( true, "Does not attempt to test for style props that definitely don't exist in older versions of IE");
	}


	p.remove();
});

