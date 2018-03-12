/*
Glǽmscribe (also written Glaemscribe) is a software dedicated to
the transcription of texts between writing systems, and more 
specifically dedicated to the transcription of J.R.R. Tolkien's 
invented languages to some of his devised writing systems.

Copyright (C) 2017 Benjamin Babut (Talagan).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Version : 1.1.15
*/

/*
  Adding utils/string_list_to_clean_array.js 
*/
function stringListToCleanArray(str,separator)
{
  return str.split(separator)
      .map(function(elt) { return elt.trim() })
      .filter(function(n){ return n != "" }); ;
}



/*
  Adding utils/string_from_code_point.js 
*/
/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
if (!String.fromCodePoint) {
  (function() {
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||              // not a valid Unicode code point
          codePoint > 0x10FFFF ||       // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String, 'fromCodePoint', {
        'value': fromCodePoint,
        'configurable': true,
        'writable': true
      });
    } else {
      String.fromCodePoint = fromCodePoint;
    }
  }());
}

/*
  Adding utils/inherits_from.js 
*/
// Thank you mozilla! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 


/*
  Adding utils/array_productize.js 
*/
Object.defineProperty(Array.prototype, "productize", {
  enumerable: false,
  value: function(other_array) {
    var array = this;
    var res   = new Array(array.length * other_array.length);
  
    for(var i=0;i<array.length;i++)
    {
      for(var j=0;j<other_array.length;j++)
      {
        res[i*other_array.length+j] = [array[i],other_array[j]];
      }
    }
    return res;
  }
});

/*
  Adding utils/array_equals.js 
*/
Object.defineProperty(Array.prototype, "equals", {
  enumerable: false,
  value:  function (array) {
    if (!array)
      return false;

    if (this.length != array.length)
      return false;

    for (var i = 0, l=this.length; i < l; i++) {
      if (this[i] instanceof Array && array[i] instanceof Array) {
        if (!this[i].equals(array[i]))
          return false;       
      }           
      else if (this[i] != array[i]) { 
        return false;   
      }           
    }       
    return true;
  }   
});

/*
  Adding utils/array_unique.js 
*/
Object.defineProperty(Array.prototype, "unique", {
  enumerable: false,
  value:  function () {

    var uf = function(value, index, self) { 
      return self.indexOf(value) === index;
    }

    return this.filter(uf);
  }   
});


/*
  Adding utils/glaem_object.js 
*/
Object.defineProperty(Object.prototype, "glaem_each", {
  enumerable: false,
  value:  function (callback) {
    
    for(var o in this)
    {
      if(!this.hasOwnProperty(o))
        continue;
      var res = callback(o,this[o]);
      if(res == false)
        break;
    }
  }   
});

Object.defineProperty(Object.prototype, "glaem_each_reversed", {
  enumerable: false,
  value:  function (callback) {
    if(!this instanceof Array)
      return this.glaem_each(callback);
      
    for(var o = this.length-1;o>=0;o--)
    {
      if(!this.hasOwnProperty(o))
        continue;
      var res = callback(o,this[o]);
      if(res == false)
        break;
    }
  }   
});

Object.defineProperty(Object.prototype, "glaem_merge", {
  enumerable: false,
  value:  function (other_object) {
    
    var ret = {};
    for(var o in this)
    {
      if(!this.hasOwnProperty(o))
        continue;      
      ret[o] = this[o];
    }    
    
    for(var o in other_object)
    {
      if(!other_object.hasOwnProperty(o))
        continue;
      ret[o] = other_object[o];
    }
    
    return ret;
  }   
});



/*
  Adding api.js 
*/


var Glaemscribe           = {};



/*
  Adding api/constants.js 
*/


Glaemscribe.WORD_BREAKER        = "|";
Glaemscribe.WORD_BOUNDARY       = "_"

Glaemscribe.SPECIAL_CHAR_UNDERSCORE = '➊'
Glaemscribe.SPECIAL_CHAR_NBSP       = '➋'

Glaemscribe.UNKNOWN_CHAR_OUTPUT = "☠"      
Glaemscribe.VIRTUAL_CHAR_OUTPUT = "☢" 


/*
  Adding api/resource_manager.js 
*/


Glaemscribe.ResourceManager = function() {  
  this.raw_modes                    = {};
  this.raw_charsets                 = {};
  this.loaded_modes                     = {};
  this.loaded_charsets                  = {};
  this.pre_processor_operator_classes   = {};
  this.post_processor_operator_classes  = {};
  return this;
}

Glaemscribe.ResourceManager.prototype.load_charsets = function(charset_list) {
  
  // Load all charsets if null is passed
  if(charset_list == null)
     charset_list = Object.keys(this.raw_charsets);
  
  // If passed a name, wrap into an array
  if(typeof charset_list === 'string' || charset_list instanceof String)
    charset_list = [charset_list];
     
  for(var i=0;i<charset_list.length;i++)
  {
    var charset_name = charset_list[i];
    
    // Don't load a charset twice
    if(this.loaded_charsets[charset_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_charsets[charset_name])
      continue;
       
    var cp      = new Glaemscribe.CharsetParser();
    var charset = cp.parse(charset_name);
    
    if(charset)
      this.loaded_charsets[charset_name] = charset;
  }
}

Glaemscribe.ResourceManager.prototype.load_modes = function(mode_list) {
 
  // Load all modes if null is passed
  if(mode_list == null)
     mode_list = Object.keys(this.raw_modes);
  
  // If passed a name, wrap into an array
  if(typeof mode_list === 'string' || mode_list instanceof String)
    mode_list = [mode_list];
    
  for(var i=0;i<mode_list.length;i++)
  {
    var mode_name = mode_list[i];
    
    // Don't load a charset twice
    if(this.loaded_modes[mode_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_modes[mode_name])
      continue;
       
    var mp      = new Glaemscribe.ModeParser();
    var mode    = mp.parse(mode_name);
    
    if(mode)
      this.loaded_modes[mode_name] = mode;
  }
}

Glaemscribe.ResourceManager.prototype.register_pre_processor_class = function(operator_name, operator_class)
{
  this.pre_processor_operator_classes[operator_name] = operator_class;  
}

Glaemscribe.ResourceManager.prototype.register_post_processor_class = function(operator_name, operator_class)
{
  this.post_processor_operator_classes[operator_name] = operator_class;
}

Glaemscribe.ResourceManager.prototype.class_for_pre_processor_operator_name = function(operator_name)
{
  return this.pre_processor_operator_classes[operator_name]; 
}

Glaemscribe.ResourceManager.prototype.class_for_post_processor_operator_name = function(operator_name)
{
  return this.post_processor_operator_classes[operator_name]  
}

Glaemscribe.resource_manager = new Glaemscribe.ResourceManager();



/*
  Adding api/charset.js 
*/


Glaemscribe.Char = function()
{
  return this;
}

Glaemscribe.Char.prototype.is_virtual = function()
{
  return false;
}

Glaemscribe.Char.prototype.output = function()
{
  return this.str;
}

Glaemscribe.VirtualChar = function()
{
  this.classes      = [];
  this.lookup_table = {};
  this.reversed     = false;
  this.default      = null;
  return this;
}

Glaemscribe.VirtualChar.VirtualClass = function()
{
  this.target   = '';
  this.triggers = [];
}

Glaemscribe.VirtualChar.prototype.is_virtual = function()
{
  return true;
}

Glaemscribe.VirtualChar.prototype.output = function()
{
  var vc = this;
  if(vc.default)
    return vc.charset.n2c(vc.default).output();
  else
    return Glaemscribe.VIRTUAL_CHAR_OUTPUT;
}

Glaemscribe.VirtualChar.prototype.finalize = function()
{
  var vc = this;
  
  vc.lookup_table = {};
  vc.classes.glaem_each(function(_, vclass) {
    var result_char   = vclass.target;
    var trigger_chars = vclass.triggers;
    
    trigger_chars.glaem_each(function(_,trigger_char) {
      var found = vc.lookup_table[trigger_char];
      if(found != null)
      {
        vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + "found twice in virtual char."));
      }
      else
      {
        var rc = vc.charset.n2c(result_char);
        var tc = vc.charset.n2c(trigger_char);
        
        if(rc == null) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + " points to unknown result char " + result_char + "."));
        }
        else if(tc == null) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Unknown trigger char " + trigger_char + "."));
        }
        else if(rc instanceof Glaemscribe.VirtualChar) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + " points to another virtual char " + result_char + ". This is not supported!"));          
        }
        else {
          tc.names.glaem_each(function(_,trigger_char_name) {
            vc.lookup_table[trigger_char_name] = rc;
          });
        }
      }
    });
  });
  if(vc.default)
  {
    var c = vc.charset.lookup_table[vc.default];
    if(!c)
      vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Default char "+ vc.default + " does not match any real character in the charset."));
    else if(c.is_virtual())
      vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Default char "+ vc.default + " is virtual, it should be real only."));
  }
}

Glaemscribe.VirtualChar.prototype.n2c = function(trigger_char_name) {
  return this.lookup_table[trigger_char_name];
}

Glaemscribe.Charset = function(charset_name) {
  
  this.name         = charset_name;
  this.chars        = [];
  this.errors       = [];
  return this;
}

Glaemscribe.Charset.prototype.add_char = function(line, code, names)
{
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
  
  var c     = new Glaemscribe.Char();    
  c.line    = line;
  c.code    = code;
  c.names   = names;    
  c.str     = String.fromCodePoint(code);
  c.charset = this;
  this.chars.push(c);
}

Glaemscribe.Charset.prototype.add_virtual_char = function(line, classes, names, reversed, deflt)
{
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
 
  var c      = new Glaemscribe.VirtualChar();    
  c.line     = line;
  c.names    = names;
  c.classes  = classes; // We'll check errors in finalize
  c.charset  = this;
  c.default  = deflt;
  c.reversed = reversed;
  this.chars.push(c);  
}

Glaemscribe.Charset.prototype.finalize = function()
{
  var charset = this;
  
  charset.errors         = [];
  charset.lookup_table   = {};
  charset.virtual_chars  = []
  
  charset.chars = charset.chars.sort(function(c1,c2) {
    if(c1.is_virtual() && c2.is_virtual())
      return c1.names[0].localeCompare(c2.names[0]);
    if(c1.is_virtual())
      return 1;
    if(c2.is_virtual())
      return -1;
    
    return (c1.code - c2.code);
  });
  
  for(var i=0;i<charset.chars.length;i++)
  {
    var c = charset.chars[i];  
    for(var j=0;j<c.names.length;j++)
    {
      var cname = c.names[j];
      var found = charset.lookup_table[cname];
      if(found != null)
        charset.errors.push(new Glaemscribe.Glaeml.Error(c.line, "Character " + cname + " found twice."));
      else
        charset.lookup_table[cname] = c;
    }
  }
  
  charset.chars.glaem_each(function(_,c) {
    if(c.is_virtual()) {
      c.finalize();
      charset.virtual_chars.push(c);
    }
  });
  
}

Glaemscribe.Charset.prototype.n2c = function(cname)
{
  return this.lookup_table[cname];
}


/*
  Adding api/charset_parser.js 
*/


Glaemscribe.CharsetParser = function()
{
  return this;
}

Glaemscribe.CharsetParser.prototype.parse_raw = function(charset_name, raw)
{
  var charset = new Glaemscribe.Charset(charset_name);
  var doc     = new Glaemscribe.Glaeml.Parser().parse(raw);

  if(doc.errors.length>0)
  {
    charset.errors = doc.errors;
    return charset;
  }

  var chars   = doc.root_node.gpath('char');

  for(var c=0;c<chars.length;c++)
  {
    var char = chars[c];
    var code = parseInt(char.args[0],16);
    var names = char.args.slice(1);
    charset.add_char(char.line, code, names)
  }

  doc.root_node.gpath("virtual").glaem_each(function(_,virtual_element) {
    var names     = virtual_element.args;
    var classes   = [];
    var reversed  = false;
    var deflt     = null;
    virtual_element.gpath("class").glaem_each(function(_,class_element) {
      var vc        = new Glaemscribe.VirtualChar.VirtualClass();
      vc.target     = class_element.args[0];
      vc.triggers   = class_element.args.slice(1);
      classes.push(vc);
    });
    virtual_element.gpath("reversed").glaem_each(function(_,reversed_element) {
      reversed = true;
    });
    virtual_element.gpath("default").glaem_each(function(_,default_element) {
      deflt = default_element.args[0];
    });
    charset.add_virtual_char(virtual_element.line,classes,names,reversed,deflt);
  });

  charset.finalize();
  return charset;
}

Glaemscribe.CharsetParser.prototype.parse = function(charset_name) {

  var raw     = Glaemscribe.resource_manager.raw_charsets[charset_name];

  return this.parse_raw(charset_name, raw);
}


/*
  Adding api/glaeml.js 
*/


Glaemscribe.Glaeml = {}

Glaemscribe.Glaeml.Document = function() {
  this.errors     = [];
  this.root_node  = null;
  return this;
}

Glaemscribe.Glaeml.NodeType = {}
Glaemscribe.Glaeml.NodeType.Text = 0
Glaemscribe.Glaeml.NodeType.ElementInline = 1
Glaemscribe.Glaeml.NodeType.ElementBlock = 2

Glaemscribe.Glaeml.Node = function(line, type, name) {
  this.type     = type;
  this.name     = name;
  this.line     = line;
  this.args     = [];
  this.children = [];
  
  return this
}

Glaemscribe.Glaeml.Node.prototype.clone = function() {
    var new_element  = new Glaemscribe.Glaeml.Node(this.line, this.type, this.name);
    // Clone the array of args
    new_element.args = this.args.slice(0); 
    // Clone the children
    this.children.glaem_each(function(child_index, child) {
        new_element.children.push(child.clone());
    });
    return new_element;
}

Glaemscribe.Glaeml.Node.prototype.is_text = function()
{
  return (this.type == Glaemscribe.Glaeml.NodeType.Text);
}

Glaemscribe.Glaeml.Node.prototype.is_element = function()
{
  return (this.type == Glaemscribe.Glaeml.NodeType.ElementInline || 
  this.type == Glaemscribe.Glaeml.NodeType.ElementBlock) ;
}

Glaemscribe.Glaeml.Node.prototype.pathfind_crawl = function(apath, found)
{
  var tnode = this;
  
  for(var i=0; i < tnode.children.length; i++)
  {
    var c = tnode.children[i];

    if(c.name == apath[0])
    {
      if(apath.length == 1)
      {
        found.push(c);
      }
      else
      {
        var bpath = apath.slice(0);
        bpath.shift();
        c.pathfind_crawl(bpath, found)
      }
    }
  }
}

Glaemscribe.Glaeml.Node.prototype.gpath = function(path)
{
  var apath = path.split(".");
  var found     = [];
  this.pathfind_crawl(apath,found);
  return found;
}

Glaemscribe.Glaeml.Error = function(line,text) {
  this.line = line;
  this.text = text;
  return this;
}

Glaemscribe.Glaeml.Parser = function() {}

Glaemscribe.Glaeml.Parser.prototype.add_text_node = function(lnum, text) {
  
  var n         = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.Text, null);
  n.args.push(text);
  n.parent_node = this.current_parent_node     
  this.current_parent_node.children.push(n);   
}

Glaemscribe.Glaeml.Parser.prototype.parse = function(raw_data) {
  raw_data = raw_data.replace(/\r/g,"");
  raw_data = raw_data.replace(/\\\*\*([\s\S]*?)\*\*\\/mg, function(cap) {
    // Keep the good number of lines
    return new Array( (cap.match(/\n/g) || []).length + 1).join("\n");
  }) 
 
  var lnum                    = 0;
  var parser                  = this;
 
  var doc                     = new Glaemscribe.Glaeml.Document;
  doc.root_node               = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementBlock, "root");
  parser.current_parent_node  = doc.root_node;
 
  var lines = raw_data.split("\n")
  for(var i=0;i<lines.length;i++)
  {
    lnum += 1;
    
    var l = lines[i];
    l = l.trim();
    if(l == "")
    {
      parser.add_text_node(lnum, l);
      continue;
    }  
    
    if(l[0] == "\\")
    {
      if(l.length == 1)
      {
        doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Incomplete Node"));
      }
      else
      {
        var rmatch = null;
        
        if(l[1] == "\\") // First backslash is escaped
        {
          parser.add_text_node(lnum, l.substring(1));
        }
        else if(rmatch = l.match(/^(\\beg\s+)/)) 
        {       
          var found = rmatch[0];
          var rest  = l.substring(found.length);
   
          var args  = [];
          var name  = "???";
          
          if( !(rmatch = rest.match(/^([a-z_]+)/)) )
          {
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Bad element name."));
          }
          else
          {
            name    = rmatch[0];
            
            try { 
              args    = new Glaemscribe.Glaeml.Shellwords().parse(rest.substring(name.length)); 
            }
            catch(error) {
                doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Error parsing glaeml args (" + error + ")."));
            }
          }
          
          var n         = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementBlock, name);
          n.args        = n.args.concat(args);
          n.parent_node = parser.current_parent_node;
              
          parser.current_parent_node.children.push(n);
          parser.current_parent_node = n;
        }
        else if(rmatch = l.match(/^(\\end(\s|$))/))
        {
          if( !parser.current_parent_node.parent_node )
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Element 'end' unexpected."));
          else if( l.substring(rmatch[0].length).trim() != "" )
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Element 'end' should not have any argument."));
          else
            parser.current_parent_node = parser.current_parent_node.parent_node;
        }
        else
        {
          // Read the name of the node
          l       = l.substring(1);
          rmatch  = l.match( /^([a-z_]+)/ )   

          if(!rmatch)
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Cannot understand element name."));
          else
          {
            var name      = rmatch[0];
            var args      = [];
            
            try           { 
              args    = new Glaemscribe.Glaeml.Shellwords().parse(l.substring(name.length)); 
            }
            catch(error)  { 
              doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Error parsing glaeml args (" + error + ").")); 
            }
                                       
            n             = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementInline, name);
            n.args        = n.args.concat(args);
            n.parent_node = parser.current_parent_node;
            
            parser.current_parent_node.children.push(n);
          }   
        }
      }
    }
    else
    {
      parser.add_text_node(lnum, l);
    }
  }
  
  if(parser.current_parent_node != doc.root_node)
    doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Missing 'end' element."));
 
  return doc;
}

/*
  Adding api/glaeml_shellwords.js 
*/


Glaemscribe.Glaeml.Shellwords = function() {
  return this;
}

Glaemscribe.Glaeml.ShellwordsEscapeMode = {};
Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode = 1;

Glaemscribe.Glaeml.Shellwords.prototype.reset_state = function() {
  var sw = this;
  
  sw.is_escaping                = false;
  sw.is_eating_arg              = false;
  sw.is_eating_arg_between_quotes  = false;
  sw.args = [];
  sw.current_arg = "";
  sw.escape_mode            = null;
  sw.unicode_escape_counter = 0;
  sw.unicode_escape_str     = '';
}
  
Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_arg = function(l,i) {
  var sw = this;
  
  if(l[i] == "\\") {
    sw.is_escaping      = true;
    sw.escape_mode      = null;
  }
  else {
    sw.current_arg += l[i];
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_escape = function(l,i) {

  var sw = this;

  if(sw.escape_mode == null) {
    // We don't now yet what to do.
    switch(l[i])
    {
    case 'n':
      {
        sw.current_arg += "\n";
        sw.is_escaping = false;
        break;
      }
    case "\\":
      {
        sw.current_arg +=  "\\";
        sw.is_escaping = false;
        break;
      }
    case "t":
      {
        sw.current_arg +=  "\t";
        sw.is_escaping = false;
        break;      
      }
    case "\"":
      {
        sw.current_arg +=  "\"";
        sw.is_escaping = false;
        break;      
      }
    case "u":
      {
        sw.escape_mode = Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode;
        sw.unicode_escape_counter = 0;
        sw.unicode_escape_str     = '';
        break;
      }
    default:
      {
        throw new Error("Unknown escapment : \\" + l[i]);
      }
    }
  }
  else
  {
    switch(sw.escape_mode)
    {
    case Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode:
      {
        var c = l[i].toLowerCase();
          
        if(!(c.match(/[0-9a-f]/))) {
          throw new Error("Wrong format for unicode escaping, should be \\u with 4 hex digits");
        }
          
        sw.unicode_escape_counter += 1
        sw.unicode_escape_str     += c
        if(sw.unicode_escape_counter == 4) {
          sw.is_escaping = false
          sw.current_arg += String.fromCodePoint(parseInt(sw.unicode_escape_str, 16));
        }
        break;
      }
    default:
      {
        throw new Error("Unimplemented escape mode")
      }
    }
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.parse = function(l) {
  var sw = this;
  
  sw.reset_state();
  
  for(var i=0;i<l.length;i++) {
    
    if(!sw.is_eating_arg) {
      
      if(l[i].match(/\s/))
        continue;
      
      if(l[i] == "'")
        throw new Error("Glaeml strictly uses double quotes, not simple quotes for args") 
      
      sw.is_eating_arg                = true;
      sw.is_eating_arg_between_quotes = (l[i] == "\"");
      
      if(!sw.is_eating_arg_between_quotes)
        sw.current_arg += l[i];
    }
    else {
      
      // Eating arg
      if(sw.is_escaping) {
        sw.advance_inside_escape(l,i);
      }
      else {
        if(!sw.is_eating_arg_between_quotes) {
          
          if(l[i].match(/[\s"]/)) {
            
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = (l[i] == "\""); // Starting a new arg directly
            sw.is_eating_arg_between_quotes = sw.is_eating_arg;
            continue;
            
          }
          else {
            sw.advance_inside_arg(l,i)
          }
        }
        else {
          
          if(l[i] == "\"") {
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = false;
          }
          else {
            sw.advance_inside_arg(l,i);
          }
        }
      }
    }
  }

  if(sw.is_eating_arg && sw.is_eating_arg_between_quotes) {
    throw new Error("Unmatched quote.");
  }

  if(sw.current_arg.trim() != '') {
    sw.args.push(sw.current_arg)
  }

  return sw.args;
}           
           
           

/*
  Adding api/fragment.js 
*/


Glaemscribe.Fragment = function(sheaf, expression) {
  
  var fragment = this;
  
  fragment.sheaf        = sheaf;
  fragment.mode         = sheaf.mode;
  fragment.rule         = sheaf.rule;
  fragment.expression   = expression;

  fragment.equivalences = stringListToCleanArray(fragment.expression, Glaemscribe.Fragment.EQUIVALENCE_RX_OUT);
  fragment.equivalences = fragment.equivalences.map(function(eq_exp) {
    var eq  = eq_exp;
    var exp = Glaemscribe.Fragment.EQUIVALENCE_RX_IN.exec(eq_exp);  

    if(exp)
    {
      eq = exp[1]; 
      eq = eq.split(Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR).map(function(elt) {
        elt = elt.trim();
        return elt.split(/\s/);
      });      
    }
    else
    {
      eq = [eq_exp.split(/\s/)];
    }
    return eq;
  });
  
  if(fragment.equivalences.length == 0)
    fragment.equivalences = [[[""]]];

  // Verify all symbols used are known in all charsets
  if(fragment.is_dst())
  {
    var mode = fragment.sheaf.mode;   
    for(var i=0;i<fragment.equivalences.length;i++)
    {
      var eq = fragment.equivalences[i];
      for(var j=0;j<eq.length;j++)
      {
        var member = eq[j];
        for(var k=0;k<member.length;k++)
        {
          var token = member[k];
          if(token == "") // Case of NULL
            continue;
           
          for(var charset_name in mode.supported_charsets)
          {           
            var charset     = mode.supported_charsets[charset_name];
            var symbol      = charset.n2c(token);
            if(symbol == null)
            {
               fragment.rule.errors.push("Symbol '" + token + "' not found in charset '"+ charset.name + "'!");   
               return;  
            }      
          }
        }
      }
    }
  }
  
  // Calculate all combinations
  var res = fragment.equivalences[0];
 
  for(var i=0;i<fragment.equivalences.length-1;i++)
  {
    var prod = res.productize(fragment.equivalences[i+1]);
    res = prod.map(function(elt) {
  
      var x = elt[0];
      var y = elt[1];
  
      return x.concat(y);
    });
    
  }
  fragment.combinations = res; 
}

Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR = ","
Glaemscribe.Fragment.EQUIVALENCE_RX_OUT    = /(\(.*?\))/
Glaemscribe.Fragment.EQUIVALENCE_RX_IN     = /\((.*?)\)/

Glaemscribe.Fragment.prototype.is_src = function() {  return this.sheaf.is_src(); };
Glaemscribe.Fragment.prototype.is_dst = function() {  return this.sheaf.is_dst(); };


/*
  Adding api/mode.js 
*/


Glaemscribe.ModeDebugContext = function()
{
  this.preprocessor_output  = "";
  this.processor_pathes     = [];
  this.processor_output     = [];
  this.postprocessor_output = "";
  
  return this;
}


Glaemscribe.Mode = function(mode_name) {
  this.name                 = mode_name;
  this.supported_charsets   = {};
  this.options              = {};
  this.errors               = [];
  this.warnings             = [];
  this.latest_option_values = {};
  
  this.raw_mode_name        = null;

  this.pre_processor    = new Glaemscribe.TranscriptionPreProcessor(this);
  this.processor        = new Glaemscribe.TranscriptionProcessor(this);
  this.post_processor   = new Glaemscribe.TranscriptionPostProcessor(this);
  return this;
}

Glaemscribe.Mode.prototype.finalize = function(options) {
  
  var mode = this;
  
  if(options == null)
    options = {};
  
  // Hash: option_name => value_name
  var trans_options = {};
  
  // Build default options
  mode.options.glaem_each(function(oname, o) {
    trans_options[oname] = o.default_value_name;
  });
  
  // Push user options
  options.glaem_each(function(oname, valname) {
    // Check if option exists
    var opt = mode.options[oname];
    if(!opt)
      return true; // continue
    var val = opt.value_for_value_name(valname)
    if(val == null)
      return true; // value name is not valid
    
    trans_options[oname] = valname;
  });
    
  var trans_options_converted = {};
 
  // Do a conversion to values space
  trans_options.glaem_each(function(oname,valname) {
    trans_options_converted[oname] = mode.options[oname].value_for_value_name(valname);
  });

  // Add the option defined constants to the whole list for evaluation purposes
  mode.options.glaem_each(function(oname, o) {
    // For enums, add the values as constants for the evaluator
    if(o.type == Glaemscribe.Option.Type.ENUM )
    {
      o.values.glaem_each(function(name,val) {
        trans_options_converted[name] = val
      });
    }
  });   
  
  this.latest_option_values = trans_options_converted;
    
  this.pre_processor.finalize(this.latest_option_values);
  this.post_processor.finalize(this.latest_option_values);
  this.processor.finalize(this.latest_option_values);
  
  if(mode.get_raw_mode())
    mode.get_raw_mode().finalize(options);
  
  return this;
}

Glaemscribe.Mode.prototype.get_raw_mode = function() {
  var mode = this;
  
  if(mode.raw_mode != null)
    return mode.raw_mode;
  
  var loaded_raw_mode = (mode.raw_mode_name && Glaemscribe.resource_manager.loaded_modes[mode.raw_mode_name]);
  if(loaded_raw_mode == null)
    return null;
  
  mode.raw_mode = Object.glaem_clone(loaded_raw_mode);
}

Glaemscribe.Mode.prototype.replace_specials = function(l) {
  return l.
    replace(/_/g,     Glaemscribe.SPECIAL_CHAR_UNDERSCORE).
    replace(/\u00a0/g,  Glaemscribe.SPECIAL_CHAR_NBSP);
}

Glaemscribe.Mode.prototype.strict_transcribe = function(content, charset, debug_context) {

  if(charset == null)
    charset = this.default_charset;
  
  if(charset == null)
    return [false, "*** No charset usable for transcription. Failed!"];

  var ret   = ""
  var lines = content.split(/(\n)/);
  
  for(var i=0;i<lines.length;i++)
  {
    var l = lines[i];
    var restore_lf = false;
    
    if(l[l.length-1] == "\n")
    {
      restore_lf = true;
      l = l.slice(0,-1);
    }
    
    
    l = this.pre_processor.apply(l);
    debug_context.preprocessor_output += l + "\n";
 
    l = this.replace_specials(l)
    
    l = this.processor.apply(l, debug_context);
    debug_context.processor_output = debug_context.processor_output.concat(l);
    
    l = this.post_processor.apply(l, charset);
    debug_context.postprocessor_output += l + "\n";

    if(restore_lf)
      l += "\n";
    
    ret += l;
  }

  return [true, ret, debug_context];  
}

Glaemscribe.Mode.prototype.transcribe = function(content, charset) {

  var mode          = this;
  var debug_context = new Glaemscribe.ModeDebugContext();

  var raw_mode      = mode.get_raw_mode();

  var ret = "";
  var res = true;
 
  if(raw_mode != null)
  {
    var chunks = content.split(/({{[\s\S]*?}})/);
       
    chunks.glaem_each(function(_,c) {
      var rmatch = null;
      
      var to_transcribe = c;
      var tr_mode       = mode;
      
      if(rmatch = c.match(/{{([\s\S]*?)}}/))
      {
        to_transcribe = rmatch[1];
        tr_mode       = raw_mode;
      }
      
      var rr = tr_mode.strict_transcribe(to_transcribe,charset,debug_context);
      var succ = rr[0]; var r = rr[1]; 
      
      res = res && succ;
      if(succ)
        ret += r;   
    });
  }
  else
  {
    var rr = mode.strict_transcribe(content,charset,debug_context);
    var succ = rr[0]; var r = rr[1]; 
    res = res && succ;
    if(succ)
      ret += r;   
  }
    
  return [res, ret, debug_context];  
}



/*
  Adding api/option.js 
*/


Glaemscribe.Option = function(mode, name, default_value_name, values, visibility)
{
  this.mode               = mode;
  this.name               = name;
  this.default_value_name = default_value_name;
  this.type               = (Object.keys(values).length == 0)?(Glaemscribe.Option.Type.BOOL):(Glaemscribe.Option.Type.ENUM);
  this.values             = values;
  this.visibility         = visibility;
  
  return this;
}
Glaemscribe.Option.Type = {};
Glaemscribe.Option.Type.BOOL = "BOOL";
Glaemscribe.Option.Type.ENUM = "ENUM";


Glaemscribe.Option.prototype.default_value = function()
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
    return (this.default_value_name == 'true')
  else
    return this.values[this.default_value_name];
}

Glaemscribe.Option.prototype.value_for_value_name = function(val_name)
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
  {
    if(val_name == 'true' || val_name == true)
      return true;
    
    if(val_name == 'false' || val_name == false)
      return false;
    
    return null;
  }
  else
  {
    return this.values[val_name];
  }
}

Glaemscribe.Option.prototype.is_visible = function() {
  var if_eval = new Glaemscribe.Eval.Parser;
        
  var res = false;
  
  try
  {
    res = if_eval.parse(this.visibility || "true", this.mode.latest_option_values || {});
    return (res == true);
  }
  catch(err)
  {
    console.log(err);
    return null;
  }                
}


/*
  Adding api/mode_parser.js 
*/


Glaemscribe.ModeParser = function() {
  return this;
}

Glaemscribe.ModeParser.prototype.validate_presence_of_args = function(node, arg_count)
{
  var parser  = this;

  if(arg_count != null)
  {
    if(node.args.length != arg_count)
      parser.mode.errors.push(new Glaemscribe.Glaeml.Error(node.line,"Element '" + node.name + "' should have " + arg_count + " arguments."));
  }
}

Glaemscribe.ModeParser.prototype.validate_presence_of_children = function(parent_node, elt_name, elt_count, arg_count) {

  var parser  = this;
  var res     = parent_node.gpath(elt_name);

  if(elt_count)
  {
    if(res.length != elt_count)
       parser.mode.errors.push(new Glaemscribe.Glaeml.Error(parent_node.line,"Element '" + parent_node.name + "' should have exactly " + elt_count + " children of type '" + elt_name + "'."));
  }
  if(arg_count)
  {
    res.glaem_each(function(c,child_node) {
      parser.validate_presence_of_args(child_node, arg_count)
    });
  }
}

// Very simplified 'dtd' like verification
Glaemscribe.ModeParser.prototype.verify_mode_glaeml = function(doc)
{
  var parser  = this;

  parser.validate_presence_of_children(doc.root_node, "language", 1, 1);
  parser.validate_presence_of_children(doc.root_node, "writing",  1, 1);
  parser.validate_presence_of_children(doc.root_node, "mode",     1, 1);
  parser.validate_presence_of_children(doc.root_node, "authors",  1, 1);
  parser.validate_presence_of_children(doc.root_node, "version",  1, 1);

  doc.root_node.gpath("charset").glaem_each(function (ce, charset_element) {
    parser.validate_presence_of_args(charset_element, 2);
  });

  doc.root_node.gpath("options.option").glaem_each(function (oe, option_element) {
    parser.validate_presence_of_args(option_element, 2);
    option_element.gpath("value").glaem_each(function (ve, value_element) {
      parser.validate_presence_of_args(value_element, 2);
    });
  });

  doc.root_node.gpath("outspace").glaem_each(function (oe, outspace_element) {
    parser.validate_presence_of_args(outspace_element, 1);
  });

  doc.root_node.gpath("processor.rules").glaem_each(function (re, rules_element) {
    parser.validate_presence_of_args(rules_element, 1);
    parser.validate_presence_of_children(rules_element,"if",null,1);
    parser.validate_presence_of_children(rules_element,"elsif",null,1);
  });

  doc.root_node.gpath("preprocessor.if").glaem_each(function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  doc.root_node.gpath("preprocessor.elsif").glaem_each(function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  doc.root_node.gpath("postprocessor.if").glaem_each(function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  doc.root_node.gpath("postprocessor.elsif").glaem_each(function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
}

Glaemscribe.ModeParser.prototype.create_if_cond_for_if_term = function(line, if_term, cond)
{
  var ifcond                          = new Glaemscribe.IfTree.IfCond(line, if_term, cond);
  var child_code_block                = new Glaemscribe.IfTree.CodeBlock(ifcond);
  ifcond.child_code_block             = child_code_block;
  if_term.if_conds.push(ifcond);
  return ifcond;
}

Glaemscribe.ModeParser.prototype.traverse_if_tree = function(root_code_block, root_element, text_procedure, element_procedure)
{
  var mode                      = this.mode;
  var current_parent_code_block = root_code_block;

  for(var c = 0;c<root_element.children.length;c++)
  {
    var child = root_element.children[c];

    if(child.is_text())
    {
      if(text_procedure != null)
        text_procedure(current_parent_code_block,child);

      continue;
    }

    if(child.is_element())
    {
      switch(child.name)
      {
      case 'if':

        var cond_attribute                  = child.args[0];
        var if_term                         = new Glaemscribe.IfTree.IfTerm(current_parent_code_block);
        current_parent_code_block.terms.push(if_term) ;
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term, cond_attribute);
        current_parent_code_block           = if_cond.child_code_block;

        break;
      case 'elsif':

        var cond_attribute                  = child.args[0];
        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term;

        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'elsif' without a 'if'."));
          return;
        }

        // TODO : check that precendent one is a if or elseif
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term,cond_attribute);
        current_parent_code_block           = if_cond.child_code_block;

        break;
      case 'else':

        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term;

        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'else' without a 'if'."));
          return;
        }

        // TODO : check if precendent one is a if or elsif
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term,"true");
        current_parent_code_block           = if_cond.child_code_block;

        break;
      case 'endif':

        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term;

        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'endif' without a 'if'."));
          return;
        }

        current_parent_code_block           = if_term.parent_code_block;

        break;
      default:

        // Do something with this child element
        if(element_procedure != null)
          element_procedure(current_parent_code_block, child);

        break;
      }
    }
  }

  if(current_parent_code_block.parent_if_cond)
    mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Unended 'if' at the end of this '" + root_element.name + "' element."));

}

Glaemscribe.ModeParser.prototype.parse_pre_post_processor = function(processor_element, pre_not_post)
{
  var mode = this.mode;

  // Do nothing with text elements
  var text_procedure    = function(current_parent_code_block, element) {}
  var element_procedure = function(current_parent_code_block, element) {

    // A block of operators. Put them in a PrePostProcessorOperatorsTerm.
    var term = current_parent_code_block.terms[current_parent_code_block.terms.length-1];

    if(term == null || !term.is_pre_post_processor_operators() )
    {
      term = new Glaemscribe.IfTree.PrePostProcessorOperatorsTerm(current_parent_code_block);
      current_parent_code_block.terms.push(term);
    }

    var operator_name   = element.name;
    var operator_class  = null;
    var procname        = "Preprocessor";

    if(pre_not_post)
      operator_class = Glaemscribe.resource_manager.class_for_pre_processor_operator_name(operator_name);
    else
      operator_class = Glaemscribe.resource_manager.class_for_post_processor_operator_name(operator_name);

    if(!operator_class)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(element.line, "Operator '" + operator_name + "' is unknown."));
    }
    else
    {
      term.operators.push(new operator_class(element.clone()));
    }
  }

  var root_code_block = ((pre_not_post)?(mode.pre_processor.root_code_block):(mode.post_processor.root_code_block))

  this.traverse_if_tree(root_code_block, processor_element, text_procedure, element_procedure )
}

Glaemscribe.ModeParser.prototype.parse_raw = function(mode_name, raw, mode_options) {

  var mode    = new Glaemscribe.Mode(mode_name);
  this.mode   = mode;
  mode.raw    = raw;

  if(raw == null)
  {
    mode.errors.push(new Glaemscribe.Glaeml.Error(0, "No sourcecode. Forgot to load it?"));
    return mode;
  }

  if(mode_options == null)
    mode_options = {};

  var doc     = new Glaemscribe.Glaeml.Parser().parse(raw);
  if(doc.errors.length > 0)
  {
    mode.errors = doc.errors
    return mode;
  }

  this.verify_mode_glaeml(doc);

  if(mode.errors.length > 0)
    return mode;

  mode.language    = doc.root_node.gpath('language')[0].args[0]
  mode.writing     = doc.root_node.gpath('writing')[0].args[0]
  mode.human_name  = doc.root_node.gpath('mode')[0].args[0]
  mode.authors     = doc.root_node.gpath('authors')[0].args[0]
  mode.version     = doc.root_node.gpath('version')[0].args[0]
  mode.invention   = (doc.root_node.gpath('invention')[0] || {args:[]}).args[0]
  mode.world       = (doc.root_node.gpath('world')[0] || {args:[]}).args[0]
  mode.raw_mode_name = (doc.root_node.gpath('raw_mode')[0] || {args:[]}).args[0]

  doc.root_node.gpath('options.option').glaem_each(function(_,option_element) {

    var values          = {};
    var visibility      = null;

    option_element.gpath('value').glaem_each(function(_, value_element) {
      var value_name                = value_element.args[0];
      values[value_name]            = parseInt(value_element.args[1]);
    });
    option_element.gpath('visible_when').glaem_each(function(_, visible_element) {
      visibility = visible_element.args[0];
    });

    var option_name_at          = option_element.args[0];
    var option_default_val_at   = option_element.args[1];
    // TODO: check syntax of the option name

    if(option_default_val_at == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(option_element.line, "Missing option 'default' value."));
    }

    var option                = new Glaemscribe.Option(mode, option_name_at, option_default_val_at, values, visibility);
    mode.options[option.name] = option;
  });

  var charset_elements   = doc.root_node.gpath('charset');

  for(var c=0; c<charset_elements.length; c++)
  {
    var charset_element     = charset_elements[c];

    var charset_name        = charset_element.args[0];
    var charset             = Glaemscribe.resource_manager.loaded_charsets[charset_name];

    if(!charset)
    {
      Glaemscribe.resource_manager.load_charsets([charset_name]);
      charset = Glaemscribe.resource_manager.loaded_charsets[charset_name];
    }

    if(charset)
    {
      if(charset.errors.length > 0)
      {
        for(var e=0; e<charset.errors.length; e++)
        {
          var err = charset.errors[e];
          mode.errors.push(new Glaemscribe.Glaeml.Error(charset_element.line, charset_name + ":" + err.line + ":" + err.text));
        }
        return mode;
      }

      mode.supported_charsets[charset_name] = charset;
      var is_default = charset_element.args[1];
      if(is_default && is_default == "true")
        mode.default_charset = charset
    }
    else
    {
      mode.warnings.push(new Glaemscribe.Glaeml.Error(charset_element.line, "Failed to load charset '" + charset_name + "'."));
    }
  }

  if(!mode.default_charset)
  {
    mode.warnings.push(new Glaemscribe.Glaeml.Error(0, "No default charset defined!!"));
  }

  // Read the preprocessor
  var preprocessor_element  = doc.root_node.gpath("preprocessor")[0];
  if(preprocessor_element)
    this.parse_pre_post_processor(preprocessor_element, true);

  // Read the postprocessor
  var postprocessor_element  = doc.root_node.gpath("postprocessor")[0];
  if(postprocessor_element)
    this.parse_pre_post_processor(postprocessor_element, false);

  var outspace_element   = doc.root_node.gpath('outspace')[0];
  if(outspace_element)
  {
    var val                        = outspace_element.args[0];
    mode.post_processor.out_space  = stringListToCleanArray(val,/\s/);
  }

  var rules_elements  = doc.root_node.gpath('processor.rules');

  for(var re=0; re<rules_elements.length; re++)
  {
    var rules_element = rules_elements[re];

    var rule_group_name                               = rules_element.args[0];
    var rule_group                                    = new Glaemscribe.RuleGroup(mode, rule_group_name)
    mode.processor.rule_groups[rule_group_name]       = rule_group

    var text_procedure = function(current_parent_code_block, element) {

      // A block of code lines. Put them in a codelinesterm.
      var term = current_parent_code_block.terms[current_parent_code_block.terms.length-1];
      if(term == null || !term.is_code_lines() )
      {
        term = new Glaemscribe.IfTree.CodeLinesTerm(current_parent_code_block);
        current_parent_code_block.terms.push(term);
      }

      var lcount          = element.line;
      var lines           = element.args[0].split("\n");

      for(var l=0; l < lines.length; l++)
      {
        var line        = lines[l].trim();
        var codeline    = new Glaemscribe.IfTree.CodeLine(line, lcount);
        term.code_lines.push(codeline);
        lcount += 1;
      }
    }

    var element_procedure = function(current_parent_code_block, element) {
      // This is fatal.
      mode.errors.push(new Glaemscribe.Glaeml.Error(element.line, "Unknown directive " + element.name + "."));
    }

    this.traverse_if_tree( rule_group.root_code_block, rules_element, text_procedure, element_procedure );
  }

  if(mode.errors.length == 0)
    mode.finalize(mode_options);

  return mode;
}

Glaemscribe.ModeParser.prototype.parse = function(mode_name) {
  var parser  = this;
  var raw     = Glaemscribe.resource_manager.raw_modes[mode_name];
  return parser.parse_raw(mode_name, raw);
}


/*
  Adding api/rule.js 
*/


Glaemscribe.Rule = function(line, rule_group) {
  this.line       = line;
  this.rule_group = rule_group;
  this.mode       = rule_group.mode;
  this.sub_rules  = [];
  this.errors     = [];
}

Glaemscribe.Rule.prototype.finalize = function(cross_schema) {
  
  if(this.errors.length > 0)
  {
    for(var i=0; i<this.errors.length; i++)
    {
      var e = this.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;    
  }

  var srccounter  = new Glaemscribe.SheafChainIterator(this.src_sheaf_chain)
  var dstcounter  = new Glaemscribe.SheafChainIterator(this.dst_sheaf_chain, cross_schema)
  
  if(srccounter.errors.length > 0)
  {
    for(var i=0; i<srccounter.errors.length; i++)
    {
      var e = srccounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  
  if(dstcounter.errors.length > 0)
  {
    for(var i=0; i<dstcounter.errors.length; i++)
    {
      var e = dstcounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  

  var srcp = srccounter.proto();
  var dstp = dstcounter.proto();
  
  if(srcp != dstp)
  {
    this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, "Source and destination are not compatible (" + srcp + " vs " + dstp + ")"));
    return;
  }
  
  do {
    
    // All equivalent combinations ...
    var src_combinations  = srccounter.combinations(); 
    // ... should be sent to one destination
    var dst_combination   = dstcounter.combinations()[0];
    
    for(var c=0;c<src_combinations.length;c++)
    {
      var src_combination = src_combinations[c];
      this.sub_rules.push(new Glaemscribe.SubRule(this, src_combination, dst_combination));
    }

    dstcounter.iterate()
  }
  while(srccounter.iterate())
}


/*
  Adding api/rule_group.js 
*/


Glaemscribe.RuleGroup = function(mode,name) {
  this.name             = name;
  this.mode             = mode;
  this.root_code_block  = new Glaemscribe.IfTree.CodeBlock();

  return this;
}

Glaemscribe.RuleGroup.VAR_NAME_REGEXP = /{([0-9A-Z_]+)}/g ;

Glaemscribe.RuleGroup.prototype.add_var = function(var_name, value) {
  this.vars[var_name] = value;
}

// Replace all vars in expression
Glaemscribe.RuleGroup.prototype.apply_vars = function(line,string) {
  var rule_group  = this;
  var mode        = this.mode;
  var goterror    = false;

  var ret = string.replace(Glaemscribe.RuleGroup.VAR_NAME_REGEXP, function(match,p1,offset,str) {
    var rep = rule_group.vars[p1];

    if(rep == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(line, "In expression: " + string + ": failed to evaluate variable: " + p1 + "."))
      goterror = true;
      return "";
    }

    return rep;
  });

  if(goterror)
    return null;

  return ret;
}

Glaemscribe.RuleGroup.prototype.descend_if_tree = function(code_block,options)
{
  var mode = this.mode;

  for(var t=0; t < code_block.terms.length; t++)
  {
    var term = code_block.terms[t];

    if(term.is_code_lines())
    {
      for(var o=0; o<term.code_lines.length; o++)
      {
        var cl = term.code_lines[o];
        this.finalize_code_line(cl);
      }
    }
    else
    {
      for(var i=0; i<term.if_conds.length; i++)
      {
        var if_cond = term.if_conds[i];
        var if_eval = new Glaemscribe.Eval.Parser;

        var res = false;

        try
        {
          res = if_eval.parse(if_cond.expression, options);
        }
        catch(err)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(if_cond.line, "Failed to evaluate condition '" + if_cond.expression + "'."));
        }

        if(res == true)
        {
          this.descend_if_tree(if_cond.child_code_block, options)
          break;
        }
      }
    }
  }
}

Glaemscribe.RuleGroup.VAR_DECL_REGEXP    = /^\s*{([0-9A-Z_]+)}\s+===\s+(.+?)\s*$/
Glaemscribe.RuleGroup.RULE_REGEXP        = /^\s*(.*?)\s+-->\s+(.+?)\s*$/
Glaemscribe.RuleGroup.CROSS_RULE_REGEXP  = /^\s*(.*?)\s+-->\s+([\s0-9,]+)\s+-->\s+(.+?)\s*$/


Glaemscribe.RuleGroup.prototype.finalize_rule = function(line, match_exp, replacement_exp, cross_schema)
{
  var match             = this.apply_vars(line, match_exp);
  var replacement       = this.apply_vars(line, replacement_exp);

  if(match == null || replacement == null) // Failed
    return;

  var rule              = new Glaemscribe.Rule(line, this);
  rule.src_sheaf_chain  = new Glaemscribe.SheafChain(rule, match, true);
  rule.dst_sheaf_chain  = new Glaemscribe.SheafChain(rule, replacement, false);

  rule.finalize(cross_schema);

  this.rules.push(rule);
}

Glaemscribe.RuleGroup.prototype.finalize_code_line = function(code_line) {

  var mode = this.mode;
  var exp = Glaemscribe.RuleGroup.VAR_DECL_REGEXP.exec(code_line.expression)
  if (exp)
  {
    var var_name      = exp[1];
    var var_value_ex  = exp[2];
    var var_value     = this.apply_vars(code_line.line, var_value_ex);

    if(var_value == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, "Thus, variable {"+ var_name + "} could not be declared."));
      return;
    }

    this.add_var(var_name,var_value);
  }
  else if(exp = Glaemscribe.RuleGroup.CROSS_RULE_REGEXP.exec(code_line.expression ))
  {
    var match         = exp[1];
    var cross         = exp[2];
    var replacement   = exp[3];

    this.finalize_rule(code_line.line, match, replacement, cross)
  }
  else if(exp = Glaemscribe.RuleGroup.RULE_REGEXP.exec(code_line.expression ))
  {
    var match         = exp[1];
    var replacement   = exp[2];

    this.finalize_rule(code_line.line, match, replacement)
  }
  else if(code_line.expression == "")
  {
    // Do nothing
  }
  else
  {
    mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, ": Cannot understand '" + code_line.expression  + "'."));
  }
}

Glaemscribe.RuleGroup.prototype.finalize = function(options) {
  var rule_group        = this;

  this.vars       = {}
  this.in_charset = {}
  this.rules      = []

  this.add_var("NULL","");

  this.add_var("UNDERSCORE",Glaemscribe.SPECIAL_CHAR_UNDERSCORE);
  this.add_var("NBSP",      Glaemscribe.SPECIAL_CHAR_NBSP);

  this.descend_if_tree(this.root_code_block, options)

  // Now that we have selected our rules, create the in_charset of the rule_group
  rule_group.in_charset = {};
  for(var r=0;r<rule_group.rules.length;r++)
  {
    var rule = rule_group.rules[r];
    for(var sr=0;sr<rule.sub_rules.length;sr++)
    {
      var sub_rule  = rule.sub_rules[sr];
      var letters   = sub_rule.src_combination.join("").split("");

      for(var l=0;l<letters.length;l++)
      {
        var inchar = letters[l];

        // Ignore '_' (bounds of word) and '|' (word breaker)
        if(inchar != Glaemscribe.WORD_BREAKER && inchar != Glaemscribe.WORD_BOUNDARY)
          rule_group.in_charset[inchar] = rule_group;
      }
    }
  }
}


/*
  Adding api/sub_rule.js 
*/


Glaemscribe.SubRule = function(rule, src_combination, dst_combination)
{
  this.src_combination = src_combination;
  this.dst_combination = dst_combination;
}


/*
  Adding api/sheaf.js 
*/


Glaemscribe.Sheaf = function(sheaf_chain, expression, linkable) {
  
  var sheaf = this;
  
  sheaf.sheaf_chain    = sheaf_chain;
  sheaf.mode           = sheaf_chain.mode;
  sheaf.rule           = sheaf_chain.rule;
  sheaf.expression     = expression;
  sheaf.linkable       = linkable;
  
  // The ruby function has -1 to tell split not to remove empty stirngs at the end
  // Javascript does not need this
  sheaf.fragment_exps  = expression.split(Glaemscribe.Sheaf.SHEAF_SEPARATOR).map(function(elt) {return elt.trim();});

  if(sheaf.fragment_exps.length == 0)
    sheaf.fragment_exps  = [""]; 
           
  sheaf.fragments = sheaf.fragment_exps.map(function(fragment_exp) { 
    return new Glaemscribe.Fragment(sheaf, fragment_exp)
  });
}
Glaemscribe.Sheaf.SHEAF_SEPARATOR = "*"

Glaemscribe.Sheaf.prototype.is_src = function() { return this.sheaf_chain.is_src; };
Glaemscribe.Sheaf.prototype.is_dst = function() { return !this.sheaf_chain.is_src };
Glaemscribe.Sheaf.prototype.mode   = function() { return this.sheaf_chain.mode(); };


/*
  Adding api/sheaf_chain.js 
*/


Glaemscribe.SheafChain = function(rule, expression, is_src)
{
  var sheaf_chain = this;
  
  sheaf_chain.rule       = rule;
  sheaf_chain.mode       = rule.mode;
  sheaf_chain.is_src     = is_src;
  sheaf_chain.expression = expression;
   
  sheaf_chain.sheaf_exps = stringListToCleanArray(expression,Glaemscribe.SheafChain.SHEAF_REGEXP_OUT)

  sheaf_chain.sheaf_exps = sheaf_chain.sheaf_exps.map(function(sheaf_exp) { 
    var exp       =  Glaemscribe.SheafChain.SHEAF_REGEXP_IN.exec(sheaf_exp);
    var linkable  = false;
    if(exp) {
      sheaf_exp   = exp[1];
      linkable    = true;
    }
    
    return { exp: sheaf_exp.trim(), linkable: linkable} ;
  });

  sheaf_chain.sheaves    = sheaf_chain.sheaf_exps.map(function(sd) { return new Glaemscribe.Sheaf(sheaf_chain, sd['exp'], sd['linkable']) });
  
  if(sheaf_chain.sheaves.length == 0)
    sheaf_chain.sheaves    = [new Glaemscribe.Sheaf(sheaf_chain, "", false)]
    
  return sheaf_chain;    
}

Glaemscribe.SheafChain.SHEAF_REGEXP_IN    = /\[(.*?)\]/;
Glaemscribe.SheafChain.SHEAF_REGEXP_OUT   = /(\[.*?\])/;

Glaemscribe.SheafChain.prototype.mode = function() { return this.rule.mode() };

/*
  Adding api/sheaf_chain_iterator.js 
*/


Glaemscribe.SheafChainIterator = function (sheaf_chain, cross_schema)
{
  var sci = this;
  
  sci.sheaf_chain = sheaf_chain;
  sci.sizes       = sheaf_chain.sheaves.map(function(sheaf) {  return sheaf.fragments.length });
   
  sci.iterators   = sci.sizes.map(function(elt) { return 0;});
  
  sci.errors      = [];

  var identity_cross_array  = []
  var sheaf_count           = sheaf_chain.sheaves.length;

  // Construct the identity array
  for(var i=0;i<sheaf_count;i++)
    identity_cross_array.push(i);
  
  // Make a list of linkable sheaves
  var iterable_idxs   = [];
  var prototype_array = [];
  sheaf_chain.sheaves.glaem_each(function(i,sheaf) {
    if(sheaf.linkable)
    {
      iterable_idxs.push(i);
      prototype_array.push(sheaf.fragments.length);
    }
  });
    
  sci.cross_array = identity_cross_array;
  sci.proto_attr  = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';

  // Construct the cross array
  if(cross_schema != null)
  {
    cross_schema    = cross_schema.split(",").map(function(i) { return parseInt(i) - 1 });

    // Verify that the number of iterables is equal to the cross schema length
    var it_count    = iterable_idxs.length;
    var ca_count    = cross_schema.length;
    
    if(ca_count != it_count)
    {
      sci.errors.push(it_count + " linkable sheaves found in right predicate, but " + ca_count + " elements in cross rule."); 
      return; 
    }
    
    // Verify that the cross schema is correct (should be a permutation of the identity)
    var it_identity_array = [];
    for(var i=0;i<it_count;i++)
      it_identity_array.push(i);
    
    var sorted = cross_schema.slice(0).sort(); // clone and sort
    
    if(!it_identity_array.equals(sorted))
    {
      sci.errors.push("Cross rule schema should be a permutation of the identity (it should contain 1,2,..,n numbers once and only once).");
      return;
    }
    
    var prototype_array_permutted = prototype_array.slice(0);
    
    // Now calculate the cross array
    cross_schema.glaem_each(function(from,to) {
      var to_permut = iterable_idxs[from];
      var permut    = iterable_idxs[to];
      sci.cross_array[to_permut] = permut;
      prototype_array_permutted[from] = prototype_array[to];
    });
    prototype_array = prototype_array_permutted;
  }

  sci.proto_attr = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';
}

// Beware, 'prototype' is a reserved keyword
Glaemscribe.SheafChainIterator.prototype.proto = function() {
  var sci = this;
  return sci.proto_attr;
}

Glaemscribe.SheafChainIterator.prototype.combinations = function()
{
  var sci = this;
  var resolved = [];
  
  for(var i=0;i<sci.iterators.length;i++)
  {
    var counter   = sci.iterators[i];
    var sheaf     = sci.sheaf_chain.sheaves[i];
    
    var fragment  = sheaf.fragments[counter];
    resolved.push(fragment.combinations); 
  }
    
  var res = resolved[0]; 
  for(var i=0;i<resolved.length-1;i++)
  {
    var prod  = res.productize(resolved[i+1]);
    res       = prod.map(function(elt) {
      var e1 = elt[0];
      var e2 = elt[1];
      return e1.concat(e2);
    }); 
  }
  return res;
}

Glaemscribe.SheafChainIterator.prototype.iterate = function()
{
  var sci = this;
  var pos = 0
  
  while(pos < sci.sizes.length)
  {
    var realpos = sci.cross_array[pos];
    sci.iterators[realpos] += 1;
    if(sci.iterators[realpos] >= sci.sizes[realpos])
    {
      sci.iterators[realpos] = 0;
      pos += 1;
    }
    else
      return true;
  }
  
  // Wrapped!
  return false  
}


/*
  Adding api/if_tree.js 
*/


Glaemscribe.IfTree = {}

/* ================ */

Glaemscribe.IfTree.IfCond = function(line, parent_if_term, expression)
{
  this.line = line;
  this.parent_if_term = parent_if_term;
  this.expression = expression;
  return this;
}

/* ================ */

Glaemscribe.IfTree.Term = function(parent_code_block)
{
  this.parent_code_block = parent_code_block;
  return this;
}
Glaemscribe.IfTree.Term.prototype.is_code_lines = function()
{
  return false;
}
Glaemscribe.IfTree.Term.prototype.is_pre_post_processor_operators = function()
{
  return false;
}
Glaemscribe.IfTree.Term.prototype.name = function()
{
  return "TERM"
}
Glaemscribe.IfTree.Term.prototype.dump = function(level)
{
  var str = "";
  for(var i=0;i<level;i++)
    str += " ";
  str += "|-" + this.name(); 
  console.log(str);
}

/* ================ */

Glaemscribe.IfTree.IfTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.if_conds = [];
  return this;
}
Glaemscribe.IfTree.IfTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.IfTerm.prototype.name = function()
{
  return "IF_TERM";
}
Glaemscribe.IfTree.IfTerm.prototype.dump = function(level)
{
  this.parent.dump.call(this,level);
  
}

/* ================ */

Glaemscribe.IfTree.CodeLine = function(expression, line)
{
  this.expression = expression;
  this.line       = line;
  return this;
}

/* ================ */

Glaemscribe.IfTree.PrePostProcessorOperatorsTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.operators = []
  return this;
}
Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.prototype.name = function()
{
  return "OP_TERM";
}
Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.prototype.is_pre_post_processor_operators = function()
{
  return true;
}

/* ================ */

Glaemscribe.IfTree.CodeLinesTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.code_lines = []
  return this;
}
Glaemscribe.IfTree.CodeLinesTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.CodeLinesTerm.prototype.name = function()
{
  return "CL_TERM";
}
Glaemscribe.IfTree.CodeLinesTerm.prototype.is_code_lines = function()
{
  return true;
}
      
/* ================ */

Glaemscribe.IfTree.CodeBlock = function(parent_if_cond)
{
  this.parent_if_cond = parent_if_cond;
  this.terms          = [];
  return this;
}

Glaemscribe.IfTree.CodeBlock.prototype.dump = function(level)
{
  var str = "";
  for(var i=0;i<level;i++)
    str += " ";
  str += "|-BLOCK"; 
  console.log(str);
  
  for(var t=0;t<this.terms.length; t++)
    this.terms[t].dump(level+1);
}



/*
  Adding api/eval.js 
*/


Glaemscribe.Eval = {}
Glaemscribe.Eval.Token = function(name, expression)
{
  this.name       = name;
  this.expression = expression;
}
Glaemscribe.Eval.Token.prototype.is_regexp = function()
{
  return (this.expression instanceof RegExp);
}
Glaemscribe.Eval.Token.prototype.clone = function(value)
{
  var t = new Glaemscribe.Eval.Token(this.name, this.expression);
  t.value = value;
  return t;
}

Glaemscribe.Eval.Lexer = function(exp) {
  this.exp            = exp;
  this.token_chain    = [];
  this.retain_last    = false
}
Glaemscribe.Eval.Lexer.prototype.uneat = function()
{
  this.retain_last = true;
}
Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS = [
  new Glaemscribe.Eval.Token("bool_or",      "||"),
  new Glaemscribe.Eval.Token("bool_and",     "&&"),
  new Glaemscribe.Eval.Token("cond_inf_eq",  "<="),
  new Glaemscribe.Eval.Token("cond_inf",     "<"),
  new Glaemscribe.Eval.Token("cond_sup_eq",  ">="),
  new Glaemscribe.Eval.Token("cond_sup",     ">"),
  new Glaemscribe.Eval.Token("cond_eq",      "=="),
  new Glaemscribe.Eval.Token("cond_not_eq",  "!="),
  new Glaemscribe.Eval.Token("add_plus",     "+"),
  new Glaemscribe.Eval.Token("add_minus",    "-"),
  new Glaemscribe.Eval.Token("mult_times",   "*"),
  new Glaemscribe.Eval.Token("mult_div",     "/"),
  new Glaemscribe.Eval.Token("mult_modulo",  "%"),
  new Glaemscribe.Eval.Token("prim_not",     "!"),
  new Glaemscribe.Eval.Token("prim_lparen",  "("),
  new Glaemscribe.Eval.Token("prim_rparen",  ")"),
  new Glaemscribe.Eval.Token("prim_string",  /^'[^']*'/),
  new Glaemscribe.Eval.Token("prim_string",  /^"[^"]*"/),
  new Glaemscribe.Eval.Token("prim_const",   /^[a-zA-Z0-9_.]+/)
];   
Glaemscribe.Eval.Lexer.prototype.TOKEN_END = new Glaemscribe.Eval.Token("prim_end","");

Glaemscribe.Eval.Lexer.prototype.advance = function()
{
  this.exp = this.exp.trim();
    
  if(this.retain_last == true) 
  {
    this.retain_last = false
    return this.token_chain[this.token_chain.length-1];
  }
  
  if(this.exp == Glaemscribe.Eval.Lexer.prototype.TOKEN_END.expression)
  {
    var t = Glaemscribe.Eval.Lexer.prototype.TOKEN_END.clone("");
    this.token_chain.push(t);
    return t;
  }
  
  for(var t=0;t<Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS.length;t++)
  {
    var token = Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS[t];
    if(token.is_regexp())
    {
      var match = this.exp.match(token.expression);
      if(match)
      {
        var found = match[0];
        this.exp  = this.exp.substring(found.length);
        var t     = token.clone(found);
        this.token_chain.push(t);
        return t;
      }
    }
    else
    {
      if(this.exp.indexOf(token.expression) == 0)
      {
        this.exp = this.exp.substring(token.expression.length);
        var t    = token.clone(token.expression);
        this.token_chain.push(t);
        return t;        
      }
    }
  }
  
  throw "UnknownToken";    
}

Glaemscribe.Eval.Parser = function() {}
Glaemscribe.Eval.Parser.prototype.parse = function(exp, vars)
{  
  this.lexer  = new Glaemscribe.Eval.Lexer(exp);
  this.vars   = vars;
  return this.parse_top_level();
}

Glaemscribe.Eval.Parser.prototype.parse_top_level = function()
{
  return this.explore_bool();
}

Glaemscribe.Eval.Parser.prototype.explore_bool = function()
{
  var v     = this.explore_compare();
  var stop  = false
  while(!stop)
  {
    switch(this.lexer.advance().name)
    {
    case 'bool_or':
      if(v == true)
        this.explore_bool();
      else
        v = this.explore_compare();
      break;
    case 'bool_and':
      if(!v == true)
        this.explore_bool(); 
      else
        v = this.explore_compare();
      break;
    default:
      stop = true;
    }
  }      
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}

Glaemscribe.Eval.Parser.prototype.explore_compare = function()
{
  var v = this.explore_add();
  var stop = false;
  while(!stop)
  {
    switch(this.lexer.advance().name)
    {
      case 'cond_inf_eq': v = (v <= this.explore_add() ); break;
      case 'cond_inf':    v = (v <  this.explore_add() ); break;
      case 'cond_sup_eq': v = (v >= this.explore_add() ); break;
      case 'cond_sup':    v = (v >  this.explore_add() ); break;
      case 'cond_eq':     v = (v == this.explore_add() ); break;
      case 'cond_not_eq': v = (v != this.explore_add() ); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat();
  return v;
}



Glaemscribe.Eval.Parser.prototype.explore_add = function()
{
  var v = this.explore_mult();
  var stop = false;
  while(!stop) {
    switch(this.lexer.advance().name)
    {
      case 'add_plus':  v += this.explore_mult(); break;
      case 'add_minus': v -= this.explore_mult(); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}

Glaemscribe.Eval.Parser.prototype.explore_mult = function()
{
  var v = this.explore_primary();
  var stop = false;
  while(!stop) {
    switch(this.lexer.advance().name)
    {
      case 'mult_times':    v *= this.explore_primary(); break;
      case 'mult_div':      v /= this.explore_primary(); break;
      case 'mult_modulo':   v %= this.explore_primary(); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}


Glaemscribe.Eval.Parser.prototype.explore_primary = function()
{
  var token = this.lexer.advance();
  var v     = null;
  switch(token.name)
  {
    case 'prim_const':  v = this.cast_constant(token.value); break;
    case 'add_minus':   v = -this.explore_primary(); break; // Allow the use of - as primary token for negative numbers
    case 'prim_not':    v = !this.explore_primary(); break; // Allow the use of ! for booleans
    case 'prim_lparen':   
    
      v               = this.parse_top_level();
      var rtoken      = this.lexer.advance(); 
    
      if(rtoken.name != 'prim_rparen') 
        throw "Missing right parenthesis."; 
    
      break;
    default:
      throw "Cannot understand: " + token.value + ".";
      break;
  }
  return v;
}

Glaemscribe.Eval.Parser.prototype.constant_is_float = function(cst)
{
  if(isNaN(cst))
    return false;
  
  return  Number(cst) % 1 !== 0;  
}

Glaemscribe.Eval.Parser.prototype.constant_is_int = function(cst)
{
  if(isNaN(cst))
    return false;
  
  return Number(cst) % 1 === 0;
}

Glaemscribe.Eval.Parser.prototype.constant_is_string = function(cst)
{
  if(cst.length < 2)
    return false;
  
  var f = cst[0]
  var l = cst[cst.length-1]
  
  return ( f == l && (l == "'" || l == '"') );
}

Glaemscribe.Eval.Parser.prototype.cast_constant = function(cst)
{
  var match = null;
  
  if(this.constant_is_int(cst))
    return parseInt(cst);
  else if(this.constant_is_float(cst))
    return parseFloat(cst);
  else if(match = cst.match(/^\'(.*)\'$/))
    return match[0];
  else if(match = cst.match(/^\"(.*)\"$/))
    return match[0];
  else if(cst == 'true')
    return true;
  else if(cst == 'false')
    return false;
  else if(cst == 'nil')
    return null;
  else if(this.vars[cst] != null)
    return this.vars[cst];
  else
    throw "Cannot understand constant '" + cst + "'.";          
}



/*
  Adding api/transcription_tree_node.js 
*/


Glaemscribe.TranscriptionTreeNode = function(character,replacement,path) {
  var tree_node         = this;
  tree_node.character   = character;
  tree_node.replacement = replacement;
  tree_node.path        = path;
  tree_node.siblings    = {}
}

Glaemscribe.TranscriptionTreeNode.prototype.is_effective = function() {
  return this.replacement != null;
}

Glaemscribe.TranscriptionTreeNode.prototype.add_subpath = function(source, rep, path) {
  if(source == null || source == "")
    return;
  
  var tree_node     = this;
  var cc            = source[0];
  var sibling       = tree_node.siblings[cc];
  var path_to_here  = (path || "") + cc;
  
  if(sibling == null)
    sibling = new Glaemscribe.TranscriptionTreeNode(cc,null,path_to_here);
    
  tree_node.siblings[cc] = sibling;
  
  if(source.length == 1)
    sibling.replacement = rep;
  else
    sibling.add_subpath(source.substring(1),rep,path_to_here);
}

Glaemscribe.TranscriptionTreeNode.prototype.transcribe = function(string, chain) {
  
  if(chain == null)
    chain = [];
  
  chain.push(this);

  if(string != "")
  {
    var cc = string[0];
    var sibling = this.siblings[cc];
    
    if(sibling)
      return sibling.transcribe(string.substring(1), chain);
  }
  
  // We are at the end of the chain
  while(chain.length > 1) {
    var last_node = chain.pop();
    if(last_node.is_effective())
      return [last_node.replacement, chain.length] 
  }
  
  // Only the root node is in the chain, we could not find anything; return the "unknown char"
  return [["*UNKNOWN"], 1]; 
}


/*
  Adding api/transcription_pre_post_processor.js 
*/


// ====================== //
//      OPERATORS         //
// ====================== //

Glaemscribe.PrePostProcessorOperator = function(glaeml_element)
{
  this.glaeml_element = glaeml_element;
  return this;
}
Glaemscribe.PrePostProcessorOperator.prototype.apply = function(l)
{
  throw "Pure virtual method, should be overloaded.";
}
Glaemscribe.PrePostProcessorOperator.prototype.eval_arg = function(arg, trans_options) {
  if(arg == null)
    return null;

  var rmatch = null;
  if( rmatch = arg.match(/^\\eval\s/) )
  {
    var to_eval = arg.substring( rmatch[0].length );
    return new Glaemscribe.Eval.Parser().parse(to_eval, trans_options);
  }
  return arg;
}
Glaemscribe.PrePostProcessorOperator.prototype.finalize_glaeml_element = function(ge, trans_options) {
  var op = this;

  for(var i=0;i<ge.args.length;i++)
    ge.args[i] = op.eval_arg(ge.args[i], trans_options);

  ge.children.glaem_each(function(idx, child) {
    op.finalize_glaeml_element(child, trans_options);
  });
  return ge;
}
Glaemscribe.PrePostProcessorOperator.prototype.finalize = function(trans_options) {
  var op = this;

  // Deep copy the glaeml_element so we can safely eval the inner args
  op.finalized_glaeml_element = op.finalize_glaeml_element(op.glaeml_element.clone(), trans_options);
}

// Inherit from PrePostProcessorOperator
Glaemscribe.PreProcessorOperator = function(raw_args)
{
  Glaemscribe.PrePostProcessorOperator.call(this,raw_args);
  return this;
}
Glaemscribe.PreProcessorOperator.inheritsFrom( Glaemscribe.PrePostProcessorOperator );

// Inherit from PrePostProcessorOperator
Glaemscribe.PostProcessorOperator = function(raw_args)
{
  Glaemscribe.PrePostProcessorOperator.call(this,raw_args);
  return this;
}
Glaemscribe.PostProcessorOperator.inheritsFrom( Glaemscribe.PrePostProcessorOperator );


// =========================== //
//      PRE/POST PROCESSORS    //
// =========================== //

Glaemscribe.TranscriptionPrePostProcessor = function(mode)
{
  this.mode             = mode;
  this.root_code_block  = new Glaemscribe.IfTree.CodeBlock();
  return this;
}

Glaemscribe.TranscriptionPrePostProcessor.prototype.finalize = function(options)
{
  this.operators = []
  this.descend_if_tree(this.root_code_block, options);

  this.operators.glaem_each(function(op_num, op) {
    op.finalize(options);
  });
}

Glaemscribe.TranscriptionPrePostProcessor.prototype.descend_if_tree = function(code_block, options)
{
  for(var t=0; t < code_block.terms.length; t++)
  {
    var term = code_block.terms[t];

    if(term.is_pre_post_processor_operators())
    {
      for(var o=0; o<term.operators.length; o++)
      {
        var operator = term.operators[o];
        this.operators.push(operator);
      }
    }
    else
    {
      for(var i=0; i < term.if_conds.length; i++)
      {
        var if_cond = term.if_conds[i];
        var if_eval = new Glaemscribe.Eval.Parser();

        // TODO: CONTEXT VARS!!
        if(if_eval.parse(if_cond.expression, options) == true)
        {
          this.descend_if_tree(if_cond.child_code_block, options)
          break; // Don't try other conditions!
        }
      }
    }
  }
}

// PREPROCESSOR
// Inherit from TranscriptionPrePostProcessor; a bit more verbose than in ruby ...
Glaemscribe.TranscriptionPreProcessor = function(mode)
{
  Glaemscribe.TranscriptionPrePostProcessor.call(this,mode);
  return this;
}
Glaemscribe.TranscriptionPreProcessor.inheritsFrom( Glaemscribe.TranscriptionPrePostProcessor );

Glaemscribe.TranscriptionPreProcessor.prototype.apply = function(l)
{
  var ret = l

  for(var i=0;i<this.operators.length;i++)
  {
    var operator  = this.operators[i];
    ret       = operator.apply(ret);
  }

  return ret;
}

// POSTPROCESSOR
// Inherit from TranscriptionPrePostProcessor; a bit more verbose than in ruby ...
Glaemscribe.TranscriptionPostProcessor = function(mode)
{
  Glaemscribe.TranscriptionPrePostProcessor.call(this,mode);
  return this;
}
Glaemscribe.TranscriptionPostProcessor.inheritsFrom( Glaemscribe.TranscriptionPrePostProcessor );

Glaemscribe.TranscriptionPostProcessor.prototype.apply = function(tokens, out_charset)
{
  var out_space_str     = " ";
  if(this.out_space != null)
  {
    out_space_str       = this.out_space.map(function(token) { return out_charset.n2c(token).output() }).join("");
  }

  for(var i=0;i<this.operators.length;i++)
  {
    var operator  = this.operators[i];
    tokens        = operator.apply(tokens, out_charset);
  }

  // Convert output
  var ret = "";
  for(var t=0;t<tokens.length;t++)
  {
    var token = tokens[t];
    switch(token)
    {
    case "":
      break;
    case "*UNKNOWN":
      ret += Glaemscribe.UNKNOWN_CHAR_OUTPUT;
      break;
    case "*SPACE":
      ret += out_space_str;
      break;
    case "*LF":
      ret += "\n";
    default:
      var c = out_charset.n2c(token);
      if(!c)
        ret += Glaemscribe.UNKNOWN_CHAR_OUTPUT; // Should not happen
      else
        ret += c.output();
    }
  }

  return ret;
}




/*
  Adding api/transcription_processor.js 
*/


Glaemscribe.TranscriptionProcessor = function(mode)
{
  this.mode         = mode;
  this.rule_groups  = {};
  
  return this;
}

Glaemscribe.TranscriptionProcessor.prototype.finalize = function(options) {
  
  var processor = this;
  var mode = this.mode;
    
  processor.transcription_tree = new Glaemscribe.TranscriptionTreeNode(null,null,"");
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BOUNDARY, [""]);
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BREAKER,  [""]);
  
  this.rule_groups.glaem_each(function(gname,rg) {
    rg.finalize(options);
  });
  
  // Build the input charsets
  processor.in_charset = {}
  
  this.rule_groups.glaem_each(function(gname, rg) {
    rg.in_charset.glaem_each(function(char, group) {
      
      var group_for_char  = processor.in_charset[char];
           
      if(group_for_char != null)
        mode.errors.push(new Glaemscribe.Glaeml.Error(0, "Group " + gname + " uses input character " + char + " which is also used by group " + group_for_char.name + ". Input charsets should not intersect between groups.")); 
      else
        processor.in_charset[char] = group;
      
    })
  });
  
  this.rule_groups.glaem_each(function(gname, rg) {
    for(var r=0;r<rg.rules.length;r++)
    {
      var rule = rg.rules[r];
      
      for(var sr=0;sr<rule.sub_rules.length;sr++)
      {  
        var sub_rule = rule.sub_rules[sr];
        processor.add_subrule(sub_rule);    
      }  
    }
  });
     
}

Glaemscribe.TranscriptionProcessor.prototype.add_subrule = function(sub_rule) {
  var path = sub_rule.src_combination.join("");
  this.transcription_tree.add_subpath(path, sub_rule.dst_combination)
}


Glaemscribe.TranscriptionProcessor.prototype.apply = function(l, debug_context) {
      
  var ret               = [];
  var current_group     = null;
  var accumulated_word  = "";
  
  var chars             = l.split("");
  for(var i=0;i<chars.length;i++)
  {
    var c = chars[i];
    switch(c)
    {
      case " ":
      case "\t":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*SPACE");
            
        accumulated_word = "";
        break;
      case "\r":
        // ignore
        break;
      case "\n":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*LF");
        
        accumulated_word = ""
        break;
      default:
        var c_group = this.in_charset[c];
        if(c_group == current_group)
          accumulated_word += c;
        else
        {
          ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
          current_group    = c_group;
          accumulated_word = c;
        }
        break;
    }
    
  }
  // End of stirng
  ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
  return ret;
}

Glaemscribe.TranscriptionProcessor.prototype.transcribe_word = function(word, debug_context) {
  
  var processor = this;
    
  var res = [];
  var word = Glaemscribe.WORD_BOUNDARY + word + Glaemscribe.WORD_BOUNDARY;

  while(word.length != 0)
  {    
    // Explore tree
    var ttret = this.transcription_tree.transcribe(word);   
    
    // r is the replacement, len its length
    var tokens    = ttret[0];
    var len       = ttret[1];   
    var eaten     = word.substring(0,len);
    
    word          = word.substring(len); // eat len characters
    res           = res.concat(tokens);
    
    debug_context.processor_pathes.push([eaten, tokens, tokens]);
  }
  
  return res;
}
      

/*
  Adding api/pre_processor/downcase.js 
*/


Glaemscribe.DowncasePreProcessorOperator = function(args)  
{
  Glaemscribe.PreProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.DowncasePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.DowncasePreProcessorOperator.prototype.apply = function(str)
{
  return str.toLowerCase();
}  

Glaemscribe.resource_manager.register_pre_processor_class("downcase", Glaemscribe.DowncasePreProcessorOperator);    


/*
  Adding api/pre_processor/rxsubstitute.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.RxSubstitutePreProcessorOperator = function(glaeml_element)  
{
  Glaemscribe.PreProcessorOperator.call(this, glaeml_element); //super
  return this;
} 
Glaemscribe.RxSubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.RxSubstitutePreProcessorOperator.prototype.finalize = function(trans_options) {
  
  Glaemscribe.PreProcessorOperator.prototype.finalize.call(this, trans_options); // super
  
  // Ruby uses \1, \2, etc for captured expressions. Convert to javascript. 
  this.finalized_glaeml_element.args[1] = this.finalized_glaeml_element.args[1].replace(/(\\\d)/g,function(cap) { return "$" + cap.replace("\\","")});  
}

Glaemscribe.RxSubstitutePreProcessorOperator.prototype.apply = function(str)
{
  var what  = new RegExp(this.finalized_glaeml_element.args[0],"g");
  var to    = this.finalized_glaeml_element.args[1];

  return str.replace(what,to);
}  

Glaemscribe.resource_manager.register_pre_processor_class("rxsubstitute", Glaemscribe.RxSubstitutePreProcessorOperator);    


/*
  Adding api/pre_processor/substitute.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.SubstitutePreProcessorOperator = function(args)  
{
  Glaemscribe.PreProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.SubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.SubstitutePreProcessorOperator.prototype.apply = function(str)
{
  var what  = new RegExp(this.finalized_glaeml_element.args[0],"g");
  var to    = this.finalized_glaeml_element.args[1];

  return str.replace(what,to);
}  

Glaemscribe.resource_manager.register_pre_processor_class("substitute", Glaemscribe.SubstitutePreProcessorOperator);    


/*
  Adding api/pre_processor/up_down_tehta_split.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.UpDownTehtaSplitPreProcessorOperator = function(args)  
{
  Glaemscribe.PreProcessorOperator.call(this,args); //super 
  return this;
} 
Glaemscribe.UpDownTehtaSplitPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.finalize = function(trans_options) {
  Glaemscribe.PreProcessorOperator.prototype.finalize.call(this, trans_options); // super
   
  var op    = this;
  var args  = op.finalized_glaeml_element.args; 
  
  var vowel_list      = args[0];
  var consonant_list  = args[1];
      
  vowel_list          = vowel_list.split(/,/).map(function(s) {return s.trim(); });
  consonant_list      = consonant_list.split(/,/).map(function(s) {return s.trim(); });
     
  this.vowel_map          = {}; // Recognize vowel tokens
  this.consonant_map      = {};// Recognize consonant tokens
  this.splitter_tree      = new Glaemscribe.TranscriptionTreeNode(null,null,""); // Recognize tokens
  this.word_split_map     = {};
  // The word split map will help to recognize words
  // The splitter tree will help to split words into tokens
  
  for(var vi=0;vi<vowel_list.length;vi++)
  {
    var v = vowel_list[vi];
    this.splitter_tree.add_subpath(v, v); 
    this.vowel_map[v] = v;
  }
  for(var ci=0;ci<consonant_list.length;ci++)
  {
    var c = consonant_list[ci];
    this.splitter_tree.add_subpath(c, c); 
    this.consonant_map[c] = c;
  }

  var all_letters = vowel_list.concat(consonant_list).join("").split("").sort().unique();

  for(var li=0;li<all_letters.length;li++)
  {
    var l = all_letters[li];
    this.word_split_map[l] = l;
  }    
   
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.type_of_token = function(token)
{
  if(this.vowel_map[token] != null)          return "V";
  if(this.consonant_map[token] != null)      return "C";
  return "X";
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply_to_word = function(w)
{
  var res = [];
   
  if(w.trim() == "")
    res.push(w);
  else
  {
    while(w.length != 0)
    {
      var ret = this.splitter_tree.transcribe(w)
      var r   = ret[0];
      var len = ret[1];   
      
      if(r instanceof Array && r.equals([Glaemscribe.UNKNOWN_CHAR_OUTPUT]))
        res.push(w[0]); 
      else
        res.push(r); 
    
      w = w.substring(len);
    }
  }
    
    
  var res_modified = [];

  // We replace the pattern CVC by CvVC where v is a phantom vowel.
  // This makes the pattern CVC not possible.
  var i = 0
  while(i < res.length - 2)
  {
    var r0 = res[i];
    var r1 = res[i+1];
    var r2 = res[i+2];;
    var t0 = this.type_of_token(r0);
    var t1 = this.type_of_token(r1);
    var t2 = this.type_of_token(r2);
   
    if(t0 == "C" && t1 == "V" && t2 == "C")
    {
      res_modified.push(res[i]);
      res_modified.push("@");
      res_modified.push(res[i+1]); 
      i += 2;
    }
    else
    {   
      res_modified.push(res[i]);
      i += 1;
    }
  }

  // Add the remaining stuff
  while(i < res.length)
  {
    res_modified.push(res[i]);
    i += 1
  }
    
  return res_modified.join("")       
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply = function(content)
{
  var accumulated_word = ""  
  var ret = ""
        
  var letters = content.split("");
  for(var li=0;li<letters.length;li++)
  {
    var letter = letters[li];
    if(this.word_split_map[letter] != null)
      accumulated_word += letter;
    else
    {
      ret += this.apply_to_word(accumulated_word);
      ret += letter;
      accumulated_word = "";
    }        
  }
  ret += this.apply_to_word(accumulated_word) 
  
  return ret;         
}  

Glaemscribe.resource_manager.register_pre_processor_class("up_down_tehta_split", Glaemscribe.UpDownTehtaSplitPreProcessorOperator);    



/*
  Adding api/pre_processor/elvish_numbers.js 
*/


Glaemscribe.ElvishNumbersPreProcessorOperator = function(args)  {  Glaemscribe.PreProcessorOperator.call(this,args); return this; } 
Glaemscribe.ElvishNumbersPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  
Glaemscribe.ElvishNumbersPreProcessorOperator.prototype.apply = function(str)
{
  var op      = this;
  
  var base    = op.finalized_glaeml_element.args[0];
  base        = (base != null)?(parseInt(base)):(12);
  
  var reverse = op.finalized_glaeml_element.args[1]
  reverse     = (reverse != null)?(reverse == true || reverse == "true"):(true) 
  
  return str.replace(/\d+/g,function(match) {
    var inbase  = parseInt(match).toString(base);
    inbase      = inbase.toUpperCase(); // Beware, we want letters in upper case!
    
    var ret = '';
    if(reverse)
    {
      for(var i=inbase.length-1;i>=0;i--)
        ret += inbase[i];
    }
    else
    {
      ret = inbase;
    }
    
    return ret;
  });

}  

Glaemscribe.resource_manager.register_pre_processor_class("elvish_numbers", Glaemscribe.ElvishNumbersPreProcessorOperator);    


/*
  Adding api/post_processor/reverse.js 
*/


Glaemscribe.ReversePostProcessorOperator = function(args)  
{
  Glaemscribe.PostProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.ReversePostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  

Glaemscribe.ReversePostProcessorOperator.prototype.apply = function(tokens, charset)
{
  return tokens.reverse();
}  

Glaemscribe.resource_manager.register_post_processor_class("reverse", Glaemscribe.ReversePostProcessorOperator);    


/*
  Adding api/post_processor/resolve_virtuals.js 
*/



Glaemscribe.ResolveVirtualsPostProcessorOperator = function(args)  
{
  Glaemscribe.PostProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.ResolveVirtualsPostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.finalize = function(trans_options)
{
  Glaemscribe.PostProcessorOperator.prototype.finalize.call(this, trans_options); // super
  this.last_triggers = {}; // Allocate here to optimize
}  

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.reset_trigger_states = function(charset) {
  var op = this;
  charset.virtual_chars.glaem_each(function(idx,vc) {
    vc.object_reference                   = idx; // We cannot objects as references in hashes in js. Attribute a reference.
    op.last_triggers[vc.object_reference] = null; // Clear the state
  });
}

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply_loop = function(charset, tokens, new_tokens, reversed, token, idx) {
  var op = this;
  if(token == '*SPACE' || token == '*LF') {
    op.reset_trigger_states(charset);
    return; // continue
  }
  var c = charset.n2c(token);

  if(c == null)
    return;
  
  if(c.is_virtual() && (reversed == c.reversed)) {
    
    // Try to replace
    var last_trigger = op.last_triggers[c.object_reference];
    if(last_trigger != null) {
      new_tokens[idx] = last_trigger.names[0]; // Take the first name of the non-virtual replacement.
    };
  }
  else {
    // Update states of virtual classes
    charset.virtual_chars.glaem_each(function(_,vc) {
      var rc = vc.n2c(token);
      if(rc != null)
        op.last_triggers[vc.object_reference] = rc;
    });
  }  
}


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply = function(tokens, charset) {   
  var op = this;
  
  // Clone the array so that we can perform diacritics and ligatures without interfering
  var new_tokens = tokens.slice(0);
  
  op.reset_trigger_states(charset);
  tokens.glaem_each(function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,false,token,idx);
  });
  
  op.reset_trigger_states(charset);
  tokens.glaem_each_reversed(function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,true,token,idx);    
  });
  return new_tokens;
}  

Glaemscribe.resource_manager.register_post_processor_class("resolve_virtuals", Glaemscribe.ResolveVirtualsPostProcessorOperator);    



/*
  Adding extern/object-clone.js 
*/
/*
 * $Id: object-clone.js,v 0.41 2013/03/27 18:29:04 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 */

(function(global) {
    'use strict';
    if (!Object.freeze || typeof Object.freeze !== 'function') {
        throw Error('ES5 support required');
    }
    // from ES5
    var O = Object, OP = O.prototype,
    create = O.create,
    defineProperty = O.defineProperty,
    defineProperties = O.defineProperties,
    getOwnPropertyNames = O.getOwnPropertyNames,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getPrototypeOf = O.getPrototypeOf,
    freeze = O.freeze,
    isFrozen = O.isFrozen,
    isSealed = O.isSealed,
    seal = O.seal,
    isExtensible = O.isExtensible,
    preventExtensions = O.preventExtensions,
    hasOwnProperty = OP.hasOwnProperty,
    toString = OP.toString,
    isArray = Array.isArray,
    slice = Array.prototype.slice;
    // Utility functions; some exported
    function defaults(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
        });
        return dst;
    };
    var isObject = function(o) { return o === Object(o) };
    var isPrimitive = function(o) { return o !== Object(o) };
    var isFunction = function(f) { return typeof(f) === 'function' };
    var signatureOf = function(o) { return toString.call(o) };
    var HASWEAKMAP = (function() { // paranoia check
        try {
            var wm = new WeakMap();
            wm.set(wm, wm);
            return wm.get(wm) === wm;
        } catch(e) {
            return false;
        }
    })();
    // exported
    function is (x, y) {
        return x === y
            ? x !== 0 ? true
            : (1 / x === 1 / y) // +-0
        : (x !== x && y !== y); // NaN
    };
    function isnt (x, y) { return !is(x, y) };
    var defaultCK = {
        descriptors:true,
        extensibility:true, 
        enumerator:getOwnPropertyNames
    };
    function equals (x, y, ck) {
        var vx, vy;
        if (HASWEAKMAP) {
            vx = new WeakMap();
            vy = new WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _equals(x, y) {
            if (isPrimitive(x)) return is(x, y);
            if (isFunction(x))  return is(x, y);
            // check deeply
            var sx = signatureOf(x), sy = signatureOf(y);
            var i, l, px, py, sx, sy, kx, ky, dx, dy, dk, flt;
            if (sx !== sy) return false;
            switch (sx) {
            case '[object Array]':
            case '[object Object]':
                if (ck.extensibility) {
                    if (isExtensible(x) !== isExtensible(y)) return false;
                    if (isSealed(x) !== isSealed(y)) return false;
                    if (isFrozen(x) !== isFrozen(y)) return false;
                }
                if (vx) {
                    if (vx.has(x)) {
                        // console.log('circular ref found');
                        return vy.has(y);
                    }
                    vx.set(x, true);
                    vy.set(y, true);
                }
                px = ck.enumerator(x);
                py = ck.enumerator(y);
                if (ck.filter) {
                    flt = function(k) {
                        var d = getOwnPropertyDescriptor(this, k);
                        return ck.filter(d, k, this);
                    };
                    px = px.filter(flt, x);
                    py = py.filter(flt, y);
                }
                if (px.length != py.length) return false;
                px.sort(); py.sort();
                for (i = 0, l = px.length; i < l; ++i) {
                    kx = px[i];
                    ky = py[i];
                    if (kx !== ky) return false;
                    dx = getOwnPropertyDescriptor(x, ky);
                    dy = getOwnPropertyDescriptor(y, ky);
                    if ('value' in dx) {
                        if (!_equals(dx.value, dy.value)) return false;
                    } else {
                        if (dx.get && dx.get !== dy.get) return false;
                        if (dx.set && dx.set !== dy.set) return false;
                    }
                    if (ck.descriptors) {
                        if (dx.enumerable !== dy.enumerable) return false;
                        if (ck.extensibility) {
                            if (dx.writable !== dy.writable)
                                return false;
                            if (dx.configurable !== dy.configurable)
                                return false;
                        }
                    }
                }
                return true;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return ''+x === ''+y;
            default:
                throw TypeError(sx + ' not supported');
            }
        })(x, y);
    }
    function clone(src, deep, ck) {
        var wm;
        if (deep && HASWEAKMAP) {
            wm = new WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _clone(src) {
            // primitives and functions
            if (isPrimitive(src)) return src;
            if (isFunction(src)) return src;
            var sig = signatureOf(src);
            switch (sig) {
            case '[object Array]':
            case '[object Object]':
                if (wm) {
                    if (wm.has(src)) {
                        // console.log('circular ref found');
                        return src;
                    }
                    wm.set(src, true);
                }
                var isarray = isArray(src);
                var dst = isarray ? [] : create(getPrototypeOf(src));
                ck.enumerator(src).forEach(function(k) {
                    // Firefox forbids defineProperty(obj, 'length' desc)
                    if (isarray && k === 'length') {
                        dst.length = src.length;
                    } else {
                        if (ck.descriptors) {
                            var desc = getOwnPropertyDescriptor(src, k);
                            if (ck.filter && !ck.filter(desc, k, src)) return;
                            if (deep && 'value' in desc) 
                                desc.value = _clone(src[k]);
                            defineProperty(dst, k, desc);
                        } else {
                            dst[k] = _clone(src[k]);
                        }
                    }
                });
                if (ck.extensibility) {
                    if (!isExtensible(src)) preventExtensions(dst);
                    if (isSealed(src)) seal(dst);
                    if (isFrozen(src)) freeze(dst);
                }
                return dst;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return deep ? new src.constructor(src.valueOf()) : src;
            default:
                throw TypeError(sig + ' is not supported');
            }
        })(src);
    };
    //  Install
    var obj2specs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            specs[k] = {
                value: src[k],
                configurable: true,
                writable: true,
                enumerable: false
            };
        });
        return specs;
    };
    var defaultProperties = function(dst, descs) {
        getOwnPropertyNames(descs).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, descs[k]
            );
        });
        return dst;
    };
    (Object.installProperties || defaultProperties)(Object, obj2specs({
        // Avoid conflicts with other projects, rename glaem_clone
        glaem_clone: clone,
        // is: is,
        // isnt: isnt,
        // equals: equals
    }));
})(this);


Glaemscribe.resource_manager.raw_charsets["cirth_ds"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\n\\**   **\\ \\char 20 SPACE\n\\** ! **\\ \\char 21 CIRTH_11\n\\** \" **\\ \\char 22 CIRTH_EREB_3\n\\** # **\\ \\char 23 CIRTH_13\n\\** $ **\\ \\char 24 CIRTH_14\n\\** % **\\ \\char 25 CIRTH_15\n\\** & **\\ \\char 26 CIRTH_EREB_4\n\\** \' **\\ \\char 27 ?\n\\** ( **\\ \\char 28 CIRTH_EREB_6\n\\** ) **\\ \\char 29 CIRTH_EREB_7\n\\** * **\\ \\char 2a CIRTH_EREB_5\n\\** + **\\ \\char 2b CIRTH_NUMERAL_4\n\\** , **\\ \\char 2c CIRTH_53\n\\** - **\\ \\char 2d ?\n\\** . **\\ \\char 2e CIRTH_54\n\\** / **\\ \\char 2f CIRTH_55\n\\** 0 **\\ \\char 30 CIRTH_10\n\\** 1 **\\ \\char 31 CIRTH_1\n\\** 2 **\\ \\char 32 CIRTH_2\n\\** 3 **\\ \\char 33 CIRTH_3\n\\** 4 **\\ \\char 34 CIRTH_4\n\\** 5 **\\ \\char 35 CIRTH_5\n\\** 6 **\\ \\char 36 CIRTH_6\n\\** 7 **\\ \\char 37 CIRTH_7\n\\** 8 **\\ \\char 38 CIRTH_8\n\\** 9 **\\ \\char 39 CIRTH_9\n\\** : **\\ \\char 3a CIRTH_EREB_2\n\\** ; **\\ \\char 3b CIRTH_40\n\\** < **\\ \\char 3c CIRTH_52_ALT\n\\** = **\\ \\char 3d ?\n\\** > **\\ \\char 3e CIRTH_55_ALT\n\\** ? **\\ \\char 3f CIRTH_56_ALT\n\\** @ **\\ \\char 40 CIRTH_12\n\\** A **\\ \\char 41 CIRTH_41\n\\** B **\\ \\char 42 CIRTH_60\n\\** C **\\ \\char 43 CIRTH_58\n\\** D **\\ \\char 44 CIRTH_43\n\\** E **\\ \\char 45 CIRTH_28\n\\** F **\\ \\char 46 CIRTH_44\n\\** G **\\ \\char 47 CIRTH_45\n\\** H **\\ \\char 48 ?\n\\** I **\\ \\char 49 CIRTH_PUNCT_MID_DOT\n\\** J **\\ \\char 4a CIRTH_38_ALT\n\\** K **\\ \\char 4b CIRTH_EREB_1\n\\** L **\\ \\char 4c CIRTH_45_ALT\n\\** M **\\ \\char 4d CIRTH_51_ALT\n\\** N **\\ \\char 4e CIRTH_SPACE\n\\** O **\\ \\char 4f CIRTH_PUNCT_TWO_DOTS\n\\** P **\\ \\char 50 CIRTH_PUNCT_THREE_DOTS\n\\** Q **\\ \\char 51 CIRTH_26\n\\** R **\\ \\char 52 CIRTH_29\n\\** S **\\ \\char 53 CIRTH_42\n\\** T **\\ \\char 54 CIRTH_30\n\\** U **\\ \\char 55 CIRTH_PUNCT_STAR\n\\** V **\\ \\char 56 CIRTH_59\n\\** W **\\ \\char 57 CIRTH_27\n\\** X **\\ \\char 58 CIRTH_57\n\\** Y **\\ \\char 59 ?\n\\** Z **\\ \\char 5a CIRTH_56\n\\** [ **\\ \\char 5b ?\n\\** \\ **\\ \\char 5c CIRTH_PUNCT_DOT\n\\** ] **\\ \\char 5d ?\n\\** ^ **\\ \\char 5e ?\n\\** _ **\\ \\char 5f ?\n\\** ` **\\ \\char 60 CIRTH_SPACE_BIG\n\\** a **\\ \\char 61 CIRTH_31\n\\** b **\\ \\char 62 CIRTH_50\n\\** c **\\ \\char 63 CIRTH_48\n\\** d **\\ \\char 64 CIRTH_33\n\\** e **\\ \\char 65 CIRTH_18\n\\** f **\\ \\char 66 CIRTH_34\n\\** g **\\ \\char 67 CIRTH_35\n\\** h **\\ \\char 68 CIRTH_36\n\\** i **\\ \\char 69 CIRTH_23\n\\** j **\\ \\char 6a CIRTH_37\n\\** k **\\ \\char 6b CIRTH_38\n\\** l **\\ \\char 6c CIRTH_39\n\\** m **\\ \\char 6d CIRTH_52\n\\** n **\\ \\char 6e CIRTH_51\n\\** o **\\ \\char 6f CIRTH_24\n\\** p **\\ \\char 70 CIRTH_25\n\\** q **\\ \\char 71 CIRTH_16\n\\** r **\\ \\char 72 CIRTH_19\n\\** s **\\ \\char 73 CIRTH_32\n\\** t **\\ \\char 74 CIRTH_20\n\\** u **\\ \\char 75 CIRTH_22\n\\** v **\\ \\char 76 CIRTH_49\n\\** w **\\ \\char 77 CIRTH_17\n\\** x **\\ \\char 78 CIRTH_47\n\\** y **\\ \\char 79 CIRTH_21\n\\** z **\\ \\char 7a CIRTH_46\n\\** { **\\ \\char 7b CIRTH_PUNCT_THREE_DOTS_L\n\\** | **\\ \\char 7c CIRTH_PUNCT_DOUBLE_VBAR\n\\** } **\\ \\char 7d CIRTH_PUNCT_FOUR_DOTS\n\\** ~ **\\ \\char 7e ?\n\\**  **\\ \\char 80 ?\n\\**   **\\ \\char a0 ?\n\\** ¤ **\\ \\char a4 ?\n\\** § **\\ \\char a7 ?\n\\** © **\\ \\char a9 ?\n\\** « **\\ \\char ab ?\n\\** ® **\\ \\char ae ?\n\\** ¶ **\\ \\char b6 ?\n\\** » **\\ \\char bb ?\n\\** ¼ **\\ \\char bc ?\n\\** ½ **\\ \\char bd ?\n\\** ¾ **\\ \\char be ?\n\\** ¿ **\\ \\char bf ?\n\\** À **\\ \\char c0 ?\n\\** Á **\\ \\char c1 ?\n\\** Â **\\ \\char c2 ?\n\\** Ã **\\ \\char c3 ?\n\\** Ä **\\ \\char c4 ?\n\\** Å **\\ \\char c5 ?\n\\** Æ **\\ \\char c6 ?\n\\** Ç **\\ \\char c7 ?\n\\** È **\\ \\char c8 ?\n\\** É **\\ \\char c9 ?\n\\** Ê **\\ \\char ca ?\n\\** Ë **\\ \\char cb ?\n\\** Ì **\\ \\char cc ?\n\\** Í **\\ \\char cd ?\n\\** Î **\\ \\char ce ?\n\\** Ï **\\ \\char cf ?\n\\** Ð **\\ \\char d0 ?\n\\** Ñ **\\ \\char d1 ?\n\\** Ò **\\ \\char d2 ?\n\\** Ó **\\ \\char d3 ?\n\\** Ô **\\ \\char d4 ?\n\\** Õ **\\ \\char d5 ?\n\\** Ö **\\ \\char d6 ?\n\\** × **\\ \\char d7 ?\n\\** Ø **\\ \\char d8 ?\n\\** Ù **\\ \\char d9 ?\n\\** Ú **\\ \\char da ?\n\\** Û **\\ \\char db ?\n\\** Ü **\\ \\char dc ?\n\\** Ý **\\ \\char dd ?\n\\** Þ **\\ \\char de ?\n\\** ß **\\ \\char df ?\n\\** à **\\ \\char e0 ?\n\\** á **\\ \\char e1 ?\n\\** â **\\ \\char e2 ?\n\\** ã **\\ \\char e3 ?\n\\** ä **\\ \\char e4 ?\n\\** å **\\ \\char e5 ?\n\\** æ **\\ \\char e6 ?\n\\** ç **\\ \\char e7 ?\n\\** è **\\ \\char e8 ?\n\\** é **\\ \\char e9 ?\n\\** ê **\\ \\char ea ?\n\\** ë **\\ \\char eb ?\n\\** ì **\\ \\char ec ?\n\\** í **\\ \\char ed ?\n\\** î **\\ \\char ee ?\n\\** ï **\\ \\char ef ?\n\\** ð **\\ \\char f0 ?\n\\** ñ **\\ \\char f1 ?\n\\** ò **\\ \\char f2 ?\n\\** ó **\\ \\char f3 ?\n\\** ô **\\ \\char f4 ?\n\\** õ **\\ \\char f5 ?\n\\** ö **\\ \\char f6 ?\n\\** ÷ **\\ \\char f7 ?\n\\** ø **\\ \\char f8 ?\n\\** ù **\\ \\char f9 ?\n\\** ú **\\ \\char fa ?\n\\** û **\\ \\char fb ?\n\\** ü **\\ \\char fc ?\n\\** ý **\\ \\char fd ?\n\\** þ **\\ \\char fe ?\n\\** ÿ **\\ \\char ff ?\n\\** ‘ **\\ \\char 2018 ?\n\\** • **\\ \\char 2022 ?\n\\** … **\\ \\char 2026 ?\n\\** ‹ **\\ \\char 2039 ?\n\\** › **\\ \\char 203a ?\n\\** ∙ **\\ \\char 2219 ?\n\\** ◼ **\\ \\char 25fc ?\n\n"
Glaemscribe.resource_manager.raw_charsets["sarati_eldamar"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\**   **\\ \\char 20 ?\n\\** ! **\\ \\char 21 SARATI_SPACE\n\\** \" **\\ \\char 22 SARATI_T\n\\** # **\\ \\char 23 SARATI_QUENYA_C\n\\** $ **\\ \\char 24 ?\n\\** % **\\ \\char 25 SARATI_D\n\\** & **\\ \\char 26 SARATI_NG\n\\** \' **\\ \\char 27 SARATI_PHONETIC_GW\n\\** ( **\\ \\char 28 ?\n\\** ) **\\ \\char 29 ?\n\\** * **\\ \\char 2a ?\n\\** + **\\ \\char 2b SARATI_QUENYA_VELAR_NASAL\n\\** , **\\ \\char 2c SARATI_QUENYA_NW\n\\** - **\\ \\char 2d ?\n\\** . **\\ \\char 2e ?\n\\** / **\\ \\char 2f ?\n\\** 0 **\\ \\char 30 ?\n\\** 1 **\\ \\char 31 ?\n\\** 2 **\\ \\char 32 ?\n\\** 3 **\\ \\char 33 ?\n\\** 4 **\\ \\char 34 ?\n\\** 5 **\\ \\char 35 ?\n\\** 6 **\\ \\char 36 ?\n\\** 7 **\\ \\char 37 ?\n\\** 8 **\\ \\char 38 ?\n\\** 9 **\\ \\char 39 ?\n\\** : **\\ \\char 3a ?\n\\** ; **\\ \\char 3b ?\n\\** < **\\ \\char 3c ?\n\\** = **\\ \\char 3d ?\n\\** > **\\ \\char 3e ?\n\\** ? **\\ \\char 3f SARATI_L\n\\** @ **\\ \\char 40 ?\n\\** A **\\ \\char 41 SARATI_QUENYA_HL\n\\** B **\\ \\char 42 ?\n\\** C **\\ \\char 43 ?\n\\** D **\\ \\char 44 ?\n\\** E **\\ \\char 45 ?\n\\** F **\\ \\char 46 SARATI_R\n\\** G **\\ \\char 47 ?\n\\** H **\\ \\char 48 ?\n\\** I **\\ \\char 49 ?\n\\** J **\\ \\char 4a SARATI_QUENYA_HR\n\\** K **\\ \\char 4b ?\n\\** L **\\ \\char 4c ?\n\\** M **\\ \\char 4d ?\n\\** N **\\ \\char 4e ?\n\\** O **\\ \\char 4f ?\n\\** P **\\ \\char 50 SARATI_M\n\\** Q **\\ \\char 51 ?\n\\** R **\\ \\char 52 ?\n\\** S **\\ \\char 53 ?\n\\** T **\\ \\char 54 ?\n\\** U **\\ \\char 55 ?\n\\** V **\\ \\char 56 ?\n\\** W **\\ \\char 57 ?\n\\** X **\\ \\char 58 ?\n\\** Y **\\ \\char 59 ?\n\\** Z **\\ \\char 5a SARATI_P\n\\** [ **\\ \\char 5b SARATI_F\n\\** \\ **\\ \\char 5c SARATI_QUENYA_F_ALT\n\\** ] **\\ \\char 5d ?\n\\** ^ **\\ \\char 5e ?\n\\** _ **\\ \\char 5f SARATI_B SARATI_QUENYA_MB\n\\** ` **\\ \\char 60 SARATI_V\n\\** a **\\ \\char 61 SARATI_QUENYA_V_ALT\n\\** b **\\ \\char 62 ?\n\\** c **\\ \\char 63 ?\n\\** d **\\ \\char 64 SARATI_QUENYA_MP SARATI_QUENYA_QU_ALT\n\\** e **\\ \\char 65 ?\n\\** f **\\ \\char 66 ?\n\\** g **\\ \\char 67 SARATI_QUENYA_TS\n\\** h **\\ \\char 68 ?\n\\** i **\\ \\char 69 ?\n\\** j **\\ \\char 6a ?\n\\** k **\\ \\char 6b ?\n\\** l **\\ \\char 6c ?\n\\** m **\\ \\char 6d ?\n\\** n **\\ \\char 6e SARATI_VOICELESS_VELAR_FRICATIVE\n\\** o **\\ \\char 6f ?\n\\** p **\\ \\char 70 SARATI_QUENYA_QU\n\\** q **\\ \\char 71 SARATI_VOICED_VELAR_FRICATIVE\n\\** r **\\ \\char 72 ?\n\\** s **\\ \\char 73 SARATI_QUENYA_NGW\n\\** t **\\ \\char 74 ?\n\\** u **\\ \\char 75 ?\n\\** v **\\ \\char 76 SARATI_QUENYA_ST\n\\** w **\\ \\char 77 ?\n\\** x **\\ \\char 78 ?\n\\** y **\\ \\char 79 SARATI_QUENYA_X SARATI_VELAR_LATERAL_APPROXIMANT\n\\** z **\\ \\char 7a SARATI_UVULAR_TRILL\n\\** { **\\ \\char 7b ?\n\\** | **\\ \\char 7c ?\n\\** } **\\ \\char 7d ?\n\\** ~ **\\ \\char 7e ?\n\\**   **\\ \\char a0 ?\n\\** ¡ **\\ \\char a1 ?\n\\** ¢ **\\ \\char a2 SARATI_VOICELESS_PALATO_ALVEOLAR_SIBILANT_FRICATIVE\n\\** £ **\\ \\char a3 ?\n\\** ¤ **\\ \\char a4 ?\n\\** ¥ **\\ \\char a5 ?\n\\** ¦ **\\ \\char a6 SARATI_QUENYA_SS_ALT_1\n\\** § **\\ \\char a7 ?\n\\** ¨ **\\ \\char a8 ?\n\\** © **\\ \\char a9 ?\n\\** ª **\\ \\char aa SARATI_QUENYA_NT\n\\** « **\\ \\char ab SARATI_VOICED_DENTAL_FRICATIVE\n\\** ¬ **\\ \\char ac ?\n\\** ­ **\\ \\char ad ?\n\\** ® **\\ \\char ae ?\n\\** ¯ **\\ \\char af ?\n\\** ° **\\ \\char b0 ?\n\\** ± **\\ \\char b1 SARATI_QUENYA_TY\n\\** ² **\\ \\char b2 SARATI_QUENYA_HT_ALT_1\n\\** ³ **\\ \\char b3 SARATI_QUENYA_NDY\n\\** ´ **\\ \\char b4 ?\n\\** µ **\\ \\char b5 ?\n\\** ¶ **\\ \\char b6 ?\n\\** · **\\ \\char b7 ?\n\\** ¸ **\\ \\char b8 ?\n\\** ¹ **\\ \\char b9 SARATI_W\n\\** º **\\ \\char ba SARATI_QUENYA_HW SARATI_VOICELESS_LABIOVELAR_APPROXIMANT\n\\** » **\\ \\char bb SARATI_QUENYA_Y SARATI_J\n\\** ¼ **\\ \\char bc ?\n\\** ½ **\\ \\char bd SARATI_QUENYA_HY SARATI_VOICELESS_PALATAL_APPROXIMANT\n\\** ¾ **\\ \\char be ?\n\\** ¿ **\\ \\char bf ?\n\\** À **\\ \\char c0 SARATI_N\n\\** Á **\\ \\char c1 ?\n\\** Â **\\ \\char c2 ?\n\\** Ã **\\ \\char c3 ?\n\\** Ä **\\ \\char c4 ?\n\\** Å **\\ \\char c5 ?\n\\** Æ **\\ \\char c6 ?\n\\** Ç **\\ \\char c7 ?\n\\** È **\\ \\char c8 SARATI_QUENYA_LONG_VOWEL_CARRIER\n\\** É **\\ \\char c9 ?\n\\** Ê **\\ \\char ca ?\n\\** Ë **\\ \\char cb SARATI_H\n\\** Ì **\\ \\char cc ?\n\\** Í **\\ \\char cd PUNCT_DOT\n\\** Î **\\ \\char ce PUNCT_2_DOT\n\\** Ï **\\ \\char cf PUNCT_TRI\n\\** Ð **\\ \\char d0 PUNCT_2_TRI\n\\** Ñ **\\ \\char d1 ?\n\\** Ò **\\ \\char d2 SARATI_DOT_U SARATI_QUENYA_I\n\\** Ó **\\ \\char d3 SARATI_DOT_D\n\\** Ô **\\ \\char d4 ?\n\\** Õ **\\ \\char d5 ?\n\\** Ö **\\ \\char d6 SARATI_QUENYA_A\n\\** × **\\ \\char d7 ?\n\\** Ø **\\ \\char d8 SARATI_QUENYA_A_REVERSED\n\\** Ù **\\ \\char d9 ?\n\\** Ú **\\ \\char da ?\n\\** Û **\\ \\char db ?\n\\** Ü **\\ \\char dc SARATI_QUENYA_O\n\\** Ý **\\ \\char dd ?\n\\** Þ **\\ \\char de SARATI_QUENYA_U\n\\** ß **\\ \\char df ?\n\\** à **\\ \\char e0 ?\n\\** á **\\ \\char e1 ?\n\\** â **\\ \\char e2 ?\n\\** ã **\\ \\char e3 ?\n\\** ä **\\ \\char e4 ?\n\\** å **\\ \\char e5 ?\n\\** æ **\\ \\char e6 ?\n\\** ç **\\ \\char e7 ?\n\\** è **\\ \\char e8 SARATI_QUENYA_E\n\\** é **\\ \\char e9 ?\n\\** ê **\\ \\char ea ?\n\\** ë **\\ \\char eb ?\n\\** ì **\\ \\char ec ?\n\\** í **\\ \\char ed ?\n\\** î **\\ \\char ee ?\n\\** ï **\\ \\char ef ?\n\\** ð **\\ \\char f0 SARATI_DIACRITIC_CIRCLE\n\\** ñ **\\ \\char f1 ?\n\\** ò **\\ \\char f2 SARATI_DASH_U\n\\** ó **\\ \\char f3 SARATI_DASH_D\n\\** ô **\\ \\char f4 ?\n\\** õ **\\ \\char f5 ?\n\\** ö **\\ \\char f6 ?\n\\** ÷ **\\ \\char f7 ?\n\\** ø **\\ \\char f8 ?\n\\** ù **\\ \\char f9 ?\n\\** ú **\\ \\char fa ?\n\\** û **\\ \\char fb ?\n\\** ü **\\ \\char fc ?\n\\** ý **\\ \\char fd ?\n\\** þ **\\ \\char fe ?\n\\** ÿ **\\ \\char ff ?\n\\** Ā **\\ \\char 100 ?\n\\** ā **\\ \\char 101 ?\n\\** Ă **\\ \\char 102 ?\n\\** Đ **\\ \\char 110 ?\n\\** đ **\\ \\char 111 ?\n\\** Ġ **\\ \\char 120 ?\n\\** ġ **\\ \\char 121 ?\n\\** Ģ **\\ \\char 122 ?\n\\** ģ **\\ \\char 123 ?\n\\** Ĥ **\\ \\char 124 ?\n\\** İ **\\ \\char 130 ?\n\\** ı **\\ \\char 131 ?\n\\** ŀ **\\ \\char 140 ?\n\\** Œ **\\ \\char 152 SARATI_QUENYA_HTY\n\\** œ **\\ \\char 153 ?\n\\** Š **\\ \\char 160 ?\n\\** š **\\ \\char 161 ?\n\\** Ÿ **\\ \\char 178 SARATI_QUENYA_S\n\\** Ž **\\ \\char 17d ?\n\\** ž **\\ \\char 17e ?\n\\** ƒ **\\ \\char 192 ?\n\\** ˆ **\\ \\char 2c6 ?\n\\** ˜ **\\ \\char 2dc SARATI_QUENYA_NQU\n\\** – **\\ \\char 2013 ?\n\\** — **\\ \\char 2014 SARATI_QUENYA_NC\n\\** ‘ **\\ \\char 2018 ?\n\\** ’ **\\ \\char 2019 ?\n\\** ‚ **\\ \\char 201a ?\n\\** “ **\\ \\char 201c ?\n\\** ” **\\ \\char 201d ?\n\\** „ **\\ \\char 201e SARATI_QUENYA_NTY\n\\** † **\\ \\char 2020 ?\n\\** ‡ **\\ \\char 2021 ?\n\\** • **\\ \\char 2022 ?\n\\** … **\\ \\char 2026 SARATI_QUENYA_STY\n\\** ‰ **\\ \\char 2030 SARATI_QUENYA_NY\n\\** ‹ **\\ \\char 2039 ?\n\\** › **\\ \\char 203a ?\n\\** € **\\ \\char 20ac SARATI_QUENYA_ND\n\\** ™ **\\ \\char 2122 ?\n\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_ds_annatar"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset specially customized for Tengwar Annatar (Glaemscrafu patched version) **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.5\" \"Added VALA_W_HOOK, VAIYA. Moved A_TEHTA_INV_L due to soft hyphen bug.\"\n  \\entry \"0.0.6\" \"Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara. / Added pustar combinations (4/4-halfed/4-squared/5)\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"\n\\end\n\n\\**   **\\ \\char 20 SPACE              \n\\** ! **\\ \\char 21 TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT                   \n\\** \" **\\ \\char 22 DASH_INF_L            \n\\** # **\\ \\char 23 A_TEHTA_XL          \n\\** $ **\\ \\char 24 E_TEHTA_XL   \n\\** % **\\ \\char 25 I_TEHTA_XL     \n\\** & **\\ \\char 26 U_TEHTA_XL        \n\\** \' **\\ \\char 27 DASH_INF_S            \n\\** ( **\\ \\char 28 ?                \n\\** ) **\\ \\char 29 TILD_XSUP_L           \n\\** * **\\ \\char 2a ?                \n\\** + **\\ \\char 2b SHOOK_RIGHT_L          \n\\** , **\\ \\char 2c TW_84 ESSE_NUQUERNA       \n\\** - **\\ \\char 2d PUNCT_DDOT            \n\\** . **\\ \\char 2e TW_94 URE            \n\\** / **\\ \\char 2f TILD_XINF_S           \n\\** 0 **\\ \\char 30 TILD_XSUP_S           \n\\** 1 **\\ \\char 31 TW_11 TINCO           \n\\** 2 **\\ \\char 32 TW_21 ANDO           \n\\** 3 **\\ \\char 33 TW_31 SULE THULE        \n\\** 4 **\\ \\char 34 TW_41 ANTO           \n\\** 5 **\\ \\char 35 TW_51 NUMEN           \n\\** 6 **\\ \\char 36 TW_61 ORE            \n\\** 7 **\\ \\char 37 TW_71 ROMEN           \n\\** 8 **\\ \\char 38 TW_81 SILME           \n\\** 9 **\\ \\char 39 TW_91 HYARMEN          \n\\** : **\\ \\char 3a TILD_INF_L            \n\\** ; **\\ \\char 3b TILD_INF_S            \n\\** < **\\ \\char 3c ?  \\** Does not look compliant between DS and Annatar **\\\n\\** = **\\ \\char 3d PUNCT_DOT            \n\\** > **\\ \\char 3e ?                \n\\** ? **\\ \\char 3f TILD_XINF_L           \n\\** @ **\\ \\char 40 TW_EXT_21 ANDO_EXT ANTO_EXT            \n\\** A **\\ \\char 41 TW_EXT_13 CALMA_EXT AHA_EXT            \n\\** B **\\ \\char 42 I_TEHTA_XS     \n\\** C **\\ \\char 43 A_TEHTA_XS          \n\\** D **\\ \\char 44 A_TEHTA_S           \n\\** E **\\ \\char 45 A_TEHTA_L           \n\\** F **\\ \\char 46 E_TEHTA_S    \n\\** G **\\ \\char 47 I_TEHTA_S           \n\\** H **\\ \\char 48 O_TEHTA_S           \n\\** I **\\ \\char 49 SILME_NUQUERNA_ALT \\** Used for y in s. beleriand **\\                \n\\** J **\\ \\char 4a U_TEHTA_S         \n\\** K **\\ \\char 4b ?                \n\\** L **\\ \\char 4c LAMBE_MARK_DOT                \n\\** M **\\ \\char 4d U_TEHTA_XS        \n\\** N **\\ \\char 4e O_TEHTA_XS          \n\\** O **\\ \\char 4f ?                \n\\** P **\\ \\char 50 TILD_SUP_L            \n\\** Q **\\ \\char 51 TW_EXT_12 PARMA_EXT FORMEN_EXT            \n\\** R **\\ \\char 52 E_TEHTA_L          \n\\** S **\\ \\char 53 TW_EXT_23 ANGA_EXT ANCA_EXT            \n\\** T **\\ \\char 54 I_TEHTA_L           \n\\** U **\\ \\char 55 U_TEHTA_L         \n\\** V **\\ \\char 56 E_TEHTA_XS         \n\\** W **\\ \\char 57 TW_EXT_22 UMBAR_EXT AMPA_EXT            \n\\** X **\\ \\char 58 TW_EXT_24 UNQUE_EXT UNGWE_EXT            \n\\** Y **\\ \\char 59 O_TEHTA_L           \n\\** Z **\\ \\char 5a TW_EXT_14 QUESSE_EXT HWESTA_EXT            \n\\** [ **\\ \\char 5b DASH_SUP_S            \n\\** \\ **\\ \\char 5c TILD_L              \n\\** ] **\\ \\char 5d OSSE               \n\\** ^ **\\ \\char 5e O_TEHTA_XL          \n\\** _ **\\ \\char 5f SHOOOK_RIGHT_S          \n\\** ` **\\ \\char 60 TELCO              \n\\** a **\\ \\char 61 TW_13 CALMA          \n\\** b **\\ \\char 62 TW_54 NWALME          \n\\** c **\\ \\char 63 TW_34 HWESTA          \n\\** d **\\ \\char 64 TW_33 AHA           \n\\** e **\\ \\char 65 TW_32 FORMEN          \n\\** f **\\ \\char 66 TW_43 ANCA           \n\\** g **\\ \\char 67 TW_53 NOLDO          \n\\** h **\\ \\char 68 TW_63 ANNA           \n\\** i **\\ \\char 69 TW_82 SILME_NUQUERNA      \n\\** j **\\ \\char 6a TW_73 LAMBE_NO_LIG          \n\\** k **\\ \\char 6b TW_83 ESSE           \n\\** l **\\ \\char 6c TW_93 YANTA          \n\\** m **\\ \\char 6d TW_74 ALDA           \n\\** n **\\ \\char 6e TW_64 VILYA          \n\\** o **\\ \\char 6f TW_92 HWESTA_SINDARINWA    \n\\** p **\\ \\char 70 TILD_SUP_S           \n\\** q **\\ \\char 71 TW_12 PARMA          \n\\** r **\\ \\char 72 TW_42 AMPA           \n\\** s **\\ \\char 73 TW_23 ANGA           \n\\** t **\\ \\char 74 TW_52 MALTA          \n\\** u **\\ \\char 75 TW_72 ARDA           \n\\** v **\\ \\char 76 TW_44 UNQUE          \n\\** w **\\ \\char 77 TW_22 UMBAR          \n\\** x **\\ \\char 78 TW_24 UNGWE          \n\\** y **\\ \\char 79 TW_62 VALA           \n\\** z **\\ \\char 7a TW_14 QUESSE          \n\\** { **\\ \\char 7b DASH_SUP_L           \n\\** | **\\ \\char 7c SHOOK_LEFT_L          \n\\** } **\\ \\char 7d SHOOK_LEFT_S          \n\\** ~ **\\ \\char 7e ARA               \n\\char a0 NBSP\n\\** ¡ **\\ \\char a1 ?                \n\\** ¢ **\\ \\char a2 ?                \n\\** £ **\\ \\char a3 SHOOK_BEAUTIFUL                \n\\** ¥ **\\ \\char a5 ?                \n\\** ¦ **\\ \\char a6 HWESTA_TINCO                \n\\** § **\\ \\char a7 AHA_TINCO                \n\\** ¨ **\\ \\char a8 TH_SUB_CIRC_S          \n\\** © **\\ \\char a9 TH_SUB_CIRC_XS          \n\\** ª **\\ \\char aa A_TEHTA_INV_XL        \n\\** « **\\ \\char ab DQUOT_OPEN            \n\\** ¬ **\\ \\char ac PUNCT_DTILD              \n     \n\\** ® **\\ \\char ae ?                \n\\** ¯ **\\ \\char af A_TEHTA_INV_S         \n\\** ° **\\ \\char b0 LAMBE_MARK_TILD              \n\\** ± **\\ \\char b1 SQUOT_OPEN            \n\\** ² **\\ \\char b2 SQUOT_CLOSE           \n\\** ³ **\\ \\char b3 ?                \n\\** ´ **\\ \\char b4 LAMBE_MARK_DDOT         \n\\** µ **\\ \\char b5 A_TEHTA_INV_XS        \n\\** · **\\ \\char b7 ?                \n\\** ¸ **\\ \\char b8 LAMBE_MARK_DASH         \n\\** ¹ **\\ \\char b9 ?                \n\\** º **\\ \\char ba ?                \n\\** » **\\ \\char bb DQUOT_CLOSE           \n\\** ¼ **\\ \\char bc LIGATING_SHORT_CARRIER                \n\\** ½ **\\ \\char bd HALLA              \n\\** ¾ **\\ \\char be ?                \n\\** ¿ **\\ \\char bf ?                \n\\** À **\\ \\char c0 PUNCT_INTERR           \n\\** Á **\\ \\char c1 PUNCT_EXCLAM           \n\\** Â **\\ \\char c2 PUNCT_TILD            \n\\** Ã **\\ \\char c3 ?                \n\\** Ä **\\ \\char c4 ?                \n\\** Å **\\ \\char c5 ?                \n\\** Æ **\\ \\char c6 ?                \n\\** Ç **\\ \\char c7 ?                \n\\** È **\\ \\char c8 THINF_DOT_XL           \n\\** É **\\ \\char c9 THINF_DOT_L           \n\\** Ê **\\ \\char ca THINF_DOT_S           \n\\** Ë **\\ \\char cb THINF_DOT_XS           \n\\** Ì **\\ \\char cc THINF_DDOT_XL          \n\\** Í **\\ \\char cd THINF_DDOT_L           \n\\** Î **\\ \\char ce THINF_DDOT_S           \n\\** Ï **\\ \\char cf THINF_DDOT_XS          \n\\** Ð **\\ \\char d0 THINF_TDOT_XL          \n\\** Ñ **\\ \\char d1 THINF_TDOT_L           \n\\** Ò **\\ \\char d2 THINF_TDOT_S           \n\\** Ó **\\ \\char d3 THINF_TDOT_XS          \n\\** Ô **\\ \\char d4 THSUP_DDOT_XL Y_TEHTA_XL I_TEHTA_DOUBLE_XL         \n\\** Õ **\\ \\char d5 THSUP_DDOT_L Y_TEHTA_L I_TEHTA_DOUBLE_L       \n\\** Ö **\\ \\char d6 THSUP_DDOT_S Y_TEHTA_S I_TEHTA_DOUBLE_S          \n\\** × **\\ \\char d7 THSUP_DDOT_XS Y_TEHTA_XS I_TEHTA_DOUBLE_XS         \n\\** Ø **\\ \\char d8 THSUP_TICK_XL          \n\\** Ù **\\ \\char d9 THSUP_TICK_L           \n\\** Ú **\\ \\char da THSUP_TICK_S           \n\\** Û **\\ \\char db THSUP_TICK_XS          \n\\** Ü **\\ \\char dc THSUP_TICK_INV_XL A_TEHTA_CIRCUM_XL       \n\\** Ý **\\ \\char dd THSUP_TICK_INV_L A_TEHTA_CIRCUM_L        \n\\** Þ **\\ \\char de THSUP_TICK_INV_S A_TEHTA_CIRCUM_S         \n\\** ß **\\ \\char df THSUP_TICK_INV_XS A_TEHTA_CIRCUM_XS       \n\\** à **\\ \\char e0 THSUP_LAMBDA_XL         \n\\** á **\\ \\char e1 THSUP_LAMBDA_L          \n\\** â **\\ \\char e2 THSUP_LAMBDA_S          \n\\** ã **\\ \\char e3 THSUP_LAMBDA_XS         \n\\** ä **\\ \\char e4 THINF_CURL_XL          \n\\** å **\\ \\char e5 THINF_CURL_L           \n\\** æ **\\ \\char e6 THINF_CURL_S           \n\\** ç **\\ \\char e7 THINF_CURL_XS          \n\\** è **\\ \\char e8 SEV_TEHTA_XL           \n\\** é **\\ \\char e9 SEV_TEHTA_L           \n\\** ê **\\ \\char ea SEV_TEHTA_S           \n\\** ë **\\ \\char eb SEV_TEHTA_XS           \n\\** ì **\\ \\char ec ?                                 \n\\** í **\\ \\char ed ?                                 \n\\** î **\\ \\char ee ?                                 \n\\** ï **\\ \\char ef ?                                 \n\\** ð **\\ \\char f0 NUM_0                               \n\\** ñ **\\ \\char f1 NUM_1                               \n\\** ò **\\ \\char f2 NUM_2                               \n\\** ó **\\ \\char f3 NUM_3                               \n\\** ô **\\ \\char f4 NUM_4                               \n\\** õ **\\ \\char f5 NUM_5                               \n\\** ö **\\ \\char f6 NUM_6                               \n\\** ÷ **\\ \\char f7 NUM_7                               \n\\** ø **\\ \\char f8 NUM_8                               \n\\** ù **\\ \\char f9 NUM_9                               \n\\** ú **\\ \\char fa NUM_10                               \n\\** û **\\ \\char fb NUM_11                               \n\\** ü **\\ \\char fc THINF_STROKE_XL                                 \n\\** ý **\\ \\char fd THINF_STROKE_L                                 \n\\** þ **\\ \\char fe THINF_STROKE_S                                 \n\\** ÿ **\\ \\char ff THINF_STROKE_XS                      \n\n\\** FIX FOR SOFT HYPHEN **\\\n\\char 109 A_TEHTA_INV_L\n\n\\** USING TENGWAR ELFICA POS TO AVOID PROBLEMS **\\\n\\char 125 VAIA WAIA VAIYA\n\n\n\\char 200 DASH_INF_XS\n\\char 201 TILD_INF_XS\n\\char 202 DASH_SUP_XS\n\\char 203 TILD_SUP_XS\n\n\n           \n\\** Œ **\\ \\char 152 PUNCT_PAREN_L                           \n\\** œ **\\ \\char 153 PUNCT_PAREN_R                           \n\\** Š **\\ \\char 160 THINF_ACCENT_L                                 \n\\** š **\\ \\char 161 MALTA_W_HOOK TW_MH                                 \n\\** Ÿ **\\ \\char 178 THINF_ACCENT_XS         \n\n\\char 181 PUSTA_4\n\\char 182 PUSTA_5\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n                        \n\\** ˆ **\\ \\char 2c6 PUNCT_TDOT PUSTA_3                               \n\\** ˜ **\\ \\char 2dc TH_SUB_CIRC_XL                                 \n\\** – **\\ \\char 2013 ANCA_CLOSED SILME_AHA                               \n\\** — **\\ \\char 2014 OLD_ENGLISH_AND                                \n\\** ‘ **\\ \\char 2018 THINF_CURL_INV_XL                                \n\\** ’ **\\ \\char 2019 THINF_CURL_INV_L                                \n                          \n\\** “ **\\ \\char 201c THINF_CURL_INV_S                                \n\\** ” **\\ \\char 201d THINF_CURL_INV_XS                                \n\\** ‡ **\\ \\char 2021 ?                                \n\\** • **\\ \\char 2022 TW_HW_LOWDHAM HARP_SHAPED                                \n\\** ‰ **\\ \\char 2030 THINF_ACCENT_XL                                \n\\** ‹ **\\ \\char 2039 THINF_ACCENT_S                                \n\\** › **\\ \\char 203a BOOKMARK_SIGN                                \n\\** ™ **\\ \\char 2122 TH_SUB_CIRC_L              \n\n\n\n\n\\char 192 E_TEHTA_GRAVE_XL                                 \n\\char 201e E_TEHTA_GRAVE_L                                \n\\char 2020 E_TEHTA_GRAVE_XS                                \n\\char 2026 E_TEHTA_GRAVE_S                 \n\n\\char 3178   THINF_DSTROKE_XS    \n\\char 5039   THINF_DSTROKE_S\n\\char 3160  THINF_DSTROKE_L\n\\char 5030  THINF_DSTROKE_XL\n\\char 501A   LAMBE_MARK_DSTROKE\n               \n\n\n                  \n\\** 〠 **\\ \\char 3020 ?                                \n\\** 〡 **\\ \\char 3021 ?                                \n\\** 〣 **\\ \\char 3023 A_TEHTA_DOUBLE_XL                                \n\\** 〤 **\\ \\char 3024 E_TEHTA_DOUBLE_XL                                \n\\** 〦 **\\ \\char 3026 U_TEHTA_DOUBLE_XL                                \n\n            \n\\** 〰 **\\ \\char 3030 ?                                \n\\** 〱 **\\ \\char 3031 ?                                \n\\** 〲 **\\ \\char 3032 ?                                \n\\** 〳 **\\ \\char 3033 ?                                \n\\** 〴 **\\ \\char 3034 ?                                \n\\** 〵 **\\ \\char 3035 ?                                \n\\** 〶 **\\ \\char 3036 ?                                \n\\** 〷 **\\ \\char 3037 ?                                \n\\** 〸 **\\ \\char 3038 ?                                \n\\** 〹 **\\ \\char 3039 ?                                \n\\** 〼 **\\ \\char 303c ?                                \n\\** ぀ **\\ \\char 3040 ?                                \n\\** ぃ **\\ \\char 3043 A_TEHTA_DOUBLE_XS                                \n\\** い **\\ \\char 3044 A_TEHTA_DOUBLE_S                                \n\\** ぅ **\\ \\char 3045 A_TEHTA_DOUBLE_L                                \n\\** う **\\ \\char 3046 E_TEHTA_DOUBLE_XS                                \n\\** え **\\ \\char 3048 O_TEHTA_DOUBLE_S                                \n\\** お **\\ \\char 304a U_TEHTA_DOUBLE_S                                \n\\** き **\\ \\char 304d U_TEHTA_DOUBLE_XS                                \n\\** ぎ **\\ \\char 304e O_TEHTA_DOUBLE_XS                                \n\\** け **\\ \\char 3051 ?                                \n\\** げ **\\ \\char 3052 E_TEHTA_DOUBLE_L                                \n\\** さ **\\ \\char 3055 U_TEHTA_DOUBLE_L                                \n\\** ざ **\\ \\char 3056 E_TEHTA_DOUBLE_S                                \n\\** し **\\ \\char 3057 ?                                \n\\** す **\\ \\char 3059 O_TEHTA_DOUBLE_L                                \n\\** ぞ **\\ \\char 305e O_TEHTA_DOUBLE_XL                                \n\\** ぢ **\\ \\char 3062 ?                                \n\\** づ **\\ \\char 3065 ?                                \n\\** と **\\ \\char 3068 ?                                \n\\** な **\\ \\char 306a LAMBE_LIG                                \n\\** の **\\ \\char 306e ?                                \n\\** ぱ **\\ \\char 3071 ?                                \n\\** ひ **\\ \\char 3072 ?                                \n\\** ぴ **\\ \\char 3074 ?                                \n\\** ふ **\\ \\char 3075 ?                                \n\\** ぷ **\\ \\char 3077 ?                                \n\\** へ **\\ \\char 3078 ?                                \n\\** べ **\\ \\char 3079 ?                                \n\\** ぺ **\\ \\char 307a ?                                \n\\** ア **\\ \\char 30a2 ?                                \n\\** カ **\\ \\char 30ab RING_MARK_R                                \n\\** ギ **\\ \\char 30ae ?                                \n\\** セ **\\ \\char 30bb RING_MARK_L                                \n\\** タ **\\ \\char 30bf ?                                \n\\** ツ **\\ \\char 30c4 ?                                \n\\** テ **\\ \\char 30c6 ?                                \n\\** デ **\\ \\char 30c7 ?                                \n\\** ヘ **\\ \\char 30d8 ?                                \n\\** ベ **\\ \\char 30d9 ?                                \n\\** ペ **\\ \\char 30da ?                                \n\\** ホ **\\ \\char 30db ?                                \n\\** ム **\\ \\char 30e0 ?                                \n\\** メ **\\ \\char 30e1 ?                                \n\\** モ **\\ \\char 30e2 ?                                \n\\** ャ **\\ \\char 30e3 ?                                \n\\** ヨ **\\ \\char 30e8 ?                                \n\\** ラ **\\ \\char 30e9 ?                                \n\\** リ **\\ \\char 30ea ?                                \n\\** ル **\\ \\char 30eb ? \n\\** **\\ \\char 3152 PUNCT_PAREN_L_ALT                                \n\\** **\\ \\char 3153 PUNCT_PAREN_R_ALT                                                               \n\\** ㅠ **\\ \\char 3160 ?                                \n\n\\char 3161 VALA_W_HOOK TW_MH_BELERIANDIC\n                              \n\\** ㅸ **\\ \\char 3178 ?                                \n\\** ㆒ **\\ \\char 3192 ?                                \n\\** 倚 **\\ \\char 501a ?                                \n\\** 倞 **\\ \\char 501e ?                                \n\\** 倠 **\\ \\char 5020 ?                                \n\\** 倢 **\\ \\char 5022 ?                                \n\\** 倦 **\\ \\char 5026 ?                                \n\\** 倰 **\\ \\char 5030 ?                                \n\\** 倹 **\\ \\char 5039 ?\n\n\n\\** The following virtual chars are used to handle tehtar (& the like) multiple version chosing **\\\n\\** It could be avoided with modern fonts with gsub/gpos tables for ligatures and diacritics **\\\n\\** placement **\\\n\n\\** DUMPED FROM THE VIRTUAL CHARS TOOL **\\\n\n\n\n\\beg virtual A_TEHTA\n  \\class A_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class A_TEHTA_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class A_TEHTA_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class A_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM\n  \\class A_TEHTA_CIRCUM_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class A_TEHTA_CIRCUM_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class A_TEHTA_CIRCUM_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class A_TEHTA_CIRCUM_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_REVERSED\n  \\class A_TEHTA_INV_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class A_TEHTA_INV_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class A_TEHTA_INV_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class A_TEHTA_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM_REVERSED TEHTA_BREVE\n  \\class THSUP_TICK_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class THSUP_TICK_S CALMA QUESSE SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class THSUP_TICK_L TINCO PARMA AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class THSUP_TICK_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA\n  \\class E_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class E_TEHTA_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class E_TEHTA_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class E_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_GRAVE\n  \\class E_TEHTA_GRAVE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class E_TEHTA_GRAVE_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class E_TEHTA_GRAVE_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class E_TEHTA_GRAVE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual I_TEHTA\n  \\class I_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class I_TEHTA_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class I_TEHTA_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class I_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual O_TEHTA\n  \\class O_TEHTA_XS TELCO ARA HALLA HYARMEN URE OSSE SHOOK_BEAUTIFUL NUM_4 NUM_10 NUM_11\n  \\class O_TEHTA_S CALMA QUESSE SULE FORMEN AHA HWESTA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class O_TEHTA_L TINCO PARMA ORE VALA VAIA VALA_W_HOOK NUM_5\n  \\class O_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual U_TEHTA\n  \\class U_TEHTA_XS TELCO ARA HALLA HYARMEN URE OSSE SHOOK_BEAUTIFUL NUM_4 NUM_10 NUM_11\n  \\class U_TEHTA_S CALMA QUESSE SULE FORMEN AHA HWESTA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class U_TEHTA_L TINCO PARMA ORE VALA VAIA VALA_W_HOOK NUM_5\n  \\class U_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual SEV_TEHTA\n  \\class SEV_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class SEV_TEHTA_S CALMA QUESSE SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA_ALT URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class SEV_TEHTA_L TINCO PARMA AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class SEV_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_DOUBLE\n  \\class A_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class A_TEHTA_DOUBLE_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA_ALT URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class A_TEHTA_DOUBLE_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class A_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE\n  \\class E_TEHTA_DOUBLE_XS HYARMEN HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class E_TEHTA_DOUBLE_S TELCO ARA HALLA CALMA QUESSE SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA_ALT URE OSSE AHA_TINCO HWESTA_TINCO NUM_8\n  \\class E_TEHTA_DOUBLE_L TINCO PARMA AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class E_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual I_TEHTA_DOUBLE Y_TEHTA\n  \\class I_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class I_TEHTA_DOUBLE_S CALMA QUESSE SULE FORMEN ANNA TW_EXT_11 TW_EXT_12 SILME_NUQUERNA_ALT URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class I_TEHTA_DOUBLE_L TINCO PARMA AHA HWESTA ORE VALA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_5\n  \\class I_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_DOUBLE\n  \\class O_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN URE OSSE SHOOK_BEAUTIFUL NUM_4 NUM_10 NUM_11\n  \\class O_TEHTA_DOUBLE_S CALMA QUESSE SULE FORMEN AHA HWESTA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA HWESTA_SINDARINWA YANTA VAIA HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class O_TEHTA_DOUBLE_L TINCO PARMA ORE VALA VALA_W_HOOK NUM_5\n  \\class O_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA ESSE MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_DOUBLE\n  \\class U_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN URE OSSE SHOOK_BEAUTIFUL NUM_4 NUM_10 NUM_11\n  \\class U_TEHTA_DOUBLE_S CALMA QUESSE SULE FORMEN AHA HWESTA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA HWESTA_SINDARINWA YANTA VAIA HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class U_TEHTA_DOUBLE_L TINCO PARMA ORE VALA VALA_W_HOOK NUM_5\n  \\class U_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA ESSE MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_INF\n  \\class THINF_TDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class THINF_TDOT_S TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 SILME HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class THINF_TDOT_L CALMA QUESSE TW_EXT_13 TW_EXT_14 ESSE ESSE_NUQUERNA VALA_W_HOOK NUM_5\n  \\class THINF_TDOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_INF\n  \\class THINF_ACCENT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_4\n  \\class THINF_ACCENT_S TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 SILME HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA AHA_TINCO HWESTA_TINCO\n  \\class THINF_ACCENT_L CALMA QUESSE TW_EXT_13 TW_EXT_14 ESSE ESSE_NUQUERNA VALA_W_HOOK NUM_0 NUM_1 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_ACCENT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_9\n\\end\n\n\\beg virtual CIRC_TEHTA_INF\n  \\class TH_SUB_CIRC_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class TH_SUB_CIRC_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 SILME ESSE HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TH_SUB_CIRC_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT ESSE_NUQUERNA VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_5 NUM_9\n  \\class TH_SUB_CIRC_XL TW_EXT_24 MALTA_W_HOOK NUM_3\n\\end\n\n\\beg virtual THINNAS SEV_TEHTA_INF THINF_STROKE\n  \\class THINF_STROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_5\n  \\class THINF_STROKE_S TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 SILME HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class THINF_STROKE_L CALMA QUESSE TW_EXT_13 TW_EXT_14 ESSE ESSE_NUQUERNA VALA_W_HOOK NUM_6 NUM_7 NUM_8\n  \\class THINF_STROKE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_INF\n  \\class THINF_CURL_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_5\n  \\class THINF_CURL_S TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 SILME HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class THINF_CURL_L CALMA QUESSE TW_EXT_13 TW_EXT_14 ESSE ESSE_NUQUERNA VALA_W_HOOK NUM_6 NUM_7 NUM_8\n  \\class THINF_CURL_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_INF\n  \\class THINF_CURL_INV_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_5\n  \\class THINF_CURL_INV_S TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 SILME HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class THINF_CURL_INV_L CALMA QUESSE TW_EXT_13 TW_EXT_14 ESSE ESSE_NUQUERNA VALA_W_HOOK NUM_6 NUM_7 NUM_8\n  \\class THINF_CURL_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n\\end\n\n\\beg virtual PALATAL_SIGN I_TEHTA_DOUBLE_INF Y_TEHTA_INF\n  \\class THINF_DDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED\n  \\class THINF_DDOT_S TINCO PARMA SULE FORMEN AHA HWESTA TW_EXT_11 TW_EXT_12 URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4\n  \\class THINF_DDOT_L CALMA QUESSE ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_6 NUM_8 NUM_10 NUM_11\n  \\class THINF_DDOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_9\n  \\class LAMBE_MARK_DDOT LAMBE LAMBE_LIG LAMBE_NO_LIG NUM_7\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n  \\class THINF_DSTROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_5\n  \\class THINF_DSTROKE_S TINCO PARMA SULE FORMEN AHA HWESTA TW_EXT_11 TW_EXT_12 URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4\n  \\class THINF_DSTROKE_L CALMA QUESSE ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_6 NUM_8 NUM_10 NUM_11\n  \\class THINF_DSTROKE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n  \\class LAMBE_MARK_DSTROKE LAMBE LAMBE_LIG LAMBE_NO_LIG NUM_7\n\\end\n\n\\beg virtual UNUTIXE I_TEHTA_INF NO_VOWEL_DOT\n  \\class THINF_DOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED NUM_5\n  \\class THINF_DOT_S TINCO PARMA SULE FORMEN AHA HWESTA TW_EXT_11 TW_EXT_12 URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7\n  \\class THINF_DOT_L CALMA QUESSE ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_6 NUM_8 NUM_10 NUM_11\n  \\class THINF_DOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME_NUQUERNA_ALT MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n  \\class LAMBE_MARK_DOT LAMBE LAMBE_LIG LAMBE_NO_LIG\n\\end\n\n\\beg virtual GEMINATE_SIGN\n  \\class DASH_INF_XS TELCO ARA HALLA\n  \\class DASH_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DASH LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN_TILD\n  \\class TILD_INF_XS TELCO ARA HALLA\n  \\class TILD_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_TILD LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA\n\\end\n\n\\beg virtual NASALIZE_SIGN\n  \\class DASH_SUP_XS TELCO ARA HALLA\n  \\class DASH_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual NASALIZE_SIGN_TILD\n  \\class TILD_SUP_XS TELCO ARA HALLA\n  \\class TILD_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual ALVEOLAR_SIGN\n  \\class SHOOK_LEFT_L CALMA QUESSE ANGA UNGWE TW_EXT_13 TW_EXT_14 TW_EXT_23 TW_EXT_24 HWESTA_SINDARINWA VALA_W_HOOK\n  \\class SHOOK_RIGHT_L TELCO ARA HALLA TINCO PARMA ANDO UMBAR SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_21 TW_EXT_22 ROMEN ARDA LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN YANTA URE OSSE VAIA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n\\end\n\n\\beg virtual LAMBE\n  \\reversed\n  \\default LAMBE_NO_LIG\n  \\class LAMBE_NO_LIG HALLA\n  \\class LAMBE_LIG TELCO ARA TINCO PARMA CALMA QUESSE ANDO UMBAR ANGA UNGWE SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ROMEN ARDA LAMBE LAMBE_LIG LAMBE_NO_LIG ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n\\end\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_ds_eldamar"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset specially customized for Tengwar Eldamar (Glaemscrafu patched version) **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.5\" \"Added VALA_W_HOOK, VAIYA. Moved A_TEHTA_INV_L due to soft hyphen bug.\"\n  \\entry \"0.0.6\" \"Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara. / Added pustar combinations (4/4-halfed/4-squared/5)\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"\n\\end\n\n\\**   **\\ \\char 20 SPACE              \n\\** ! **\\ \\char 21 TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT          \n\\** \" **\\ \\char 22 DASH_INF_L            \n\\** # **\\ \\char 23 A_TEHTA_XL          \n\\** $ **\\ \\char 24 E_TEHTA_XL   \n\\** % **\\ \\char 25 I_TEHTA_XL     \n\\** & **\\ \\char 26 U_TEHTA_XL        \n\\** \' **\\ \\char 27 DASH_INF_S            \n\\** ( **\\ \\char 28 ?                \n\\** ) **\\ \\char 29 TILD_XSUP_L           \n\\** * **\\ \\char 2a ?                \n\\** + **\\ \\char 2b SHOOK_RIGHT_L          \n\\** , **\\ \\char 2c TW_84 ESSE_NUQUERNA       \n\\** - **\\ \\char 2d PUNCT_DDOT            \n\\** . **\\ \\char 2e TW_94 URE            \n\\** / **\\ \\char 2f TILD_XINF_S           \n\\** 0 **\\ \\char 30 TILD_XSUP_S           \n\\** 1 **\\ \\char 31 TW_11 TINCO           \n\\** 2 **\\ \\char 32 TW_21 ANDO           \n\\** 3 **\\ \\char 33 TW_31 SULE THULE        \n\\** 4 **\\ \\char 34 TW_41 ANTO           \n\\** 5 **\\ \\char 35 TW_51 NUMEN           \n\\** 6 **\\ \\char 36 TW_61 ORE            \n\\** 7 **\\ \\char 37 TW_71 ROMEN           \n\\** 8 **\\ \\char 38 TW_81 SILME           \n\\** 9 **\\ \\char 39 TW_91 HYARMEN          \n\\** : **\\ \\char 3a TILD_INF_L            \n\\** ; **\\ \\char 3b TILD_INF_S            \n\\** < **\\ \\char 3c ?  \\** Does not look compliant between DS and Annatar **\\\n\\** = **\\ \\char 3d PUNCT_DOT            \n\\** > **\\ \\char 3e ?                \n\\** ? **\\ \\char 3f TILD_XINF_L           \n\\** @ **\\ \\char 40 TW_EXT_21 ANDO_EXT ANTO_EXT            \n\\** A **\\ \\char 41 TW_EXT_13 CALMA_EXT AHA_EXT            \n\\** B **\\ \\char 42 I_TEHTA_XS     \n\\** C **\\ \\char 43 A_TEHTA_XS          \n\\** D **\\ \\char 44 A_TEHTA_S           \n\\** E **\\ \\char 45 A_TEHTA_L           \n\\** F **\\ \\char 46 E_TEHTA_S    \n\\** G **\\ \\char 47 I_TEHTA_S           \n\\** H **\\ \\char 48 O_TEHTA_S           \n\\** I **\\ \\char 49 SILME_NUQUERNA_ALT \\** Used for y in s. beleriand **\\                \n\\** J **\\ \\char 4a U_TEHTA_S         \n\\** K **\\ \\char 4b ?                \n\\** L **\\ \\char 4c LAMBE_MARK_DOT                \n\\** M **\\ \\char 4d U_TEHTA_XS        \n\\** N **\\ \\char 4e O_TEHTA_XS          \n\\** O **\\ \\char 4f ?                \n\\** P **\\ \\char 50 TILD_SUP_L            \n\\** Q **\\ \\char 51 TW_EXT_12 PARMA_EXT FORMEN_EXT            \n\\** R **\\ \\char 52 E_TEHTA_L          \n\\** S **\\ \\char 53 TW_EXT_23 ANGA_EXT ANCA_EXT            \n\\** T **\\ \\char 54 I_TEHTA_L           \n\\** U **\\ \\char 55 U_TEHTA_L         \n\\** V **\\ \\char 56 E_TEHTA_XS         \n\\** W **\\ \\char 57 TW_EXT_22 UMBAR_EXT AMPA_EXT            \n\\** X **\\ \\char 58 TW_EXT_24 UNQUE_EXT UNGWE_EXT            \n\\** Y **\\ \\char 59 O_TEHTA_L           \n\\** Z **\\ \\char 5a TW_EXT_14 QUESSE_EXT HWESTA_EXT            \n\\** [ **\\ \\char 5b DASH_SUP_S            \n\\** \\ **\\ \\char 5c TILD_L              \n\\** ] **\\ \\char 5d OSSE               \n\\** ^ **\\ \\char 5e O_TEHTA_XL          \n\\** _ **\\ \\char 5f SHOOOK_RIGHT_S          \n\\** ` **\\ \\char 60 TELCO              \n\\** a **\\ \\char 61 TW_13 CALMA          \n\\** b **\\ \\char 62 TW_54 NWALME          \n\\** c **\\ \\char 63 TW_34 HWESTA          \n\\** d **\\ \\char 64 TW_33 AHA           \n\\** e **\\ \\char 65 TW_32 FORMEN          \n\\** f **\\ \\char 66 TW_43 ANCA           \n\\** g **\\ \\char 67 TW_53 NOLDO          \n\\** h **\\ \\char 68 TW_63 ANNA           \n\\** i **\\ \\char 69 TW_82 SILME_NUQUERNA      \n\\** j **\\ \\char 6a TW_73 LAMBE          \n\\** k **\\ \\char 6b TW_83 ESSE           \n\\** l **\\ \\char 6c TW_93 YANTA          \n\\** m **\\ \\char 6d TW_74 ALDA           \n\\** n **\\ \\char 6e TW_64 VILYA          \n\\** o **\\ \\char 6f TW_92 HWESTA_SINDARINWA    \n\\** p **\\ \\char 70 TILD_SUP_S           \n\\** q **\\ \\char 71 TW_12 PARMA          \n\\** r **\\ \\char 72 TW_42 AMPA           \n\\** s **\\ \\char 73 TW_23 ANGA           \n\\** t **\\ \\char 74 TW_52 MALTA          \n\\** u **\\ \\char 75 TW_72 ARDA           \n\\** v **\\ \\char 76 TW_44 UNQUE          \n\\** w **\\ \\char 77 TW_22 UMBAR          \n\\** x **\\ \\char 78 TW_24 UNGWE          \n\\** y **\\ \\char 79 TW_62 VALA           \n\\** z **\\ \\char 7a TW_14 QUESSE          \n\\** { **\\ \\char 7b DASH_SUP_L           \n\\** | **\\ \\char 7c SHOOK_LEFT_L          \n\\** } **\\ \\char 7d SHOOK_LEFT_S          \n\\** ~ **\\ \\char 7e ARA              \n\\char a0 NBSP \n\\** ¡ **\\ \\char a1 ?                \n\\** ¢ **\\ \\char a2 ?                \n\\** £ **\\ \\char a3 SHOOK_BEAUTIFUL                \n\\** ¥ **\\ \\char a5 ?                \n\\** ¦ **\\ \\char a6 HWESTA_TINCO                \n\\** § **\\ \\char a7 AHA_TINCO                \n\\** ¨ **\\ \\char a8 TH_SUB_CIRC_S          \n\\** © **\\ \\char a9 TH_SUB_CIRC_XS          \n\\** ª **\\ \\char aa A_TEHTA_INV_XL        \n\\** « **\\ \\char ab DQUOT_OPEN            \n\\** ¬ **\\ \\char ac PUNCT_DTILD RING_MARK_L RING_MARK_R               \n      \n\\** ® **\\ \\char ae ?                \n\\** ¯ **\\ \\char af A_TEHTA_INV_S         \n\\** ° **\\ \\char b0 LAMBE_MARK_TILD               \n\\** ± **\\ \\char b1 SQUOT_OPEN            \n\\** ² **\\ \\char b2 SQUOT_CLOSE           \n\\** ³ **\\ \\char b3 ?                \n\\** ´ **\\ \\char b4 LAMBE_MARK_DDOT         \n\\** µ **\\ \\char b5 A_TEHTA_INV_XS        \n\\** · **\\ \\char b7 ?                \n\\** ¸ **\\ \\char b8 LAMBE_MARK_DASH          \n\\** ¹ **\\ \\char b9 ?                \n\\** º **\\ \\char ba ?                \n\\** » **\\ \\char bb DQUOT_CLOSE           \n\\** ¼ **\\ \\char bc ?                \n\\** ½ **\\ \\char bd HALLA              \n\\** ¾ **\\ \\char be ?                \n\\** ¿ **\\ \\char bf ?                \n\\** À **\\ \\char c0 PUNCT_INTERR           \n\\** Á **\\ \\char c1 PUNCT_EXCLAM           \n\\** Â **\\ \\char c2 PUNCT_TILD            \n\\** Ã **\\ \\char c3 ?                \n\\** Ä **\\ \\char c4 ?                \n\\** Å **\\ \\char c5 ?                \n\\** Æ **\\ \\char c6 ?                \n\\** Ç **\\ \\char c7 ?                \n\\** È **\\ \\char c8 THINF_DOT_XL           \n\\** É **\\ \\char c9 THINF_DOT_L           \n\\** Ê **\\ \\char ca THINF_DOT_S           \n\\** Ë **\\ \\char cb THINF_DOT_XS           \n\\** Ì **\\ \\char cc THINF_DDOT_XL          \n\\** Í **\\ \\char cd THINF_DDOT_L           \n\\** Î **\\ \\char ce THINF_DDOT_S           \n\\** Ï **\\ \\char cf THINF_DDOT_XS          \n\\** Ð **\\ \\char d0 THINF_TDOT_XL          \n\\** Ñ **\\ \\char d1 THINF_TDOT_L           \n\\** Ò **\\ \\char d2 THINF_TDOT_S           \n\\** Ó **\\ \\char d3 THINF_TDOT_XS          \n\\** Ô **\\ \\char d4 THSUP_DDOT_XL Y_TEHTA_XL I_TEHTA_DOUBLE_XL         \n\\** Õ **\\ \\char d5 THSUP_DDOT_L Y_TEHTA_L I_TEHTA_DOUBLE_L       \n\\** Ö **\\ \\char d6 THSUP_DDOT_S Y_TEHTA_S I_TEHTA_DOUBLE_S          \n\\** × **\\ \\char d7 THSUP_DDOT_XS Y_TEHTA_XS I_TEHTA_DOUBLE_XS         \n\\** Ø **\\ \\char d8 THSUP_TICK_XL          \n\\** Ù **\\ \\char d9 THSUP_TICK_L           \n\\** Ú **\\ \\char da THSUP_TICK_S           \n\\** Û **\\ \\char db THSUP_TICK_XS          \n\\** Ü **\\ \\char dc THSUP_TICK_INV_XL A_TEHTA_CIRCUM_XL       \n\\** Ý **\\ \\char dd THSUP_TICK_INV_L A_TEHTA_CIRCUM_L        \n\\** Þ **\\ \\char de THSUP_TICK_INV_S A_TEHTA_CIRCUM_S         \n\\** ß **\\ \\char df THSUP_TICK_INV_XS A_TEHTA_CIRCUM_XS       \n\\** à **\\ \\char e0 THSUP_LAMBDA_XL         \n\\** á **\\ \\char e1 THSUP_LAMBDA_L          \n\\** â **\\ \\char e2 THSUP_LAMBDA_S          \n\\** ã **\\ \\char e3 THSUP_LAMBDA_XS         \n\\** ä **\\ \\char e4 THINF_CURL_XL          \n\\** å **\\ \\char e5 THINF_CURL_L           \n\\** æ **\\ \\char e6 THINF_CURL_S           \n\\** ç **\\ \\char e7 THINF_CURL_XS          \n\\** è **\\ \\char e8 SEV_TEHTA_XL           \n\\** é **\\ \\char e9 SEV_TEHTA_L           \n\\** ê **\\ \\char ea SEV_TEHTA_S           \n\\** ë **\\ \\char eb SEV_TEHTA_XS           \n\\** ì **\\ \\char ec ?                                 \n\\** í **\\ \\char ed ?                                 \n\\** î **\\ \\char ee ?                                 \n\\** ï **\\ \\char ef ?                                 \n\\** ð **\\ \\char f0 NUM_0                               \n\\** ñ **\\ \\char f1 NUM_1                               \n\\** ò **\\ \\char f2 NUM_2                               \n\\** ó **\\ \\char f3 NUM_3                               \n\\** ô **\\ \\char f4 NUM_4                               \n\\** õ **\\ \\char f5 NUM_5                               \n\\** ö **\\ \\char f6 NUM_6                               \n\\** ÷ **\\ \\char f7 NUM_7                               \n\\** ø **\\ \\char f8 NUM_8                               \n\\** ù **\\ \\char f9 NUM_9                               \n\\** ú **\\ \\char fa NUM_10                               \n\\** û **\\ \\char fb NUM_11                               \n\\** ü **\\ \\char fc THINF_STROKE_XL                                 \n\\** ý **\\ \\char fd THINF_STROKE_L                                 \n\\** þ **\\ \\char fe THINF_STROKE_S                                 \n\\** ÿ **\\ \\char ff THINF_STROKE_XS                 \n\n\\** FIX FOR SOFT HYPHEN **\\\n\\char 109 A_TEHTA_INV_L\n\n\\** USING TENGWAR ELFICA POS TO AVOID PROBLEMS **\\\n\\char 125 VAIA WAIA VAIYA\n                \n\\** Œ **\\ \\char 152 PUNCT_PAREN_L                           \n\\** œ **\\ \\char 153 PUNCT_PAREN_R                           \n\\** Š **\\ \\char 160 THINF_ACCENT_L                                 \n\\** š **\\ \\char 161 MALTA_W_HOOK TW_MH                                 \n\\** Ÿ **\\ \\char 178 THINF_ACCENT_XS                                 \n\\** ƒ **\\ \\char 192 THINF_DSTROKE_XL       \n\n\\char 200 DASH_INF_XS\n\\char 201 TILD_INF_XS\n\\char 202 DASH_SUP_XS\n\\char 203 TILD_SUP_XS\n\n\\char 181 PUSTA_4\n\\char 182 PUSTA_5\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n                          \n\\** ˆ **\\ \\char 2c6 PUNCT_TDOT PUSTA_3                                \n\\** ˜ **\\ \\char 2dc TH_SUB_CIRC_XL                                 \n\\** – **\\ \\char 2013 ANCA_CLOSED SILME_AHA                                \n\\** — **\\ \\char 2014 OLD_ENGLISH_AND                                \n\\** ‘ **\\ \\char 2018 THINF_CURL_INV_XL                                \n\\** ’ **\\ \\char 2019 THINF_CURL_INV_L                                \n\\** ‚ **\\ \\char 201a LAMBE_MARK_DSTROKE                                \n\\** “ **\\ \\char 201c THINF_CURL_INV_S                                \n\\** ” **\\ \\char 201d THINF_CURL_INV_XS                                \n\\** „ **\\ \\char 201e THINF_DSTROKE_L                                \n\\** † **\\ \\char 2020 THINF_DSTROKE_XS                                \n\\** ‡ **\\ \\char 2021 ?                                \n\\** • **\\ \\char 2022 TW_HW_LOWDHAM HARP_SHAPED                                \n\\** … **\\ \\char 2026 THINF_DSTROKE_S                                \n\\** ‰ **\\ \\char 2030 THINF_ACCENT_XL                                \n\\** ‹ **\\ \\char 2039 THINF_ACCENT_S                                \n\\** › **\\ \\char 203a BOOKMARK_SIGN                                \n\\** ™ **\\ \\char 2122 TH_SUB_CIRC_L          \n\n\\char 2FFC E_TEHTA_GRAVE_XL\n\\char 2FFD E_TEHTA_GRAVE_XS\n\\char 2FFE E_TEHTA_GRAVE_L\n\\char 2FFF E_TEHTA_GRAVE_S\n                      \n\\** 〠 **\\ \\char 3020 ?                                \n\\** 〡 **\\ \\char 3021 ?                                \n\\** 〣 **\\ \\char 3023 A_TEHTA_DOUBLE_XL                                \n\\** 〤 **\\ \\char 3024 E_TEHTA_DOUBLE_XL                                \n\\** 〦 **\\ \\char 3026 U_TEHTA_DOUBLE_XL        \n\n\\** 〰 **\\ \\char 3030 ?                                \n\\** 〱 **\\ \\char 3031 ?                                \n\\** 〲 **\\ \\char 3032 ?                                \n\\** 〳 **\\ \\char 3033 ?                                \n\\** 〴 **\\ \\char 3034 ?                                \n\\** 〵 **\\ \\char 3035 ?                                \n\\** 〶 **\\ \\char 3036 ?                                \n\\** 〷 **\\ \\char 3037 ?                                \n\\** 〸 **\\ \\char 3038 ?                                \n\\** 〹 **\\ \\char 3039 ?                                \n\\** 〼 **\\ \\char 303c ?                                \n\\** ぀ **\\ \\char 3040 ?                                \n\\** ぃ **\\ \\char 3043 A_TEHTA_DOUBLE_XS                                \n\\** い **\\ \\char 3044 A_TEHTA_DOUBLE_S                                \n\\** ぅ **\\ \\char 3045 A_TEHTA_DOUBLE_L                                \n\\** う **\\ \\char 3046 E_TEHTA_DOUBLE_XS                                \n\\** え **\\ \\char 3048 O_TEHTA_DOUBLE_S                                \n\\** お **\\ \\char 304a U_TEHTA_DOUBLE_S                                \n\\** き **\\ \\char 304d U_TEHTA_DOUBLE_XS                                \n\\** ぎ **\\ \\char 304e O_TEHTA_DOUBLE_XS                                \n\\** け **\\ \\char 3051 ?                                \n\\** げ **\\ \\char 3052 E_TEHTA_DOUBLE_L                                \n\\** さ **\\ \\char 3055 U_TEHTA_DOUBLE_L                                \n\\** ざ **\\ \\char 3056 E_TEHTA_DOUBLE_S                                \n\\** し **\\ \\char 3057 ?                                \n\\** す **\\ \\char 3059 O_TEHTA_DOUBLE_L                                \n\\** ぞ **\\ \\char 305e O_TEHTA_DOUBLE_XL                                \n\\** ぢ **\\ \\char 3062 ?                                \n\\** づ **\\ \\char 3065 ?                                \n\\** と **\\ \\char 3068 ?                                \n\\** な **\\ \\char 306a LAMBE_LIG                                \n\\** の **\\ \\char 306e ?                                \n\\** ぱ **\\ \\char 3071 ?                                \n\\** ひ **\\ \\char 3072 ?                                \n\\** ぴ **\\ \\char 3074 ?                                \n\\** ふ **\\ \\char 3075 ?                                \n\\** ぷ **\\ \\char 3077 ?                                \n\\** へ **\\ \\char 3078 ?                                \n\\** べ **\\ \\char 3079 ?                                \n\\** ぺ **\\ \\char 307a ?                                \n\\** ア **\\ \\char 30a2 ?                                \n\\** カ **\\ \\char 30ab ?                                \n\\** ギ **\\ \\char 30ae ?                                \n\\** セ **\\ \\char 30bb ?                                \n\\** タ **\\ \\char 30bf ?                                \n\\** ツ **\\ \\char 30c4 ?                                \n\\** テ **\\ \\char 30c6 ?                                \n\\** デ **\\ \\char 30c7 ?                                \n\\** ヘ **\\ \\char 30d8 ?                                \n\\** ベ **\\ \\char 30d9 ?                                \n\\** ペ **\\ \\char 30da ?                                \n\\** ホ **\\ \\char 30db ?                                \n\\** ム **\\ \\char 30e0 ?                                \n\\** メ **\\ \\char 30e1 ?                                \n\\** モ **\\ \\char 30e2 ?                                \n\\** ャ **\\ \\char 30e3 ?                                \n\\** ヨ **\\ \\char 30e8 ?                                \n\\** ラ **\\ \\char 30e9 ?                                \n\\** リ **\\ \\char 30ea ?                                \n\\** ル **\\ \\char 30eb ? \n\\** **\\ \\char 3152 PUNCT_PAREN_L_ALT                                \n\\** **\\ \\char 3153 PUNCT_PAREN_R_ALT                                                               \n\\** ㅠ **\\ \\char 3160 ?              \n                  \n\\char 3161 VALA_W_HOOK TW_MH_BELERIANDIC       \n              \n\\** ㅸ **\\ \\char 3178 ?                                \n\\** ㆒ **\\ \\char 3192 ?                                \n\\** 倚 **\\ \\char 501a ?                                \n\\** 倞 **\\ \\char 501e ?                                \n\\** 倠 **\\ \\char 5020 ?                                \n\\** 倢 **\\ \\char 5022 ?                                \n\\** 倦 **\\ \\char 5026 ?                                \n\\** 倰 **\\ \\char 5030 ?                                \n\\** 倹 **\\ \\char 5039 ?\n\n\n\\** The following virtual chars are used to handle tehtar (& the like) multiple version chosing **\\\n\\** It could be avoided with modern fonts with gsub/gpos tables for ligatures and diacritics **\\\n\\** placement **\\\n\n\\beg virtual A_TEHTA\n  \\class A_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class A_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_1\n  \\class A_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM\n  \\class A_TEHTA_CIRCUM_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_CIRCUM_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class A_TEHTA_CIRCUM_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_1\n  \\class A_TEHTA_CIRCUM_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_REVERSED\n  \\class A_TEHTA_INV_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_INV_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class A_TEHTA_INV_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_1\n  \\class A_TEHTA_INV_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM_REVERSED TEHTA_BREVE\n  \\class THSUP_TICK_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class THSUP_TICK_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class THSUP_TICK_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_1\n  \\class THSUP_TICK_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA\n  \\class E_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class E_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class E_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA NUM_4\n  \\class E_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_GRAVE\n  \\class E_TEHTA_GRAVE_XS TELCO ARA HALLA AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME ESSE HWESTA_SINDARINWA YANTA URE OSSE VAIA HARP_SHAPED NUM_5 NUM_7 NUM_10 NUM_11\n  \\class E_TEHTA_GRAVE_S SULE FORMEN SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA HYARMEN AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8\n  \\class E_TEHTA_GRAVE_L TINCO PARMA CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_6 NUM_9\n  \\class E_TEHTA_GRAVE_XL NUM_3\n\\end\n\n\\beg virtual I_TEHTA\n  \\class I_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class I_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0\n  \\class I_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_1 NUM_4 NUM_7 NUM_8\n  \\class I_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual O_TEHTA\n  \\class O_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class O_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0\n  \\class O_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA NUM_4\n  \\class O_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_1 NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9\n\\end\n\n\\beg virtual U_TEHTA\n  \\class U_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class U_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class U_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA VALA_W_HOOK NUM_4\n  \\class U_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual SEV_TEHTA\n  \\class SEV_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class SEV_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_8\n  \\class SEV_TEHTA_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VALA_W_HOOK NUM_1 NUM_5 NUM_7\n  \\class SEV_TEHTA_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_DOUBLE\n  \\class A_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class A_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA NUM_1\n  \\class A_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE\n  \\class E_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class E_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE AHA_TINCO HWESTA_TINCO\n  \\class E_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VAIA NUM_0\n  \\class E_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9\n\\end\n\n\\beg virtual I_TEHTA_DOUBLE Y_TEHTA\n  \\class I_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class I_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class I_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE VALA_W_HOOK NUM_1\n  \\class I_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_DOUBLE\n  \\class O_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class O_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO\n  \\class O_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE NUM_0 NUM_4 NUM_8\n  \\class O_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_1 NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_DOUBLE\n  \\class U_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class U_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_8\n  \\class U_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA LAMBE URE NUM_4\n  \\class U_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_INF\n  \\class THINF_TDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_TDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_5 NUM_7\n  \\class THINF_TDOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VAIA NUM_0 NUM_1 NUM_4 NUM_8 NUM_10 NUM_11\n  \\class THINF_TDOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_INF\n  \\class THINF_ACCENT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT VAIA HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_ACCENT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE VALA_W_HOOK AHA_TINCO HWESTA_TINCO\n  \\class THINF_ACCENT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE NUM_2 NUM_3 NUM_6 NUM_9\n  \\class THINF_ACCENT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED\n\\end\n\n\\beg virtual CIRC_TEHTA_INF\n  \\class TH_SUB_CIRC_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class TH_SUB_CIRC_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_7 NUM_10 NUM_11\n  \\class TH_SUB_CIRC_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VALA_W_HOOK NUM_1 NUM_2 NUM_4 NUM_5 NUM_8\n  \\class TH_SUB_CIRC_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual THINNAS SEV_TEHTA_INF THINF_STROKE\n  \\class THINF_STROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_STROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_5\n  \\class THINF_STROKE_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_STROKE_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_INF\n  \\class THINF_CURL_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED NUM_10 NUM_11\n  \\class THINF_CURL_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9\n  \\class THINF_CURL_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VAIA VALA_W_HOOK\n  \\class THINF_CURL_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED\n\\end\n\n\\beg virtual U_TEHTA_INF\n  \\class THINF_CURL_INV_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED NUM_4 NUM_7 NUM_10 NUM_11\n  \\class THINF_CURL_INV_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_5 NUM_8 NUM_9\n  \\class THINF_CURL_INV_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VAIA VALA_W_HOOK NUM_6\n  \\class THINF_CURL_INV_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_3\n\\end\n\n\\beg virtual PALATAL_SIGN I_TEHTA_DOUBLE_INF Y_TEHTA_INF\n  \\class THINF_DDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_DDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class THINF_DDOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VALA_W_HOOK NUM_1 NUM_8\n  \\class THINF_DDOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n  \\class LAMBE_MARK_DDOT LAMBE ALDA\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n  \\class THINF_DSTROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_DSTROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class THINF_DSTROKE_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE VALA_W_HOOK NUM_2 NUM_3 NUM_6 NUM_8\n  \\class THINF_DSTROKE_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_9\n  \\class LAMBE_MARK_DSTROKE LAMBE ALDA\n\\end\n\n\\beg virtual UNUTIXE I_TEHTA_INF NO_VOWEL_DOT\n  \\class THINF_DOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_DOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME YANTA OSSE VAIA AHA_TINCO HWESTA_TINCO NUM_0 NUM_10 NUM_11\n  \\class THINF_DOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA URE NUM_1 NUM_4 NUM_5 NUM_7 NUM_8\n  \\class THINF_DOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n  \\class LAMBE_MARK_DOT LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN\n  \\class DASH_INF_XS TELCO ARA HALLA\n  \\class DASH_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n  \\class LAMBE_MARK_DASH LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN_TILD\n  \\class TILD_INF_XS TELCO ARA HALLA\n  \\class TILD_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n  \\class LAMBE_MARK_TILD LAMBE ALDA\n\\end\n\n\\beg virtual NASALIZE_SIGN\n  \\class DASH_SUP_XS TELCO ARA HALLA\n  \\class DASH_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n\\end\n\n\\beg virtual NASALIZE_SIGN_TILD\n  \\class TILD_SUP_XS TELCO ARA HALLA\n  \\class TILD_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_9\n\\end\n\n\\beg virtual ALVEOLAR_SIGN\n  \\class SHOOK_LEFT_L CALMA QUESSE ANGA UNGWE TW_EXT_13 TW_EXT_14 TW_EXT_23 TW_EXT_24 HWESTA_SINDARINWA\n  \\class SHOOK_RIGHT_L TELCO ARA HALLA TINCO PARMA ANDO UMBAR SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_21 TW_EXT_22 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN YANTA URE OSSE VAIA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n\\end\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_ds_elfica"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset specially customized for Tengwar Annatar (Glaemscrafu patched version) **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.5\" \"Added VALA_W_HOOK, VAIYA. Moved A_TEHTA_INV_L due to soft hyphen bug.\"\n  \\entry \"0.0.6\" \"Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara. / Added pustar combinations (4/4-halfed/4-squared/5)\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"\n\\end\n\n\\**   **\\ \\char 20 SPACE              \n\\** ! **\\ \\char 21 TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT                  \n\\** \" **\\ \\char 22 DASH_INF_L            \n\\** # **\\ \\char 23 A_TEHTA_XL          \n\\** $ **\\ \\char 24 E_TEHTA_XL   \n\\** % **\\ \\char 25 I_TEHTA_XL     \n\\** & **\\ \\char 26 U_TEHTA_XL        \n\\** \' **\\ \\char 27 DASH_INF_S            \n\\** ( **\\ \\char 28 ?         \\** seems redundant with I_TEHTA_INF **\\       \n\\** ) **\\ \\char 29 TILD_XSUP_L           \n\\** * **\\ \\char 2a ?                \n\\** + **\\ \\char 2b SHOOK_RIGHT_L          \n\\** , **\\ \\char 2c TW_84 ESSE_NUQUERNA       \n\\** - **\\ \\char 2d PUNCT_DDOT            \n\\** . **\\ \\char 2e TW_94 URE            \n\\** / **\\ \\char 2f TILD_XINF_S           \n\\** 0 **\\ \\char 30 TILD_XSUP_S           \n\\** 1 **\\ \\char 31 TW_11 TINCO           \n\\** 2 **\\ \\char 32 TW_21 ANDO           \n\\** 3 **\\ \\char 33 TW_31 SULE THULE        \n\\** 4 **\\ \\char 34 TW_41 ANTO           \n\\** 5 **\\ \\char 35 TW_51 NUMEN           \n\\** 6 **\\ \\char 36 TW_61 ORE            \n\\** 7 **\\ \\char 37 TW_71 ROMEN           \n\\** 8 **\\ \\char 38 TW_81 SILME           \n\\** 9 **\\ \\char 39 TW_91 HYARMEN          \n\\** : **\\ \\char 3a TILD_INF_L            \n\\** ; **\\ \\char 3b TILD_INF_S            \n\\** < **\\ \\char 3c ?  \\** Does not look compliant between DS and Annatar **\\\n\\** = **\\ \\char 3d PUNCT_DOT            \n\\** > **\\ \\char 3e ?                \n\\** ? **\\ \\char 3f TILD_XINF_L           \n\\** @ **\\ \\char 40 TW_EXT_21 ANDO_EXT ANTO_EXT            \n\\** A **\\ \\char 41 TW_EXT_13 CALMA_EXT AHA_EXT            \n\\** B **\\ \\char 42 I_TEHTA_XS     \n\\** C **\\ \\char 43 A_TEHTA_XS          \n\\** D **\\ \\char 44 A_TEHTA_S           \n\\** E **\\ \\char 45 A_TEHTA_L           \n\\** F **\\ \\char 46 E_TEHTA_S    \n\\** G **\\ \\char 47 I_TEHTA_S           \n\\** H **\\ \\char 48 O_TEHTA_S           \n\\** I **\\ \\char 49 SILME_NUQUERNA_ALT \\** Used for y in s. beleriand **\\                \n\\** J **\\ \\char 4a U_TEHTA_S         \n\\** K **\\ \\char 4b ?                \n\\** L **\\ \\char 4c LAMBE_MARK_DOT                \n\\** M **\\ \\char 4d U_TEHTA_XS        \n\\** N **\\ \\char 4e O_TEHTA_XS          \n\\** O **\\ \\char 4f ?                \n\\** P **\\ \\char 50 TILD_SUP_L            \n\\** Q **\\ \\char 51 TW_EXT_12 PARMA_EXT FORMEN_EXT            \n\\** R **\\ \\char 52 E_TEHTA_L          \n\\** S **\\ \\char 53 TW_EXT_23 ANGA_EXT ANCA_EXT            \n\\** T **\\ \\char 54 I_TEHTA_L           \n\\** U **\\ \\char 55 U_TEHTA_L         \n\\** V **\\ \\char 56 E_TEHTA_XS         \n\\** W **\\ \\char 57 TW_EXT_22 UMBAR_EXT AMPA_EXT            \n\\** X **\\ \\char 58 TW_EXT_24 UNQUE_EXT UNGWE_EXT            \n\\** Y **\\ \\char 59 O_TEHTA_L           \n\\** Z **\\ \\char 5a TW_EXT_14 QUESSE_EXT HWESTA_EXT            \n\\** [ **\\ \\char 5b DASH_SUP_S            \n\\** \\ **\\ \\char 5c TILD_L              \n\\** ] **\\ \\char 5d OSSE               \n\\** ^ **\\ \\char 5e O_TEHTA_XL          \n\\** _ **\\ \\char 5f SHOOOK_RIGHT_S          \n\\** ` **\\ \\char 60 TELCO              \n\\** a **\\ \\char 61 TW_13 CALMA          \n\\** b **\\ \\char 62 TW_54 NWALME          \n\\** c **\\ \\char 63 TW_34 HWESTA          \n\\** d **\\ \\char 64 TW_33 AHA           \n\\** e **\\ \\char 65 TW_32 FORMEN          \n\\** f **\\ \\char 66 TW_43 ANCA           \n\\** g **\\ \\char 67 TW_53 NOLDO          \n\\** h **\\ \\char 68 TW_63 ANNA           \n\\** i **\\ \\char 69 TW_82 SILME_NUQUERNA      \n\\** j **\\ \\char 6a TW_73 LAMBE       \n\\** k **\\ \\char 6b TW_83 ESSE           \n\\** l **\\ \\char 6c TW_93 YANTA          \n\\** m **\\ \\char 6d TW_74 ALDA           \n\\** n **\\ \\char 6e TW_64 VILYA          \n\\** o **\\ \\char 6f TW_92 HWESTA_SINDARINWA    \n\\** p **\\ \\char 70 TILD_SUP_S           \n\\** q **\\ \\char 71 TW_12 PARMA          \n\\** r **\\ \\char 72 TW_42 AMPA           \n\\** s **\\ \\char 73 TW_23 ANGA           \n\\** t **\\ \\char 74 TW_52 MALTA          \n\\** u **\\ \\char 75 TW_72 ARDA           \n\\** v **\\ \\char 76 TW_44 UNQUE          \n\\** w **\\ \\char 77 TW_22 UMBAR          \n\\** x **\\ \\char 78 TW_24 UNGWE          \n\\** y **\\ \\char 79 TW_62 VALA           \n\\** z **\\ \\char 7a TW_14 QUESSE          \n\\** { **\\ \\char 7b DASH_SUP_L           \n\\** | **\\ \\char 7c SHOOK_LEFT_L          \n\\** } **\\ \\char 7d SHOOK_LEFT_S          \n\\** ~ **\\ \\char 7e ARA              \n\\char a0 NBSP\n\\** ¡ **\\ \\char a1 ?                \n\\** ¢ **\\ \\char a2 ?                \n\\** £ **\\ \\char a3 SHOOK_BEAUTIFUL      \n\\**   **\\ \\char a4 ?          \n\\** ¥ **\\ \\char a5 ?                \n\\** ¦ **\\ \\char a6 HWESTA_TINCO                \n\\** § **\\ \\char a7 AHA_TINCO                \n\\** ¨ **\\ \\char a8 TH_SUB_CIRC_S          \n\\** © **\\ \\char a9 TH_SUB_CIRC_XS          \n\\** ª **\\ \\char aa ? \\** A_TEHTA_INV_XL **\\\n\\** « **\\ \\char ab DQUOT_OPEN            \n\\** ¬ **\\ \\char ac PUNCT_DTILD RING_MARK_L RING_MARK_R              \n\\**   **\\ \\char ad ? \\** A_TEHTA_INV_L **\\        \n\\** ® **\\ \\char ae ?                \n\\** ¯ **\\ \\char af ? \\** A_TEHTA_INV_S **\\\n\\** ° **\\ \\char b0 LAMBE_MARK_TILD              \n\\** ± **\\ \\char b1 SQUOT_OPEN            \n\\** ² **\\ \\char b2 SQUOT_CLOSE           \n\\** ³ **\\ \\char b3 ?                \n\\** ´ **\\ \\char b4 LAMBE_MARK_DDOT         \n\\** µ **\\ \\char b5 ? \\** A_TEHTA_INV_XS **\\\n\\** · **\\ \\char b7 ?                \n\\** ¸ **\\ \\char b8 LAMBE_MARK_DASH         \n\\** ¹ **\\ \\char b9 ?                \n\\** º **\\ \\char ba ?                \n\\** » **\\ \\char bb DQUOT_CLOSE           \n\\** ¼ **\\ \\char bc LIGATING_SHORT_CARRIER                \n\\** ½ **\\ \\char bd HALLA              \n\\** ¾ **\\ \\char be ?                \n\\** ¿ **\\ \\char bf ?                \n\\** À **\\ \\char c0 PUNCT_INTERR           \n\\** Á **\\ \\char c1 PUNCT_EXCLAM           \n\\** Â **\\ \\char c2 PUNCT_TILD            \n\\** Ã **\\ \\char c3 ?                \n\\** Ä **\\ \\char c4 ?                \n\\** Å **\\ \\char c5 ?                \n\\** Æ **\\ \\char c6 ?                \n\\** Ç **\\ \\char c7 ?                \n\\** È **\\ \\char c8 THINF_DOT_XL           \n\\** É **\\ \\char c9 THINF_DOT_L           \n\\** Ê **\\ \\char ca THINF_DOT_S           \n\\** Ë **\\ \\char cb THINF_DOT_XS           \n\\** Ì **\\ \\char cc THINF_DDOT_XL          \n\\** Í **\\ \\char cd THINF_DDOT_L           \n\\** Î **\\ \\char ce THINF_DDOT_S           \n\\** Ï **\\ \\char cf THINF_DDOT_XS          \n\\** Ð **\\ \\char d0 THINF_TDOT_XL          \n\\** Ñ **\\ \\char d1 THINF_TDOT_L           \n\\** Ò **\\ \\char d2 THINF_TDOT_S           \n\\** Ó **\\ \\char d3 THINF_TDOT_XS          \n\\** Ô **\\ \\char d4 THSUP_DDOT_XL Y_TEHTA_XL I_TEHTA_DOUBLE_XL         \n\\** Õ **\\ \\char d5 THSUP_DDOT_L Y_TEHTA_L I_TEHTA_DOUBLE_L       \n\\** Ö **\\ \\char d6 THSUP_DDOT_S Y_TEHTA_S I_TEHTA_DOUBLE_S          \n\\** × **\\ \\char d7 THSUP_DDOT_XS Y_TEHTA_XS I_TEHTA_DOUBLE_XS         \n\\** Ø **\\ \\char d8 THSUP_TICK_XL          \n\\** Ù **\\ \\char d9 THSUP_TICK_L           \n\\** Ú **\\ \\char da THSUP_TICK_S           \n\\** Û **\\ \\char db THSUP_TICK_XS          \n\\** Ü **\\ \\char dc THSUP_TICK_INV_XL A_TEHTA_CIRCUM_XL       \n\\** Ý **\\ \\char dd THSUP_TICK_INV_L A_TEHTA_CIRCUM_L        \n\\** Þ **\\ \\char de THSUP_TICK_INV_S A_TEHTA_CIRCUM_S         \n\\** ß **\\ \\char df THSUP_TICK_INV_XS A_TEHTA_CIRCUM_XS       \n\\** à **\\ \\char e0 ? \\** THSUP_LAMBDA_XL => REVERSED_O_TEHTA **\\\n\\** á **\\ \\char e1 ? \\** THSUP_LAMBDA_L => REVERSED_O_TEHTA **\\          \n\\** â **\\ \\char e2 ? \\** THSUP_LAMBDA_S => REVERSED_O_TEHTA **\\          \n\\** ã **\\ \\char e3 ? \\** THSUP_LAMBDA_XS => REVERSED_O_TEHTA **\\\n\\** ä **\\ \\char e4 THINF_CURL_XL          \n\\** å **\\ \\char e5 THINF_CURL_L           \n\\** æ **\\ \\char e6 THINF_CURL_S           \n\\** ç **\\ \\char e7 THINF_CURL_XS          \n\\** è **\\ \\char e8 SEV_TEHTA_XL           \n\\** é **\\ \\char e9 SEV_TEHTA_L           \n\\** ê **\\ \\char ea SEV_TEHTA_S           \n\\** ë **\\ \\char eb SEV_TEHTA_XS           \n\\** ì **\\ \\char ec ?                                 \n\\** í **\\ \\char ed ?                                 \n\\** î **\\ \\char ee ?                                 \n\\** ï **\\ \\char ef ?                                 \n\\** ð **\\ \\char f0 NUM_0                               \n\\** ñ **\\ \\char f1 NUM_1                               \n\\** ò **\\ \\char f2 NUM_2                               \n\\** ó **\\ \\char f3 NUM_3                               \n\\** ô **\\ \\char f4 NUM_4                               \n\\** õ **\\ \\char f5 NUM_5                               \n\\** ö **\\ \\char f6 NUM_6                               \n\\** ÷ **\\ \\char f7 NUM_7                               \n\\** ø **\\ \\char f8 NUM_8                               \n\\** ù **\\ \\char f9 NUM_9                               \n\\** ú **\\ \\char fa NUM_10                               \n\\** û **\\ \\char fb NUM_11                               \n\\** ü **\\ \\char fc THINF_STROKE_XL                                 \n\\** ý **\\ \\char fd THINF_STROKE_L                                 \n\\** þ **\\ \\char fe THINF_STROKE_S                                 \n\\** ÿ **\\ \\char ff THINF_STROKE_XS     \n\n\\** NEW BLOCK HERE : 0x100 => 0x13F : lot of chars are in alternate font in eldamar **\\\n\\** DOUBLE TEHTAR ARE HERE **\\\n\n                           \n\\char 108 A_TEHTA_INV_XL A_TEHTA_DOUBLE_XL\n\\char 109 A_TEHTA_INV_L  A_TEHTA_DOUBLE_L\n\\char 10A A_TEHTA_INV_S  A_TEHTA_DOUBLE_S\n\\char 10B A_TEHTA_INV_XS A_TEHTA_DOUBLE_XS\n\n\\char 10C O_TEHTA_DOUBLE_XL\n\\char 10D O_TEHTA_DOUBLE_L\n\\char 10E O_TEHTA_DOUBLE_S\n\\char 10F O_TEHTA_DOUBLE_XS\n\n\\char 110 E_TEHTA_GRAVE_XL\n\\char 111 E_TEHTA_GRAVE_L\n\\char 112 E_TEHTA_GRAVE_S\n\\char 113 E_TEHTA_GRAVE_XS\n\n\\char 1A0 E_TEHTA_DOUBLE_XL\n\\char 1A1 E_TEHTA_DOUBLE_L\n\\char 1A2 E_TEHTA_DOUBLE_S\n\\char 1A3 E_TEHTA_DOUBLE_XS\n\n\\char 1A4 U_TEHTA_DOUBLE_XL\n\\char 1A5 U_TEHTA_DOUBLE_L\n\\char 1A6 U_TEHTA_DOUBLE_S\n\\char 1A7 U_TEHTA_DOUBLE_XS\n\n\\char 1B2 THSUP_LAMBDA_XL\n\\char 1B3 THSUP_LAMBDA_L \n\\char 1B4 THSUP_LAMBDA_S \n\\char 1B5 THSUP_LAMBDA_XS\n          \n\\** END OF NEW BLOCK **\\\n          \n\\char 125 VAIA WAIA VAIYA\n          \n\\** Œ **\\ \\char 152 PUNCT_PAREN_L PUNCT_PAREN_L_ALT          \\** OK **\\                    \n\\** œ **\\ \\char 153 PUNCT_PAREN_R PUNCT_PAREN_R_ALT         \\** OK **\\                        \n\\** Š **\\ \\char 160 THINF_ACCENT_L         \\** OK **\\                              \n\\** š **\\ \\char 161 MALTA_W_HOOK TW_MH           \\** OK **\\                            \n\\** Ÿ **\\ \\char 178 THINF_ACCENT_XS        \\** OK **\\              \n\n\\char 180 VALA_W_HOOK TW_MH_BELERIANDIC\n\n                \n\\** ƒ **\\ \\char 192 THINF_DSTROKE_XL       \\** OK **\\                               \n\n\\char 200 DASH_INF_XS\n\\char 201 TILD_INF_XS\n\\char 202 DASH_SUP_XS\n\\char 203 TILD_SUP_XS\n\n\\char 204 THINF_CURL_INV_XL\n\\char 205 THINF_CURL_INV_L\n\\char 206 THINF_CURL_INV_S\n\\char 207 THINF_CURL_INV_XS\n\n\\char 181 PUSTA_4\n\\char 182 PUSTA_5\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n\n\\** ˆ **\\ \\char 2c6 PUNCT_TDOT PUSTA_3 \n\n\n\n\\** ˜ **\\ \\char 2dc TH_SUB_CIRC_XL         \\** OK **\\         \n\n\n               \n\\** – **\\ \\char 2013 ANCA_CLOSED SILME_AHA           \\** OK **\\                       \n\\** — **\\ \\char 2014 OLD_ENGLISH_AND       \\** OK **\\                          \n\\** ‘ **\\ \\char 2018 ?     \\** OK **\\                            \n\\** ’ **\\ \\char 2019 ?      \\** OK **\\                           \n\\** ‚ **\\ \\char 201a LAMBE_MARK_DSTROKE    \\** OK **\\                              \n\\** “ **\\ \\char 201c ?      \\** OK **\\                           \n\\** ” **\\ \\char 201d ?     \\** OK **\\                            \n\\** „ **\\ \\char 201e THINF_DSTROKE_L       \\** OK **\\                          \n\\** † **\\ \\char 2020 THINF_DSTROKE_XS      \\** OK **\\                           \n\\** ‡ **\\ \\char 2021 ?                                \n\\** • **\\ \\char 2022 TW_HW_LOWDHAM HARP_SHAPED           \\** OK **\\                       \n\\** … **\\ \\char 2026 THINF_DSTROKE_S       \\** OK **\\                           \n\\** ‰ **\\ \\char 2030 THINF_ACCENT_XL       \\** OK **\\                          \n\\** ‹ **\\ \\char 2039 THINF_ACCENT_S        \\** OK **\\                         \n\\** › **\\ \\char 203a BOOKMARK_SIGN         \\** OK **\\                        \n\\** ™ **\\ \\char 2122 TH_SUB_CIRC_L         \\** OK **\\ \n\n\n                         \n\\** The following virtual chars are used to handle tehtar (& the like) multiple version chosing **\\\n\\** It could be avoided with modern fonts with gsub/gpos tables for ligatures and diacritics **\\\n\\** placement **\\\n\n\\** DUMPED FROM THE VIRTUAL CHARS TOOL **\\\n\n\n\\beg virtual A_TEHTA\n  \\class A_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class A_TEHTA_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class A_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM\n  \\class A_TEHTA_CIRCUM_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_CIRCUM_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class A_TEHTA_CIRCUM_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class A_TEHTA_CIRCUM_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_REVERSED\n  \\class A_TEHTA_INV_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_INV_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class A_TEHTA_INV_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class A_TEHTA_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM_REVERSED TEHTA_BREVE\n  \\class THSUP_TICK_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class THSUP_TICK_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class THSUP_TICK_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class THSUP_TICK_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual E_TEHTA\n  \\class E_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class E_TEHTA_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class E_TEHTA_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class E_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_GRAVE\n  \\class E_TEHTA_GRAVE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_10 NUM_11\n  \\class E_TEHTA_GRAVE_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA URE OSSE SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_8\n  \\class E_TEHTA_GRAVE_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT YANTA VALA_W_HOOK NUM_2 NUM_7\n  \\class E_TEHTA_GRAVE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual I_TEHTA\n  \\class I_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class I_TEHTA_S TINCO CALMA QUESSE SULE FORMEN ORE ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class I_TEHTA_L PARMA AHA HWESTA VALA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class I_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual O_TEHTA\n  \\class O_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_0 NUM_1 NUM_10 NUM_11\n  \\class O_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_2 NUM_4 NUM_5 NUM_8\n  \\class O_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT VAIA NUM_3 NUM_6 NUM_7\n  \\class O_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_9\n\\end\n\n\\beg virtual U_TEHTA\n  \\class U_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_0 NUM_1 NUM_10 NUM_11\n  \\class U_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_2 NUM_4 NUM_5 NUM_8\n  \\class U_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT VAIA NUM_6 NUM_7\n  \\class U_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual SEV_TEHTA\n  \\class SEV_TEHTA_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class SEV_TEHTA_S SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8\n  \\class SEV_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_5\n  \\class SEV_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_DOUBLE\n  \\class A_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class A_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class A_TEHTA_DOUBLE_L AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class A_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE\n  \\class E_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_10 NUM_11\n  \\class E_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_8\n  \\class E_TEHTA_DOUBLE_L AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA YANTA VAIA NUM_2 NUM_6 NUM_7\n  \\class E_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual I_TEHTA_DOUBLE Y_TEHTA\n  \\class I_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_4 NUM_10 NUM_11\n  \\class I_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_5 NUM_8\n  \\class I_TEHTA_DOUBLE_L AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA YANTA VALA_W_HOOK NUM_2 NUM_6 NUM_7\n  \\class I_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_DOUBLE\n  \\class O_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class O_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_5 NUM_8\n  \\class O_TEHTA_DOUBLE_L AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA YANTA VAIA NUM_2 NUM_6 NUM_7\n  \\class O_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_DOUBLE\n  \\class U_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED NUM_0 NUM_1 NUM_4 NUM_10 NUM_11\n  \\class U_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE ANNA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_5 NUM_8\n  \\class U_TEHTA_DOUBLE_L AHA HWESTA VALA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA YANTA VAIA NUM_2 NUM_6 NUM_7\n  \\class U_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_INF\n  \\class THINF_TDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_TDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8 NUM_10 NUM_11\n  \\class THINF_TDOT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_5 NUM_7\n  \\class THINF_TDOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_INF\n  \\class THINF_ACCENT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT HARP_SHAPED\n  \\class THINF_ACCENT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8 NUM_11\n  \\class THINF_ACCENT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_7 NUM_10\n  \\class THINF_ACCENT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual CIRC_TEHTA_INF\n  \\class TH_SUB_CIRC_XS TELCO ARA HALLA TINCO PARMA SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TH_SUB_CIRC_S CALMA QUESSE TW_EXT_13 TW_EXT_14 LAMBE ALDA VAIA NUM_2 NUM_5\n  \\class TH_SUB_CIRC_L VALA_W_HOOK NUM_3\n  \\class TH_SUB_CIRC_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_6 NUM_9\n\\end\n\n\\beg virtual THINNAS SEV_TEHTA_INF THINF_STROKE\n  \\class THINF_STROKE_XS TELCO ARA HALLA SILME_NUQUERNA SILME_NUQUERNA_ALT SHOOK_BEAUTIFUL\n  \\class THINF_STROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME ESSE URE OSSE HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_10 NUM_11\n  \\class THINF_STROKE_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_5 NUM_8\n  \\class THINF_STROKE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_INF\n  \\class THINF_CURL_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT SHOOK_BEAUTIFUL\n  \\class THINF_CURL_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME ESSE ESSE_NUQUERNA URE OSSE HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_CURL_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA HYARMEN HWESTA_SINDARINWA YANTA VALA_W_HOOK NUM_2 NUM_5\n  \\class THINF_CURL_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_INF\n  \\class THINF_CURL_INV_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO\n  \\class THINF_CURL_INV_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME ESSE ESSE_NUQUERNA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_CURL_INV_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_5\n  \\class THINF_CURL_INV_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual PALATAL_SIGN I_TEHTA_DOUBLE_INF Y_TEHTA_INF\n  \\class THINF_DDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO\n  \\class THINF_DDOT_S TINCO PARMA SULE AHA TW_EXT_11 TW_EXT_12 SILME URE OSSE NUM_0 NUM_1 NUM_8 NUM_10 NUM_11\n  \\class THINF_DDOT_L FORMEN HWESTA ORE VALA ANNA VILYA ESSE HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_4 NUM_5\n  \\class THINF_DDOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA ESSE_NUQUERNA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n  \\class LAMBE_MARK_DDOT LAMBE SILME_NUQUERNA_ALT NUM_7\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n  \\class THINF_DSTROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED\n  \\class THINF_DSTROKE_S TINCO PARMA SULE AHA TW_EXT_11 TW_EXT_12 SILME URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8 NUM_10 NUM_11\n  \\class THINF_DSTROKE_L FORMEN HWESTA ORE VALA ANNA VILYA ESSE HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2 NUM_5 NUM_7\n  \\class THINF_DSTROKE_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA ESSE_NUQUERNA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n  \\class LAMBE_MARK_DSTROKE LAMBE SILME_NUQUERNA_ALT\n\\end\n\n\\beg virtual UNUTIXE I_TEHTA_INF NO_VOWEL_DOT\n  \\class THINF_DOT_XS TELCO ARA HALLA SILME_NUQUERNA SHOOK_BEAUTIFUL HARP_SHAPED\n  \\class THINF_DOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 ROMEN ARDA URE OSSE AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_DOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME ESSE HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_2\n  \\class THINF_DOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 ALDA ESSE_NUQUERNA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DOT LAMBE SILME_NUQUERNA_ALT\n\\end\n\n\\beg virtual GEMINATE_SIGN\n  \\class DASH_INF_XS TELCO ARA HALLA\n  \\class DASH_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED NUM_0 NUM_1 NUM_2 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_3 NUM_9\n  \\class LAMBE_MARK_DASH LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN_TILD\n  \\class TILD_INF_XS TELCO ARA HALLA\n  \\class TILD_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED NUM_0 NUM_1 NUM_2 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_3 NUM_9\n  \\class LAMBE_MARK_TILD LAMBE ALDA\n\\end\n\n\\beg virtual NASALIZE_SIGN\n  \\class DASH_SUP_XS TELCO ARA HALLA\n  \\class DASH_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK HARP_SHAPED NUM_0 NUM_1 NUM_2 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_3 NUM_9\n\\end\n\n\\beg virtual NASALIZE_SIGN_TILD\n  \\class TILD_SUP_XS TELCO ARA HALLA\n  \\class TILD_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK HARP_SHAPED NUM_0 NUM_1 NUM_2 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED AHA_TINCO HWESTA_TINCO NUM_3 NUM_9\n\\end\n\n\\beg virtual ALVEOLAR_SIGN\n  \\class SHOOK_LEFT_L CALMA QUESSE ANGA UNGWE TW_EXT_13 TW_EXT_14 TW_EXT_23 TW_EXT_24 HWESTA_SINDARINWA VALA_W_HOOK\n  \\class SHOOK_RIGHT_L TELCO ARA HALLA TINCO PARMA ANDO UMBAR SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_21 TW_EXT_22 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN YANTA URE OSSE VAIA MALTA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n\\end\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_ds_parmaite"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset for Dan Smith layout based fonts **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.6\" \"Added VALA_W_HOOK, VAIYA. Moved A_TEHTA_INV_L due to soft hyphen bug.\"\n  \\entry \"0.0.6\" \"Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara. / Added pustar combinations (4/4-halfed/4-squared/5)\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"  \n\\end\n\n\\**   **\\ \\char 20 SPACE              \n\\** ! **\\ \\char 21 TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT                    \n\\** \" **\\ \\char 22 DASH_INF_L            \n\\** # **\\ \\char 23 A_TEHTA_XL          \n\\** $ **\\ \\char 24 E_TEHTA_XL   \n\\** % **\\ \\char 25 I_TEHTA_XL     \n\\** & **\\ \\char 26 U_TEHTA_XL        \n\\** \' **\\ \\char 27 DASH_INF_S            \n\\** ( **\\ \\char 28 ?                \n\\** ) **\\ \\char 29 TILD_XSUP_L           \n\\** * **\\ \\char 2a ?                \n\\** + **\\ \\char 2b SHOOK_RIGHT_L          \n\\** , **\\ \\char 2c TW_84 ESSE_NUQUERNA       \n\\** - **\\ \\char 2d PUNCT_DDOT            \n\\** . **\\ \\char 2e TW_94 URE            \n\\** / **\\ \\char 2f TILD_XINF_S           \n\\** 0 **\\ \\char 30 TILD_XSUP_S           \n\\** 1 **\\ \\char 31 TW_11 TINCO           \n\\** 2 **\\ \\char 32 TW_21 ANDO           \n\\** 3 **\\ \\char 33 TW_31 SULE THULE        \n\\** 4 **\\ \\char 34 TW_41 ANTO           \n\\** 5 **\\ \\char 35 TW_51 NUMEN           \n\\** 6 **\\ \\char 36 TW_61 ORE            \n\\** 7 **\\ \\char 37 TW_71 ROMEN           \n\\** 8 **\\ \\char 38 TW_81 SILME           \n\\** 9 **\\ \\char 39 TW_91 HYARMEN          \n\\** : **\\ \\char 3a TILD_INF_L            \n\\** ; **\\ \\char 3b TILD_INF_S            \n\\** < **\\ \\char 3c ?  \\** Does not look compliant between DS and Annatar **\\\n\\** = **\\ \\char 3d PUNCT_DOT            \n\\** > **\\ \\char 3e ?                \n\\** ? **\\ \\char 3f TILD_XINF_L           \n\\** @ **\\ \\char 40 TW_EXT_21 ANDO_EXT ANTO_EXT            \n\\** A **\\ \\char 41 TW_EXT_13 CALMA_EXT AHA_EXT            \n\\** B **\\ \\char 42 I_TEHTA_XS     \n\\** C **\\ \\char 43 A_TEHTA_XS          \n\\** D **\\ \\char 44 A_TEHTA_S           \n\\** E **\\ \\char 45 A_TEHTA_L           \n\\** F **\\ \\char 46 E_TEHTA_S    \n\\** G **\\ \\char 47 I_TEHTA_S           \n\\** H **\\ \\char 48 O_TEHTA_S           \n\\** I **\\ \\char 49 SILME_NUQUERNA_ALT \\** Used for y in s. beleriand **\\                \n\\** J **\\ \\char 4a U_TEHTA_S         \n\\** K **\\ \\char 4b ?                \n\\** L **\\ \\char 4c LAMBE_MARK_DOT                \n\\** M **\\ \\char 4d U_TEHTA_XS        \n\\** N **\\ \\char 4e O_TEHTA_XS          \n\\** O **\\ \\char 4f ?                \n\\** P **\\ \\char 50 TILD_SUP_L            \n\\** Q **\\ \\char 51 TW_EXT_12 PARMA_EXT FORMEN_EXT            \n\\** R **\\ \\char 52 E_TEHTA_L          \n\\** S **\\ \\char 53 TW_EXT_23 ANGA_EXT ANCA_EXT            \n\\** T **\\ \\char 54 I_TEHTA_L           \n\\** U **\\ \\char 55 U_TEHTA_L         \n\\** V **\\ \\char 56 E_TEHTA_XS         \n\\** W **\\ \\char 57 TW_EXT_22 UMBAR_EXT AMPA_EXT            \n\\** X **\\ \\char 58 TW_EXT_24 UNQUE_EXT UNGWE_EXT            \n\\** Y **\\ \\char 59 O_TEHTA_L           \n\\** Z **\\ \\char 5a TW_EXT_14 QUESSE_EXT HWESTA_EXT            \n\\** [ **\\ \\char 5b DASH_SUP_S            \n\\** \\ **\\ \\char 5c TILD_L              \n\\** ] **\\ \\char 5d OSSE               \n\\** ^ **\\ \\char 5e O_TEHTA_XL          \n\\** _ **\\ \\char 5f SHOOOK_RIGHT_S          \n\\** ` **\\ \\char 60 TELCO              \n\\** a **\\ \\char 61 TW_13 CALMA          \n\\** b **\\ \\char 62 TW_54 NWALME          \n\\** c **\\ \\char 63 TW_34 HWESTA          \n\\** d **\\ \\char 64 TW_33 AHA           \n\\** e **\\ \\char 65 TW_32 FORMEN          \n\\** f **\\ \\char 66 TW_43 ANCA           \n\\** g **\\ \\char 67 TW_53 NOLDO          \n\\** h **\\ \\char 68 TW_63 ANNA           \n\\** i **\\ \\char 69 TW_82 SILME_NUQUERNA      \n\\** j **\\ \\char 6a TW_73 LAMBE          \n\\** k **\\ \\char 6b TW_83 ESSE           \n\\** l **\\ \\char 6c TW_93 YANTA          \n\\** m **\\ \\char 6d TW_74 ALDA           \n\\** n **\\ \\char 6e TW_64 VILYA          \n\\** o **\\ \\char 6f TW_92 HWESTA_SINDARINWA    \n\\** p **\\ \\char 70 TILD_SUP_S           \n\\** q **\\ \\char 71 TW_12 PARMA          \n\\** r **\\ \\char 72 TW_42 AMPA           \n\\** s **\\ \\char 73 TW_23 ANGA           \n\\** t **\\ \\char 74 TW_52 MALTA          \n\\** u **\\ \\char 75 TW_72 ARDA           \n\\** v **\\ \\char 76 TW_44 UNQUE          \n\\** w **\\ \\char 77 TW_22 UMBAR          \n\\** x **\\ \\char 78 TW_24 UNGWE          \n\\** y **\\ \\char 79 TW_62 VALA           \n\\** z **\\ \\char 7a TW_14 QUESSE          \n\\** { **\\ \\char 7b DASH_SUP_L           \n\\** | **\\ \\char 7c SHOOK_LEFT_L          \n\\** } **\\ \\char 7d SHOOK_LEFT_S          \n\\** ~ **\\ \\char 7e ARA              \n\\char a0 NBSP \n\\** ¡ **\\ \\char a1 ?                \n\\** ¢ **\\ \\char a2 ?                \n\\** £ **\\ \\char a3 SHOOK_BEAUTIFUL                \n\\** ¥ **\\ \\char a5 ?                \n\\** ¦ **\\ \\char a6 HWESTA_TINCO                \n\\** § **\\ \\char a7 AHA_TINCO                \n\\** ¨ **\\ \\char a8 TH_SUB_CIRC_S          \n\\** © **\\ \\char a9 TH_SUB_CIRC_XS          \n\\** ª **\\ \\char aa A_TEHTA_INV_XL        \n\\** « **\\ \\char ab DQUOT_OPEN            \n\\** ¬ **\\ \\char ac PUNCT_DTILD RING_MARK_L RING_MARK_R              \n     \n\\** ® **\\ \\char ae ?                \n\\** ¯ **\\ \\char af A_TEHTA_INV_S         \n\\** ° **\\ \\char b0 LAMBE_MARK_TILD                 \n\\** ± **\\ \\char b1 SQUOT_OPEN            \n\\** ² **\\ \\char b2 SQUOT_CLOSE           \n\\** ³ **\\ \\char b3 ?                \n\\** ´ **\\ \\char b4 LAMBE_MARK_DDOT         \n\\** µ **\\ \\char b5 A_TEHTA_INV_XS        \n\\** · **\\ \\char b7 ?                \n\\** ¸ **\\ \\char b8 LAMBE_MARK_DASH         \n\\** ¹ **\\ \\char b9 ?                \n\\** º **\\ \\char ba ?                \n\\** » **\\ \\char bb DQUOT_CLOSE           \n\\** ¼ **\\ \\char bc LIGATING_SHORT_CARRIER                \n\\** ½ **\\ \\char bd HALLA              \n\\** ¾ **\\ \\char be ?                \n\\** ¿ **\\ \\char bf ?                \n\\** À **\\ \\char c0 PUNCT_INTERR           \n\\** Á **\\ \\char c1 PUNCT_EXCLAM           \n\\** Â **\\ \\char c2 PUNCT_TILD            \n\\** Ã **\\ \\char c3 ?                \n\\** Ä **\\ \\char c4 ?                \n\\** Å **\\ \\char c5 ?                \n\\** Æ **\\ \\char c6 ?                \n\\** Ç **\\ \\char c7 ?                \n\\** È **\\ \\char c8 THINF_DOT_XL           \n\\** É **\\ \\char c9 THINF_DOT_L           \n\\** Ê **\\ \\char ca THINF_DOT_S           \n\\** Ë **\\ \\char cb THINF_DOT_XS           \n\\** Ì **\\ \\char cc THINF_DDOT_XL          \n\\** Í **\\ \\char cd THINF_DDOT_L           \n\\** Î **\\ \\char ce THINF_DDOT_S           \n\\** Ï **\\ \\char cf THINF_DDOT_XS          \n\\** Ð **\\ \\char d0 THINF_TDOT_XL          \n\\** Ñ **\\ \\char d1 THINF_TDOT_L           \n\\** Ò **\\ \\char d2 THINF_TDOT_S           \n\\** Ó **\\ \\char d3 THINF_TDOT_XS          \n\\** Ô **\\ \\char d4 THSUP_DDOT_XL Y_TEHTA_XL I_TEHTA_DOUBLE_XL         \n\\** Õ **\\ \\char d5 THSUP_DDOT_L Y_TEHTA_L I_TEHTA_DOUBLE_L       \n\\** Ö **\\ \\char d6 THSUP_DDOT_S Y_TEHTA_S I_TEHTA_DOUBLE_S          \n\\** × **\\ \\char d7 THSUP_DDOT_XS Y_TEHTA_XS I_TEHTA_DOUBLE_XS         \n\\** Ø **\\ \\char d8 THSUP_TICK_XL          \n\\** Ù **\\ \\char d9 THSUP_TICK_L           \n\\** Ú **\\ \\char da THSUP_TICK_S           \n\\** Û **\\ \\char db THSUP_TICK_XS          \n\\** Ü **\\ \\char dc THSUP_TICK_INV_XL A_TEHTA_CIRCUM_XL       \n\\** Ý **\\ \\char dd THSUP_TICK_INV_L A_TEHTA_CIRCUM_L        \n\\** Þ **\\ \\char de THSUP_TICK_INV_S A_TEHTA_CIRCUM_S         \n\\** ß **\\ \\char df THSUP_TICK_INV_XS A_TEHTA_CIRCUM_XS       \n\\** à **\\ \\char e0 THSUP_LAMBDA_XL         \n\\** á **\\ \\char e1 THSUP_LAMBDA_L          \n\\** â **\\ \\char e2 THSUP_LAMBDA_S          \n\\** ã **\\ \\char e3 THSUP_LAMBDA_XS         \n\\** ä **\\ \\char e4 THINF_CURL_XL          \n\\** å **\\ \\char e5 THINF_CURL_L           \n\\** æ **\\ \\char e6 THINF_CURL_S           \n\\** ç **\\ \\char e7 THINF_CURL_XS          \n\\** è **\\ \\char e8 SEV_TEHTA_XL           \n\\** é **\\ \\char e9 SEV_TEHTA_L           \n\\** ê **\\ \\char ea SEV_TEHTA_S           \n\\** ë **\\ \\char eb SEV_TEHTA_XS           \n\\** ì **\\ \\char ec ?                                 \n\\** í **\\ \\char ed ?                                 \n\\** î **\\ \\char ee ?                                 \n\\** ï **\\ \\char ef ?                                 \n\\** ð **\\ \\char f0 NUM_0                               \n\\** ñ **\\ \\char f1 NUM_1                               \n\\** ò **\\ \\char f2 NUM_2                               \n\\** ó **\\ \\char f3 NUM_3                               \n\\** ô **\\ \\char f4 NUM_4                               \n\\** õ **\\ \\char f5 NUM_5                               \n\\** ö **\\ \\char f6 NUM_6                               \n\\** ÷ **\\ \\char f7 NUM_7                               \n\\** ø **\\ \\char f8 NUM_8                               \n\\** ù **\\ \\char f9 NUM_9                               \n\\** ú **\\ \\char fa NUM_10                               \n\\** û **\\ \\char fb NUM_11                               \n\\** ü **\\ \\char fc THINF_STROKE_XL                                 \n\\** ý **\\ \\char fd THINF_STROKE_L                                 \n\\** þ **\\ \\char fe THINF_STROKE_S                                 \n\\** ÿ **\\ \\char ff THINF_STROKE_XS      \n\n\\** FIX FOR SOFT HYPHEN **\\\n\\char 109 A_TEHTA_INV_L\n\n\\** USING TENGWAR ELFICA POS TO AVOID PROBLEMS **\\\n\\char 125 VAIA WAIA VAIYA\n                           \n\\** Œ **\\ \\char 152 PUNCT_PAREN_L                           \n\\** œ **\\ \\char 153 PUNCT_PAREN_R                           \n\\** Š **\\ \\char 160 THINF_ACCENT_L                                 \n\\** š **\\ \\char 161 MALTA_W_HOOK TW_MH                                \n\\** Ÿ **\\ \\char 178 THINF_ACCENT_XS                                 \n\\** ƒ **\\ \\char 192 THINF_DSTROKE_XL          \n\n\\char 200 DASH_INF_XS\n\\char 201 TILD_INF_XS\n\\char 202 DASH_SUP_XS\n\\char 203 TILD_SUP_XS\n\n\\char 181 PUSTA_4\n\\char 182 PUSTA_5\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n                       \n\\** ˆ **\\ \\char 2c6 PUNCT_TDOT PUSTA_3                                \n\\** ˜ **\\ \\char 2dc TH_SUB_CIRC_XL                                 \n\\** – **\\ \\char 2013 ANCA_CLOSED SILME_AHA                                \n\\** — **\\ \\char 2014 OLD_ENGLISH_AND                                \n\\** ‘ **\\ \\char 2018 THINF_CURL_INV_XL                                \n\\** ’ **\\ \\char 2019 THINF_CURL_INV_L                                \n\\** ‚ **\\ \\char 201a LAMBE_MARK_DSTROKE                                \n\\** “ **\\ \\char 201c THINF_CURL_INV_S                                \n\\** ” **\\ \\char 201d THINF_CURL_INV_XS                                \n\\** „ **\\ \\char 201e THINF_DSTROKE_L                                \n\\** † **\\ \\char 2020 THINF_DSTROKE_XS                                \n\\** ‡ **\\ \\char 2021 ?                                \n\\** • **\\ \\char 2022 TW_HW_LOWDHAM HARP_SHAPED                                \n\\** … **\\ \\char 2026 THINF_DSTROKE_S                                \n\\** ‰ **\\ \\char 2030 THINF_ACCENT_XL                                \n\\** ‹ **\\ \\char 2039 THINF_ACCENT_S                                \n\\** › **\\ \\char 203a BOOKMARK_SIGN                                \n\\** ™ **\\ \\char 2122 TH_SUB_CIRC_L       \n\n\\char 2FFC E_TEHTA_GRAVE_XL\n\\char 2FFD E_TEHTA_GRAVE_XS\n\\char 2FFE E_TEHTA_GRAVE_L\n\\char 2FFF E_TEHTA_GRAVE_S\n\n                         \n\\** 〠 **\\ \\char 3020 ?                                \n\\** 〡 **\\ \\char 3021 ?                                \n\\** 〣 **\\ \\char 3023 A_TEHTA_DOUBLE_XL                                \n\\** 〤 **\\ \\char 3024 E_TEHTA_DOUBLE_XL                                \n\\** 〦 **\\ \\char 3026 U_TEHTA_DOUBLE_XL     \n                                                   \n\\** 〰 **\\ \\char 3030 ?                                \n\\** 〱 **\\ \\char 3031 ?                                \n\\** 〲 **\\ \\char 3032 ?                                \n\\** 〳 **\\ \\char 3033 ?                                \n\\** 〴 **\\ \\char 3034 ?                                \n\\** 〵 **\\ \\char 3035 ?                                \n\\** 〶 **\\ \\char 3036 ?                                \n\\** 〷 **\\ \\char 3037 ?                                \n\\** 〸 **\\ \\char 3038 ?                                \n\\** 〹 **\\ \\char 3039 ?                                \n\\** 〼 **\\ \\char 303c ?                                \n\\** ぀ **\\ \\char 3040 ?                                \n\\** ぃ **\\ \\char 3043 A_TEHTA_DOUBLE_XS                                \n\\** い **\\ \\char 3044 A_TEHTA_DOUBLE_S                                \n\\** ぅ **\\ \\char 3045 A_TEHTA_DOUBLE_L                                \n\\** う **\\ \\char 3046 E_TEHTA_DOUBLE_XS                                \n\\** え **\\ \\char 3048 O_TEHTA_DOUBLE_S                                \n\\** お **\\ \\char 304a U_TEHTA_DOUBLE_S                                \n\\** き **\\ \\char 304d U_TEHTA_DOUBLE_XS                                \n\\** ぎ **\\ \\char 304e O_TEHTA_DOUBLE_XS                                \n\\** け **\\ \\char 3051 ?                                \n\\** げ **\\ \\char 3052 E_TEHTA_DOUBLE_L                                \n\\** さ **\\ \\char 3055 U_TEHTA_DOUBLE_L                                \n\\** ざ **\\ \\char 3056 E_TEHTA_DOUBLE_S                                \n\\** し **\\ \\char 3057 ?                                \n\\** す **\\ \\char 3059 O_TEHTA_DOUBLE_L                                \n\\** ぞ **\\ \\char 305e O_TEHTA_DOUBLE_XL                                \n\\** ぢ **\\ \\char 3062 ?                                \n\\** づ **\\ \\char 3065 ?                                \n\\** と **\\ \\char 3068 ?                                \n\\** な **\\ \\char 306a LAMBE_LIG                                \n\\** の **\\ \\char 306e ?                                \n\\** ぱ **\\ \\char 3071 ?                                \n\\** ひ **\\ \\char 3072 ?                                \n\\** ぴ **\\ \\char 3074 ?                                \n\\** ふ **\\ \\char 3075 ?                                \n\\** ぷ **\\ \\char 3077 ?                                \n\\** へ **\\ \\char 3078 ?                                \n\\** べ **\\ \\char 3079 ?                                \n\\** ぺ **\\ \\char 307a ?                                \n\\** ア **\\ \\char 30a2 ?                                \n\\** カ **\\ \\char 30ab ?                                \n\\** ギ **\\ \\char 30ae ?                                \n\\** セ **\\ \\char 30bb ?                                \n\\** タ **\\ \\char 30bf ?                                \n\\** ツ **\\ \\char 30c4 ?                                \n\\** テ **\\ \\char 30c6 ?                                \n\\** デ **\\ \\char 30c7 ?                                \n\\** ヘ **\\ \\char 30d8 ?                                \n\\** ベ **\\ \\char 30d9 ?                                \n\\** ペ **\\ \\char 30da ?                                \n\\** ホ **\\ \\char 30db ?                                \n\\** ム **\\ \\char 30e0 ?                                \n\\** メ **\\ \\char 30e1 ?                                \n\\** モ **\\ \\char 30e2 ?                                \n\\** ャ **\\ \\char 30e3 ?                                \n\\** ヨ **\\ \\char 30e8 ?                                \n\\** ラ **\\ \\char 30e9 ?                                \n\\** リ **\\ \\char 30ea ?                                \n\\** ル **\\ \\char 30eb ? \n\\** **\\ \\char 3152 PUNCT_PAREN_L_ALT                                \n\\** **\\ \\char 3153 PUNCT_PAREN_R_ALT                                                               \n\\** ㅠ **\\ \\char 3160 ?                                \n\n\\char 3161 VALA_W_HOOK TW_MH_BELERIANDIC       \n                    \n\\** ㅸ **\\ \\char 3178 ?                                \n\\** ㆒ **\\ \\char 3192 ?                                \n\\** 倚 **\\ \\char 501a ?                                \n\\** 倞 **\\ \\char 501e ?                                \n\\** 倠 **\\ \\char 5020 ?                                \n\\** 倢 **\\ \\char 5022 ?                                \n\\** 倦 **\\ \\char 5026 ?                                \n\\** 倰 **\\ \\char 5030 ?                                \n\\** 倹 **\\ \\char 5039 ?\n\n\n\\** The following virtual chars are used to handle tehtar (& the like) multiple version chosing **\\\n\\** It could be avoided with modern fonts with gsub/gpos tables for ligatures and diacritics **\\\n\\** placement **\\\n\n\n\\** DUMPED FROM THE VIRTUAL CHARS TOOL **\\\n\n\\beg virtual A_TEHTA\n  \\class A_TEHTA_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class A_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN TW_EXT_11 TW_EXT_12 ROMEN ARDA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4\n  \\class A_TEHTA_L AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5\n  \\class A_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM\n  \\class A_TEHTA_CIRCUM_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class A_TEHTA_CIRCUM_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_1 NUM_4\n  \\class A_TEHTA_CIRCUM_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_2 NUM_5 NUM_7 NUM_9\n  \\class A_TEHTA_CIRCUM_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6\n\\end\n\n\\beg virtual A_TEHTA_REVERSED\n  \\class A_TEHTA_INV_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class A_TEHTA_INV_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4\n  \\class A_TEHTA_INV_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7\n  \\class A_TEHTA_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM_REVERSED TEHTA_BREVE\n  \\class THSUP_TICK_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class THSUP_TICK_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4\n  \\class THSUP_TICK_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7\n  \\class THSUP_TICK_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA\n  \\class E_TEHTA_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class E_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4\n  \\class E_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7\n  \\class E_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_GRAVE\n  \\class E_TEHTA_GRAVE_XS TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7\n  \\class E_TEHTA_GRAVE_S TELCO ARA HALLA SULE FORMEN TW_EXT_11 TW_EXT_12 OSSE HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class E_TEHTA_GRAVE_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA ESSE HYARMEN HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9 NUM_10 NUM_11\n  \\class E_TEHTA_GRAVE_XL \n\\end\n\n\\beg virtual I_TEHTA\n  \\class I_TEHTA_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class I_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_1 NUM_4\n  \\class I_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_5 NUM_7 NUM_9\n  \\class I_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6\n\\end\n\n\\beg virtual O_TEHTA\n  \\class O_TEHTA_XS TELCO ARA HALLA HYARMEN NUM_10 NUM_11\n  \\class O_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_8\n  \\class O_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_9\n  \\class O_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_5 NUM_6 NUM_7\n\\end\n\n\\beg virtual U_TEHTA\n  \\class U_TEHTA_XS TELCO ARA HALLA HYARMEN NUM_10 NUM_11\n  \\class U_TEHTA_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class U_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_2 NUM_3 NUM_5 NUM_9\n  \\class U_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_6 NUM_7\n\\end\n\n\\beg virtual SEV_TEHTA\n  \\class SEV_TEHTA_XS TELCO ARA HALLA SULE FORMEN TW_EXT_11 TW_EXT_12 HYARMEN HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8 NUM_10 NUM_11\n  \\class SEV_TEHTA_S TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VAIA VALA_W_HOOK NUM_0 NUM_1\n  \\class SEV_TEHTA_L AHA HWESTA TW_EXT_13 TW_EXT_14 SHOOK_BEAUTIFUL NUM_2 NUM_5 NUM_7 NUM_9\n  \\class SEV_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6\n\\end\n\n\\beg virtual A_TEHTA_DOUBLE\n  \\class A_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN NUM_4 NUM_8 NUM_10 NUM_11\n  \\class A_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 OSSE HARP_SHAPED AHA_TINCO HWESTA_TINCO\n  \\class A_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5\n  \\class A_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE\n  \\class E_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN NUM_8 NUM_10 NUM_11\n  \\class E_TEHTA_DOUBLE_S TW_EXT_11\n  \\class E_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1\n  \\class E_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual I_TEHTA_DOUBLE Y_TEHTA\n  \\class I_TEHTA_DOUBLE_XS TELCO ARA HALLA SULE FORMEN TW_EXT_11 TW_EXT_12 HYARMEN HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8 NUM_10 NUM_11\n  \\class I_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE ORE VALA ANNA VILYA ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_1\n  \\class I_TEHTA_DOUBLE_L AHA HWESTA TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT VAIA NUM_0 NUM_2 NUM_5 NUM_9\n  \\class I_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_7\n\\end\n\n\\beg virtual O_TEHTA_DOUBLE\n  \\class O_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN NUM_10 NUM_11\n  \\class O_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class O_TEHTA_DOUBLE_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_5 NUM_7\n  \\class O_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_DOUBLE\n  \\class U_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN NUM_10 NUM_11\n  \\class U_TEHTA_DOUBLE_S TINCO PARMA CALMA QUESSE SULE FORMEN ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 ROMEN ARDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_8\n  \\class U_TEHTA_DOUBLE_L AHA HWESTA TW_EXT_13 TW_EXT_14 VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_4 NUM_5\n  \\class U_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 LAMBE ALDA SILME ESSE HWESTA_SINDARINWA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_INF\n  \\class THINF_TDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED NUM_8\n  \\class THINF_TDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_6 NUM_7\n  \\class THINF_TDOT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_4 NUM_10 NUM_11\n  \\class THINF_TDOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_INF\n  \\class THINF_ACCENT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_ACCENT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_1 NUM_4 NUM_6 NUM_7 NUM_8 NUM_11\n  \\class THINF_ACCENT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_2 NUM_5 NUM_9 NUM_10\n  \\class THINF_ACCENT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3\n\\end\n\n\\beg virtual CIRC_TEHTA_INF\n  \\class TH_SUB_CIRC_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class TH_SUB_CIRC_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6 NUM_8\n  \\class TH_SUB_CIRC_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_7 NUM_10 NUM_11\n  \\class TH_SUB_CIRC_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_9\n\\end\n\n\\beg virtual THINNAS SEV_TEHTA_INF THINF_STROKE\n  \\class THINF_STROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_STROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6 NUM_7 NUM_8\n  \\class THINF_STROKE_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_10 NUM_11\n  \\class THINF_STROKE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_INF\n  \\class THINF_CURL_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_CURL_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_CURL_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_5 NUM_9\n  \\class THINF_CURL_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3\n\\end\n\n\\beg virtual U_TEHTA_INF\n  \\class THINF_CURL_INV_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_CURL_INV_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_CURL_INV_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 LAMBE ALDA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n  \\class THINF_CURL_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3\n\\end\n\n\\beg virtual PALATAL_SIGN I_TEHTA_DOUBLE_INF Y_TEHTA_INF\n  \\class THINF_DDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED NUM_8\n  \\class THINF_DDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6\n  \\class THINF_DDOT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_9 NUM_10 NUM_11\n  \\class THINF_DDOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5\n  \\class LAMBE_MARK_DDOT LAMBE ALDA NUM_7\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n  \\class THINF_DSTROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_DSTROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6 NUM_7 NUM_8\n  \\class THINF_DSTROKE_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_10 NUM_11\n  \\class THINF_DSTROKE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_9\n  \\class LAMBE_MARK_DSTROKE LAMBE ALDA\n\\end\n\n\\beg virtual UNUTIXE I_TEHTA_INF NO_VOWEL_DOT\n  \\class THINF_DOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_DOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SILME URE OSSE SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4 NUM_6 NUM_7 NUM_8\n  \\class THINF_DOT_L CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA VAIA VALA_W_HOOK NUM_0 NUM_1 NUM_2 NUM_10 NUM_11\n  \\class THINF_DOT_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_5 NUM_9\n  \\class LAMBE_MARK_DOT LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN\n  \\class DASH_INF_XS TELCO ARA HALLA\n  \\class DASH_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DASH LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN_TILD\n  \\class TILD_INF_XS TELCO ARA HALLA\n  \\class TILD_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_TILD LAMBE ALDA\n\\end\n\n\\beg virtual NASALIZE_SIGN\n  \\class DASH_SUP_XS TELCO ARA HALLA\n  \\class DASH_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual NASALIZE_SIGN_TILD\n  \\class TILD_SUP_XS TELCO ARA HALLA\n  \\class TILD_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VAIA VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual ALVEOLAR_SIGN\n  \\class SHOOK_LEFT_L CALMA QUESSE ANGA UNGWE TW_EXT_13 TW_EXT_14 TW_EXT_23 TW_EXT_24 HWESTA_SINDARINWA NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class SHOOK_RIGHT_L TELCO ARA HALLA TINCO PARMA ANDO UMBAR SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_21 TW_EXT_22 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN YANTA URE OSSE VAIA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_ds_sindarin"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset for Dan Smith layout based fonts **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.5\" \"Added VALA_W_HOOK, VAIYA. Moved A_TEHTA_INV_L due to soft hyphen bug.\"\n  \\entry \"0.0.6\" \"Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara. / Added pustar combinations (4/4-halfed/4-squared/5)\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"  \n\\end\n\n\\**   **\\ \\char 20 SPACE              \n\\** ! **\\ \\char 21 TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT                    \n\\** \" **\\ \\char 22 DASH_INF_L            \n\\** # **\\ \\char 23 A_TEHTA_XL          \n\\** $ **\\ \\char 24 E_TEHTA_XL   \n\\** % **\\ \\char 25 I_TEHTA_XL     \n\\** & **\\ \\char 26 U_TEHTA_XL        \n\\** \' **\\ \\char 27 DASH_INF_S            \n\\** ( **\\ \\char 28 ?                \n\\** ) **\\ \\char 29 TILD_XSUP_L           \n\\** * **\\ \\char 2a ?                \n\\** + **\\ \\char 2b SHOOK_RIGHT_L          \n\\** , **\\ \\char 2c TW_84 ESSE_NUQUERNA       \n\\** - **\\ \\char 2d PUNCT_DDOT            \n\\** . **\\ \\char 2e TW_94 URE            \n\\** / **\\ \\char 2f TILD_XINF_S           \n\\** 0 **\\ \\char 30 TILD_XSUP_S           \n\\** 1 **\\ \\char 31 TW_11 TINCO           \n\\** 2 **\\ \\char 32 TW_21 ANDO           \n\\** 3 **\\ \\char 33 TW_31 SULE THULE        \n\\** 4 **\\ \\char 34 TW_41 ANTO           \n\\** 5 **\\ \\char 35 TW_51 NUMEN           \n\\** 6 **\\ \\char 36 TW_61 ORE            \n\\** 7 **\\ \\char 37 TW_71 ROMEN           \n\\** 8 **\\ \\char 38 TW_81 SILME           \n\\** 9 **\\ \\char 39 TW_91 HYARMEN          \n\\** : **\\ \\char 3a TILD_INF_L            \n\\** ; **\\ \\char 3b TILD_INF_S            \n\\** < **\\ \\char 3c ?  \\** Does not look compliant between DS and Annatar **\\\n\\** = **\\ \\char 3d PUNCT_DOT            \n\\** > **\\ \\char 3e ?                \n\\** ? **\\ \\char 3f TILD_XINF_L           \n\\** @ **\\ \\char 40 TW_EXT_21 ANDO_EXT ANTO_EXT            \n\\** A **\\ \\char 41 TW_EXT_13 CALMA_EXT AHA_EXT            \n\\** B **\\ \\char 42 I_TEHTA_XS     \n\\** C **\\ \\char 43 A_TEHTA_XS          \n\\** D **\\ \\char 44 A_TEHTA_S           \n\\** E **\\ \\char 45 A_TEHTA_L           \n\\** F **\\ \\char 46 E_TEHTA_S    \n\\** G **\\ \\char 47 I_TEHTA_S           \n\\** H **\\ \\char 48 O_TEHTA_S           \n\\** I **\\ \\char 49 SILME_NUQUERNA_ALT \\** Used for y in s. beleriand **\\                \n\\** J **\\ \\char 4a U_TEHTA_S         \n\\** K **\\ \\char 4b ?                \n\\** L **\\ \\char 4c LAMBE_MARK_DOT                \n\\** M **\\ \\char 4d U_TEHTA_XS        \n\\** N **\\ \\char 4e O_TEHTA_XS          \n\\** O **\\ \\char 4f ?                \n\\** P **\\ \\char 50 TILD_SUP_L            \n\\** Q **\\ \\char 51 TW_EXT_12 PARMA_EXT FORMEN_EXT            \n\\** R **\\ \\char 52 E_TEHTA_L          \n\\** S **\\ \\char 53 TW_EXT_23 ANGA_EXT ANCA_EXT            \n\\** T **\\ \\char 54 I_TEHTA_L           \n\\** U **\\ \\char 55 U_TEHTA_L         \n\\** V **\\ \\char 56 E_TEHTA_XS         \n\\** W **\\ \\char 57 TW_EXT_22 UMBAR_EXT AMPA_EXT            \n\\** X **\\ \\char 58 TW_EXT_24 UNQUE_EXT UNGWE_EXT            \n\\** Y **\\ \\char 59 O_TEHTA_L           \n\\** Z **\\ \\char 5a TW_EXT_14 QUESSE_EXT HWESTA_EXT            \n\\** [ **\\ \\char 5b DASH_SUP_S            \n\\** \\ **\\ \\char 5c TILD_L              \n\\** ] **\\ \\char 5d OSSE               \n\\** ^ **\\ \\char 5e O_TEHTA_XL          \n\\** _ **\\ \\char 5f SHOOOK_RIGHT_S          \n\\** ` **\\ \\char 60 TELCO              \n\\** a **\\ \\char 61 TW_13 CALMA          \n\\** b **\\ \\char 62 TW_54 NWALME          \n\\** c **\\ \\char 63 TW_34 HWESTA          \n\\** d **\\ \\char 64 TW_33 AHA           \n\\** e **\\ \\char 65 TW_32 FORMEN          \n\\** f **\\ \\char 66 TW_43 ANCA           \n\\** g **\\ \\char 67 TW_53 NOLDO          \n\\** h **\\ \\char 68 TW_63 ANNA           \n\\** i **\\ \\char 69 TW_82 SILME_NUQUERNA      \n\\** j **\\ \\char 6a TW_73 LAMBE          \n\\** k **\\ \\char 6b TW_83 ESSE           \n\\** l **\\ \\char 6c TW_93 YANTA          \n\\** m **\\ \\char 6d TW_74 ALDA           \n\\** n **\\ \\char 6e TW_64 VILYA          \n\\** o **\\ \\char 6f TW_92 HWESTA_SINDARINWA    \n\\** p **\\ \\char 70 TILD_SUP_S           \n\\** q **\\ \\char 71 TW_12 PARMA          \n\\** r **\\ \\char 72 TW_42 AMPA           \n\\** s **\\ \\char 73 TW_23 ANGA           \n\\** t **\\ \\char 74 TW_52 MALTA          \n\\** u **\\ \\char 75 TW_72 ARDA           \n\\** v **\\ \\char 76 TW_44 UNQUE          \n\\** w **\\ \\char 77 TW_22 UMBAR          \n\\** x **\\ \\char 78 TW_24 UNGWE          \n\\** y **\\ \\char 79 TW_62 VALA           \n\\** z **\\ \\char 7a TW_14 QUESSE          \n\\** { **\\ \\char 7b DASH_SUP_L           \n\\** | **\\ \\char 7c SHOOK_LEFT_L          \n\\** } **\\ \\char 7d SHOOK_LEFT_S          \n\\** ~ **\\ \\char 7e ARA             \n\\char a0 NBSP  \n\\** ¡ **\\ \\char a1 ?                \n\\** ¢ **\\ \\char a2 ?                \n\\** £ **\\ \\char a3 SHOOK_BEAUTIFUL                \n\\** ¥ **\\ \\char a5 ?                \n\\** ¦ **\\ \\char a6 HWESTA_TINCO                \n\\** § **\\ \\char a7 AHA_TINCO                \n\\** ¨ **\\ \\char a8 TH_SUB_CIRC_S          \n\\** © **\\ \\char a9 TH_SUB_CIRC_XS          \n\\** ª **\\ \\char aa A_TEHTA_INV_XL        \n\\** « **\\ \\char ab DQUOT_OPEN            \n\\** ¬ **\\ \\char ac PUNCT_DTILD RING_MARK_L RING_MARK_R              \n\\** SOFT HYPEN BUG HERE **\\\n\\** ® **\\ \\char ae ?                \n\\** ¯ **\\ \\char af A_TEHTA_INV_S         \n\\** ° **\\ \\char b0 LAMBE_MARK_TILD               \n\\** ± **\\ \\char b1 SQUOT_OPEN            \n\\** ² **\\ \\char b2 SQUOT_CLOSE           \n\\** ³ **\\ \\char b3 ?                \n\\** ´ **\\ \\char b4 LAMBE_MARK_DDOT         \n\\** µ **\\ \\char b5 A_TEHTA_INV_XS        \n\\** · **\\ \\char b7 ?                \n\\** ¸ **\\ \\char b8 LAMBE_MARK_DASH           \n\\** ¹ **\\ \\char b9 ?                \n\\** º **\\ \\char ba ?                \n\\** » **\\ \\char bb DQUOT_CLOSE           \n\\** ¼ **\\ \\char bc LIGATING_SHORT_CARRIER                \n\\** ½ **\\ \\char bd HALLA              \n\\** ¾ **\\ \\char be ?                \n\\** ¿ **\\ \\char bf ?                \n\\** À **\\ \\char c0 PUNCT_INTERR           \n\\** Á **\\ \\char c1 PUNCT_EXCLAM           \n\\** Â **\\ \\char c2 PUNCT_TILD            \n\\** Ã **\\ \\char c3 ?                \n\\** Ä **\\ \\char c4 ?                \n\\** Å **\\ \\char c5 ?                \n\\** Æ **\\ \\char c6 ?                \n\\** Ç **\\ \\char c7 ?                \n\\** È **\\ \\char c8 THINF_DOT_XL           \n\\** É **\\ \\char c9 THINF_DOT_L           \n\\** Ê **\\ \\char ca THINF_DOT_S           \n\\** Ë **\\ \\char cb THINF_DOT_XS           \n\\** Ì **\\ \\char cc THINF_DDOT_XL          \n\\** Í **\\ \\char cd THINF_DDOT_L           \n\\** Î **\\ \\char ce THINF_DDOT_S           \n\\** Ï **\\ \\char cf THINF_DDOT_XS          \n\\** Ð **\\ \\char d0 THINF_TDOT_XL          \n\\** Ñ **\\ \\char d1 THINF_TDOT_L           \n\\** Ò **\\ \\char d2 THINF_TDOT_S           \n\\** Ó **\\ \\char d3 THINF_TDOT_XS          \n\\** Ô **\\ \\char d4 THSUP_DDOT_XL Y_TEHTA_XL I_TEHTA_DOUBLE_XL         \n\\** Õ **\\ \\char d5 THSUP_DDOT_L Y_TEHTA_L I_TEHTA_DOUBLE_L       \n\\** Ö **\\ \\char d6 THSUP_DDOT_S Y_TEHTA_S I_TEHTA_DOUBLE_S          \n\\** × **\\ \\char d7 THSUP_DDOT_XS Y_TEHTA_XS I_TEHTA_DOUBLE_XS         \n\\** Ø **\\ \\char d8 THSUP_TICK_XL          \n\\** Ù **\\ \\char d9 THSUP_TICK_L           \n\\** Ú **\\ \\char da THSUP_TICK_S           \n\\** Û **\\ \\char db THSUP_TICK_XS          \n\\** Ü **\\ \\char dc THSUP_TICK_INV_XL A_TEHTA_CIRCUM_XL       \n\\** Ý **\\ \\char dd THSUP_TICK_INV_L A_TEHTA_CIRCUM_L        \n\\** Þ **\\ \\char de THSUP_TICK_INV_S A_TEHTA_CIRCUM_S         \n\\** ß **\\ \\char df THSUP_TICK_INV_XS A_TEHTA_CIRCUM_XS       \n\\** à **\\ \\char e0 THSUP_LAMBDA_XL         \n\\** á **\\ \\char e1 THSUP_LAMBDA_L          \n\\** â **\\ \\char e2 THSUP_LAMBDA_S          \n\\** ã **\\ \\char e3 THSUP_LAMBDA_XS         \n\\** ä **\\ \\char e4 THINF_CURL_XL          \n\\** å **\\ \\char e5 THINF_CURL_L           \n\\** æ **\\ \\char e6 THINF_CURL_S           \n\\** ç **\\ \\char e7 THINF_CURL_XS          \n\\** è **\\ \\char e8 SEV_TEHTA_XL           \n\\** é **\\ \\char e9 SEV_TEHTA_L           \n\\** ê **\\ \\char ea SEV_TEHTA_S           \n\\** ë **\\ \\char eb SEV_TEHTA_XS           \n\\** ì **\\ \\char ec ?                                 \n\\** í **\\ \\char ed ?                                 \n\\** î **\\ \\char ee ?                                 \n\\** ï **\\ \\char ef ?                                 \n\\** ð **\\ \\char f0 NUM_0                               \n\\** ñ **\\ \\char f1 NUM_1                               \n\\** ò **\\ \\char f2 NUM_2                               \n\\** ó **\\ \\char f3 NUM_3                               \n\\** ô **\\ \\char f4 NUM_4                               \n\\** õ **\\ \\char f5 NUM_5                               \n\\** ö **\\ \\char f6 NUM_6                               \n\\** ÷ **\\ \\char f7 NUM_7                               \n\\** ø **\\ \\char f8 NUM_8                               \n\\** ù **\\ \\char f9 NUM_9                               \n\\** ú **\\ \\char fa NUM_10                               \n\\** û **\\ \\char fb NUM_11                               \n\\** ü **\\ \\char fc THINF_STROKE_XL                                 \n\\** ý **\\ \\char fd THINF_STROKE_L                                 \n\\** þ **\\ \\char fe THINF_STROKE_S                                 \n\\** ÿ **\\ \\char ff THINF_STROKE_XS     \n\n\\** FIX FOR SOFT HYPHEN **\\\n\\char 109 A_TEHTA_INV_L\n\n\\** USING TENGWAR ELFICA POS TO AVOID PROBLEMS **\\\n\\char 110 E_TEHTA_GRAVE_XL\n\\char 111 E_TEHTA_GRAVE_L\n\\char 112 E_TEHTA_GRAVE_S\n\\char 113 E_TEHTA_GRAVE_XS\n\n\n\\** USING TENGWAR ELFICA POS TO AVOID PROBLEMS **\\\n\\char 125 VAIA WAIA VAIYA\n                            \n\\** Œ **\\ \\char 152 PUNCT_PAREN_L                           \n\\** œ **\\ \\char 153 PUNCT_PAREN_R                           \n\\** Š **\\ \\char 160 THINF_ACCENT_L                                 \n\\** š **\\ \\char 161 MALTA_W_HOOK TW_MH                                 \n\\** Ÿ **\\ \\char 178 THINF_ACCENT_XS                                 \n\\** ƒ **\\ \\char 192 THINF_DSTROKE_XL               \n\n\\char 200 DASH_INF_XS\n\\char 201 TILD_INF_XS\n\\char 202 DASH_SUP_XS\n\\char 203 TILD_SUP_XS\n\n\\char 204 THINF_CURL_INV_XL\n\\char 205 THINF_CURL_INV_L\n\\char 206 THINF_CURL_INV_S\n\\char 207 THINF_CURL_INV_XS\n\n\\char 181 PUSTA_4\n\\char 182 PUSTA_5\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n\n                  \n\\** ˆ **\\ \\char 2c6 PUNCT_TDOT PUSTA_3                                 \n\\** ˜ **\\ \\char 2dc TH_SUB_CIRC_XL                                 \n\\** – **\\ \\char 2013 ANCA_CLOSED SILME_AHA                                \n\\** — **\\ \\char 2014 OLD_ENGLISH_AND                                \n\\** ‘ **\\ \\char 2018 ?                                \n\\** ’ **\\ \\char 2019 ?                                \n\\** ‚ **\\ \\char 201a LAMBE_MARK_DSTROKE                                \n\\** “ **\\ \\char 201c ?                                \n\\** ” **\\ \\char 201d ?                                \n\\** „ **\\ \\char 201e THINF_DSTROKE_L                                \n\\** † **\\ \\char 2020 THINF_DSTROKE_XS                                \n\\** ‡ **\\ \\char 2021 ?                                \n\\** • **\\ \\char 2022 TW_HW_LOWDHAM HARP_SHAPED                                \n\\** … **\\ \\char 2026 THINF_DSTROKE_S                                \n\\** ‰ **\\ \\char 2030 THINF_ACCENT_XL                                \n\\** ‹ **\\ \\char 2039 THINF_ACCENT_S                                \n\\** › **\\ \\char 203a BOOKMARK_SIGN                                \n\\** ™ **\\ \\char 2122 TH_SUB_CIRC_L                            \n\n\n    \n\\** 〠 **\\ \\char 3020 ?                                \n\\** 〡 **\\ \\char 3021 ?                                \n\\** 〣 **\\ \\char 3023 A_TEHTA_DOUBLE_XL                                \n\\** 〤 **\\ \\char 3024 E_TEHTA_DOUBLE_XL                                \n\\** 〦 **\\ \\char 3026 U_TEHTA_DOUBLE_XL                                \n                      \n\\** 〰 **\\ \\char 3030 ?                                \n\\** 〱 **\\ \\char 3031 ?                                \n\\** 〲 **\\ \\char 3032 ?                                \n\\** 〳 **\\ \\char 3033 ?                                \n\\** 〴 **\\ \\char 3034 ?                                \n\\** 〵 **\\ \\char 3035 ?                                \n\\** 〶 **\\ \\char 3036 ?                                \n\\** 〷 **\\ \\char 3037 ?                                \n\\** 〸 **\\ \\char 3038 ?                                \n\\** 〹 **\\ \\char 3039 ?                                \n\\** 〼 **\\ \\char 303c ?                                \n\\** ぀ **\\ \\char 3040 ?                                \n\\** ぃ **\\ \\char 3043 A_TEHTA_DOUBLE_XS                                \n\\** い **\\ \\char 3044 A_TEHTA_DOUBLE_S                                \n\\** ぅ **\\ \\char 3045 A_TEHTA_DOUBLE_L                                \n\\** う **\\ \\char 3046 E_TEHTA_DOUBLE_XS                                \n\\** え **\\ \\char 3048 O_TEHTA_DOUBLE_S                                \n\\** お **\\ \\char 304a U_TEHTA_DOUBLE_S                                \n\\** き **\\ \\char 304d U_TEHTA_DOUBLE_XS                                \n\\** ぎ **\\ \\char 304e O_TEHTA_DOUBLE_XS                                \n\\** け **\\ \\char 3051 ?                                \n\\** げ **\\ \\char 3052 E_TEHTA_DOUBLE_L                                \n\\** さ **\\ \\char 3055 U_TEHTA_DOUBLE_L                                \n\\** ざ **\\ \\char 3056 E_TEHTA_DOUBLE_S                                \n\\** し **\\ \\char 3057 ?                                \n\\** す **\\ \\char 3059 O_TEHTA_DOUBLE_L                                \n\\** ぞ **\\ \\char 305e O_TEHTA_DOUBLE_XL                                \n\\** ぢ **\\ \\char 3062 ?                                \n\\** づ **\\ \\char 3065 ?                                \n\\** と **\\ \\char 3068 ?                                \n\\** な **\\ \\char 306a LAMBE_LIG                                \n\\** の **\\ \\char 306e ?                                \n\\** ぱ **\\ \\char 3071 ?                                \n\\** ひ **\\ \\char 3072 ?                                \n\\** ぴ **\\ \\char 3074 ?                                \n\\** ふ **\\ \\char 3075 ?                                \n\\** ぷ **\\ \\char 3077 ?                                \n\\** へ **\\ \\char 3078 ?                                \n\\** べ **\\ \\char 3079 ?                                \n\\** ぺ **\\ \\char 307a ?                                \n\\** ア **\\ \\char 30a2 ?                                \n\\** カ **\\ \\char 30ab ?                                \n\\** ギ **\\ \\char 30ae ?                                \n\\** セ **\\ \\char 30bb ?                                \n\\** タ **\\ \\char 30bf ?                                \n\\** ツ **\\ \\char 30c4 ?                                \n\\** テ **\\ \\char 30c6 ?                                \n\\** デ **\\ \\char 30c7 ?                                \n\\** ヘ **\\ \\char 30d8 ?                                \n\\** ベ **\\ \\char 30d9 ?                                \n\\** ペ **\\ \\char 30da ?                                \n\\** ホ **\\ \\char 30db ?                                \n\\** ム **\\ \\char 30e0 ?                                \n\\** メ **\\ \\char 30e1 ?                                \n\\** モ **\\ \\char 30e2 ?                                \n\\** ャ **\\ \\char 30e3 ?                                \n\\** ヨ **\\ \\char 30e8 ?                                \n\\** ラ **\\ \\char 30e9 ?                                \n\\** リ **\\ \\char 30ea ?                                \n\\** ル **\\ \\char 30eb ? \n\\** **\\ \\char 3152 PUNCT_PAREN_L_ALT                                \n\\** **\\ \\char 3153 PUNCT_PAREN_R_ALT                                                               \n\\** ㅠ **\\ \\char 3160 ?           \n                     \n\\char 3161 VALA_W_HOOK TW_MH_BELERIANDIC      \n                            \n\\** ㅸ **\\ \\char 3178 ?                                \n\\** ㆒ **\\ \\char 3192 ?                                \n\\** 倚 **\\ \\char 501a ?                                \n\\** 倞 **\\ \\char 501e ?                                \n\\** 倠 **\\ \\char 5020 ?                                \n\\** 倢 **\\ \\char 5022 ?                                \n\\** 倦 **\\ \\char 5026 ?                                \n\\** 倰 **\\ \\char 5030 ?                                \n\\** 倹 **\\ \\char 5039 ?\n\n\n\\** The following virtual chars are used to handle tehtar (& the like) multiple version chosing **\\\n\\** It could be avoided with modern fonts with gsub/gpos tables for ligatures and diacritics **\\\n\\** placement **\\\n\n\\** DUMPED FROM THE VIRTUAL CHARS TOOL **\\\n\n\\beg virtual A_TEHTA\n  \\class A_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class A_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class A_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class A_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM\n  \\class A_TEHTA_CIRCUM_XS TELCO ARA HALLA HYARMEN\n  \\class A_TEHTA_CIRCUM_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class A_TEHTA_CIRCUM_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_1 NUM_2 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class A_TEHTA_CIRCUM_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_REVERSED\n  \\class A_TEHTA_INV_XS TELCO ARA HALLA HYARMEN\n  \\class A_TEHTA_INV_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class A_TEHTA_INV_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class A_TEHTA_INV_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_CIRCUM_REVERSED TEHTA_BREVE\n  \\class THSUP_TICK_XS TELCO ARA HALLA HYARMEN\n  \\class THSUP_TICK_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class THSUP_TICK_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class THSUP_TICK_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA\n  \\class E_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class E_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_4 NUM_8\n  \\class E_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class E_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_GRAVE\n  \\class E_TEHTA_GRAVE_XS TELCO ARA HALLA HYARMEN\n  \\class E_TEHTA_GRAVE_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class E_TEHTA_GRAVE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class E_TEHTA_GRAVE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual I_TEHTA\n  \\class I_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class I_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class I_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class I_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual O_TEHTA\n  \\class O_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class O_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class O_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class O_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual U_TEHTA\n  \\class U_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class U_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class U_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class U_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual SEV_TEHTA\n  \\class SEV_TEHTA_XS TELCO ARA HALLA HYARMEN\n  \\class SEV_TEHTA_S SULE FORMEN TW_EXT_11 TW_EXT_12 HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class SEV_TEHTA_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class SEV_TEHTA_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_DOUBLE\n  \\class A_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED\n  \\class A_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class A_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_7 NUM_10 NUM_11\n  \\class A_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE\n  \\class E_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED\n  \\class E_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 AHA_TINCO HWESTA_TINCO\n  \\class E_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_4 NUM_8 NUM_10 NUM_11\n  \\class E_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual I_TEHTA_DOUBLE Y_TEHTA\n  \\class I_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED\n  \\class I_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 AHA_TINCO HWESTA_TINCO NUM_4 NUM_8\n  \\class I_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_5 NUM_10 NUM_11\n  \\class I_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_DOUBLE\n  \\class O_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED\n  \\class O_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_8\n  \\class O_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_2 NUM_5 NUM_7 NUM_9 NUM_10 NUM_11\n  \\class O_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_3 NUM_6\n\\end\n\n\\beg virtual U_TEHTA_DOUBLE\n  \\class U_TEHTA_DOUBLE_XS TELCO ARA HALLA HYARMEN HARP_SHAPED\n  \\class U_TEHTA_DOUBLE_S SULE FORMEN TW_EXT_11 TW_EXT_12 AHA_TINCO HWESTA_TINCO\n  \\class U_TEHTA_DOUBLE_L TINCO PARMA CALMA QUESSE AHA HWESTA ORE VALA ANNA VILYA TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE_NUQUERNA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL NUM_0 NUM_1 NUM_4 NUM_5 NUM_8 NUM_10 NUM_11\n  \\class U_TEHTA_DOUBLE_XL ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 SILME ESSE HWESTA_SINDARINWA VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_7 NUM_9\n\\end\n\n\\beg virtual A_TEHTA_INF\n  \\class THINF_TDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_TDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO NUM_4\n  \\class THINF_TDOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_TDOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual E_TEHTA_INF\n  \\class THINF_ACCENT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_ACCENT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_ACCENT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_ACCENT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual CIRC_TEHTA_INF\n  \\class TH_SUB_CIRC_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class TH_SUB_CIRC_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class TH_SUB_CIRC_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TH_SUB_CIRC_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual THINNAS SEV_TEHTA_INF THINF_STROKE\n  \\class THINF_STROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_STROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_STROKE_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_STROKE_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual O_TEHTA_INF\n  \\class THINF_CURL_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_CURL_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_CURL_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_CURL_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual U_TEHTA_INF\n  \\class THINF_CURL_INV_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_CURL_INV_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_CURL_INV_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA LAMBE ALDA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_CURL_INV_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual PALATAL_SIGN I_TEHTA_DOUBLE_INF Y_TEHTA_INF\n  \\class THINF_DDOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_DDOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_DDOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_DDOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n  \\class LAMBE_MARK_DDOT LAMBE ALDA\n\\end\n\n\\beg virtual E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n  \\class THINF_DSTROKE_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_DSTROKE_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_DSTROKE_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_DSTROKE_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DSTROKE LAMBE ALDA\n\\end\n\n\\beg virtual UNUTIXE I_TEHTA_INF NO_VOWEL_DOT\n  \\class THINF_DOT_XS TELCO ARA HALLA ROMEN ARDA SILME_NUQUERNA HARP_SHAPED\n  \\class THINF_DOT_S TINCO PARMA TW_EXT_11 TW_EXT_12 SHOOK_BEAUTIFUL AHA_TINCO HWESTA_TINCO\n  \\class THINF_DOT_L SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA SILME SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class THINF_DOT_XL CALMA QUESSE ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_13 TW_EXT_14 TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK VALA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DOT LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN\n  \\class DASH_INF_XS TELCO ARA HALLA\n  \\class DASH_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_DASH LAMBE ALDA\n\\end\n\n\\beg virtual GEMINATE_SIGN_TILD\n  \\class TILD_INF_XS TELCO ARA HALLA\n  \\class TILD_INF_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_INF_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n  \\class LAMBE_MARK_TILD LAMBE ALDA\n\\end\n\n\\beg virtual NASALIZE_SIGN\n  \\class DASH_SUP_XS TELCO ARA HALLA\n  \\class DASH_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class DASH_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_5 NUM_6 NUM_9\n\\end\n\n\\beg virtual NASALIZE_SIGN_TILD\n  \\class TILD_SUP_XS TELCO ARA HALLA\n  \\class TILD_SUP_S TINCO PARMA CALMA QUESSE SULE FORMEN AHA HWESTA ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_13 TW_EXT_14 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN HWESTA_SINDARINWA YANTA URE OSSE VALA_W_HOOK SHOOK_BEAUTIFUL HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_4 NUM_5 NUM_7 NUM_8 NUM_10 NUM_11\n  \\class TILD_SUP_L ANDO UMBAR ANGA UNGWE ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME TW_EXT_21 TW_EXT_22 TW_EXT_23 TW_EXT_24 VAIA MALTA_W_HOOK ANCA_CLOSED NUM_2 NUM_3 NUM_6 NUM_9\n\\end\n\n\\beg virtual ALVEOLAR_SIGN\n  \\class SHOOK_LEFT_L CALMA QUESSE ANGA UNGWE TW_EXT_13 TW_EXT_14 TW_EXT_23 TW_EXT_24 HWESTA_SINDARINWA\n  \\class SHOOK_RIGHT_L TELCO ARA HALLA TINCO PARMA ANDO UMBAR SULE FORMEN AHA HWESTA ANTO AMPA ANCA UNQUE NUMEN MALTA NOLDO NWALME ORE VALA ANNA VILYA TW_EXT_11 TW_EXT_12 TW_EXT_21 TW_EXT_22 ROMEN ARDA LAMBE ALDA SILME SILME_NUQUERNA SILME_NUQUERNA_ALT ESSE ESSE_NUQUERNA HYARMEN YANTA URE OSSE VAIA MALTA_W_HOOK VALA_W_HOOK SHOOK_BEAUTIFUL ANCA_CLOSED HARP_SHAPED AHA_TINCO HWESTA_TINCO NUM_0 NUM_1 NUM_2 NUM_3 NUM_4 NUM_5 NUM_6 NUM_7 NUM_8 NUM_9 NUM_10 NUM_11\n\\end\n"
Glaemscribe.resource_manager.raw_charsets["tengwar_freemono"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset for the FreeMonoTengwar font **\\ \n\n\\version 0.0.8\n\n\\beg changelog\n  \\entry \"0.0.5\" \"Added VALA_W_HOOK.\"\n  \\entry \"0.0.6\" \"Updating punctuation\"\n  \\entry \"0.0.7\" \"Fixed missing tinco_ext / sule_ext\"\n  \\entry \"0.0.8\" \"Added NBSP\"\n\\end\n\n\\char 20 SPACE\n\\char a0 NBSP\n\n\\** PUSTAR, take them in unicode not in personnal use (deprecation) **\\\n\\char 2e31 PUNCT_DOT\n\\char   3a PUNCT_DDOT\n\\char 205D PUNCT_TDOT PUSTA_3\n\\char 2058 PUSTA_4\n\\char 10FB PUSTA_4_HALFED\n\\char 2E2C PUSTA_4_SQUARED\n\\char 2E2D PUSTA_5\n\n\\char e000  TW_11 TINCO     \n\\char e001  TW_12 PARMA\n\\char e002  TW_13 CALMA\n\\char e003  TW_14 QUESSE\n\n\\char e004  TW_21 ANDO  \n\\char e005  TW_22 UMBAR\n\\char e006  TW_23 ANGA  \n\\char e007  TW_24 UNGWE\n      \n\\char e008  TW_31 SULE THULE\n\\char e009  TW_32 FORMEN\n\\char e00A  TW_33 AHA  \n\\char e00B  TW_34 HWESTA\n\n\\char e00C  TW_41 ANTO\n\\char e00D  TW_42 AMPA\n\\char e00E  TW_43 ANCA\n\\char e00F  TW_44 UNQUE\n\n\\char e010  TW_51 NUMEN \n\\char e011  TW_52 MALTA\n\\char e012  TW_53 NOLDO\n\\char e013  TW_54 NWALME\n\n\\char e014  TW_61 ORE\n\\char e015  TW_62 VALA\n\\char e016  TW_63 ANNA\n\\char e017  TW_64 VILYA\n\n\\char e018  TW_EXT_11 TINCO_EXT SULE_EXT THULE_EXT\n\\char e019  TW_EXT_12 PARMA_EXT FORMEN_EXT \n\\char e01A  TW_EXT_13 CALMA_EXT AHA_EXT\n\\char e01B  TW_EXT_14 QUESSE_EXT HWESTA_EXT\n        \n\\char e01C  TW_EXT_21 ANDO_EXT ANTO_EXT \n\\char e01D  TW_EXT_22 UMBAR_EXT AMPA_EXT\n\\char e01E  TW_EXT_23 ANGA_EXT ANCA_EXT\n\\char e01F  TW_EXT_24 UNGWE_EXT UNQUE_EXT\n\n\\char e020  TW_71 ROMEN\n\\char e021  TW_72 ARDA\n\\char e022  TW_73 LAMBE\n\\char e023  TW_74 ALDA \n\n\\char e024  TW_81 SILME \n\\** Unfortunately, monotengwar is missing silme nuquerna used for y in beleriand **\\\n\\char e025  TW_82 SILME_NUQUERNA SILME_NUQUERNA_ALT\n\\char e026  TW_83 ESSE\n\\char e027  TW_84 ESSE_NUQUERNA\n\n\\char e028  TW_91 HYARMEN \n\\char e029  TW_92 HWESTA_SINDARINWA \n\\char e02A  TW_93 YANTA\n\\char e02B  TW_94 URE\n\n\\char e02C  ARA\n\\char e02D  HALLA\n\\char e02E  TELCO\n\\char e02F  ?      \n\n\\char e030  REVERSED_OSSE\n\\char e031  BOMBADIL_W \n\\char e032  OSSE\n\\char e033  ?\n\n\\char e034  LIGATING_SHORT_CARRIER\n\\char e035  ANNA_SINDARINWA\n\\char e036  ANNA_OPEN\n\\char e037  CHRISTOPHER_QU\n\n\\char e038  REVERSED_FORMEN\n\\char e039  BOMBADIL_HW\n\\char e03A  MALTA_W_HOOK TW_MH\n\\char e03B  VALA_W_HOOK TW_MH_BELERIANDIC\n\n\\char e03C  TW_HW_LOWDHAM HARP_SHAPED\n\\char e03D  VAIA WAIA VAIYA\n\\char e03E  ?\n\\char e03F  ?      \n\n\\char e040  A_TEHTA\n\\char e041  A_TEHTA_INF\n\\char e042  I_TEHTA_DOUBLE Y_TEHTA\n\\char e043  I_TEHTA_DOUBLE_INF PALATAL_SIGN Y_TEHTA_INF \n\n\\char e044  I_TEHTA\n\\char e045  I_TEHTA_INF NO_VOWEL_DOT UNUTIXE\n\\char e046  E_TEHTA\n\\char e047  E_TEHTA_INF\n\n\\char e048  E_TEHTA_DOUBLE\n\\char e049  E_TEHTA_DOUBLE_INF GEMINATE_DOUBLE\n\\char e04A  O_TEHTA\n\\char e04B  O_TEHTA_INF\n\n\\char e04C  U_TEHTA\n\\char e04D  U_TEHTA_INF\n\\char e04E  O_TEHTA_DOUBLE\n\\char e04F  U_TEHTA_DOUBLE\n\n\\char e050  NASALIZE_SIGN NASALIZE_SIGN_TILD      \n\\char e051  GEMINATE_SIGN GEMINATE_SIGN_TILD\n\\char e052  SEV_TEHTA\n\\char e053  TEHTA_BREVE A_TEHTA_CIRCUM_REVERSED\n\n\\char e054  E_TEHTA_GRAVE\n\\char e055  A_TEHTA_CIRCUM  \n\\char e056  A_TEHTA_REVERSED A_TEHTA_DOUBLE\n\\char e057  THINNAS SEV_TEHTA_INF THINF_STROKE\n\n\\** THE TWO FOLLOWING ONES ARE HIGHLY DISCUSSABLE, MAYBE WE SHOULD ADD A VIRTUAL CHAR FOR THESE **\\\n\\char e058  SHOOK_LEFT_L\n\\char e059  SHOOK_RIGHT_L ALVEOLAR_SIGN\n\\char e05A  ?\n\\char e05B  ?\n\n\n\n\\char e065  PUNCT_EXCLAM\n\\char e066  PUNCT_INTERR\n\\char e067  PUNCT_PAREN_L PUNCT_PAREN_R PUNCT_PAREN_L_ALT PUNCT_PAREN_R_ALT BOOKMARK_SIGN\n\\char e068  PUNCT_TILD\n \n\\char e069  PUNCT_DTILD RING_MARK_L RING_MARK_R\n\n\\char e06A  DQUOT_OPEN\n\\char e06B  DQUOT_CLOSE\n\n\\char e070 NUM_0 \n\\char e071 NUM_1 \n\\char e072 NUM_2 \n\\char e073 NUM_3 \n\\char e074 NUM_4 \n\\char e075 NUM_5 \n\\char e076 NUM_6 \n\\char e077 NUM_7 \n\\char e078 NUM_8 \n\\char e079 NUM_9 \n\\char e07A NUM_10\n\\char e07B NUM_11\n\n\\char e07D CIRC_TEHTA_INF\n\n\\char 10037 AHA_TINCO\n\\char 10038 HWESTA_TINCO\n\\char 10039 ANCA_CLOSED\n\n"
Glaemscribe.resource_manager.raw_charsets["unicode_gothic"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset for the analecta font used by the gothic mode **\\ \n\\** Very incomplete outside of the gothic range **\\ \n\\** Minimal service here ... **\\\n\n\\**   **\\ \\char 20 SPACE  \n\\** , **\\ \\char 2C COMA\n\\** . **\\ \\char 2E PERIOD\n\\** : **\\ \\char 3A COLON\n\\** ; **\\ \\char 3B SEMICOLON\n\n\\** Gothic part **\\\n\\** 𐌰 **\\ \\char 10330 AZA  \n\\** 𐌱 **\\ \\char 10331 BERCNA  \n\\** 𐌳 **\\ \\char 10333 DAAZ  \n\\** 𐌴 **\\ \\char 10334 EYZ  \n\\** 𐍆 **\\ \\char 10346 FE  \n\\** 𐌲 **\\ \\char 10332 GEUUA  \n\\** 𐌷 **\\ \\char 10337 HAAL  \n\\** 𐌹 **\\ \\char 10339 IIZ  \n\\** 𐌾 **\\ \\char 1033E GAAR  \n\\** 𐌺 **\\ \\char 1033A CHOZMA  \n\\** 𐌻 **\\ \\char 1033B LAAZ  \n\\** 𐌼 **\\ \\char 1033C MANNA  \n\\** 𐌽 **\\ \\char 1033D NOICZ  \n\\** 𐍉 **\\ \\char 10349 UTAL \n\\** 𐍀 **\\ \\char 10340 PERTRA  \n\\** 𐌵 **\\ \\char 10335 QUETRA  \n\\** 𐍂 **\\ \\char 10342 REDA  \n\\** 𐍃 **\\ \\char 10343 SUGIL  \n\\** 𐍄 **\\ \\char 10344 TYZ  \n\\** 𐌸 **\\ \\char 10338 THYTH  \n\\** 𐌿 **\\ \\char 1033F URAZ  \n\\** 𐍇 **\\ \\char 10347 ENGUZ  \n\\** 𐍅 **\\ \\char 10345 UUINNE  \n\\** 𐌶 **\\ \\char 10336 EZEC  \n\\** 𐍈 **\\ \\char 10348 UUAER  \n\\** 𐍋 **\\ \\char 1034B IIZ_TREMA \\** Special Glaemscrafu ! **\\ \n\\** 𐍁 **\\ \\char 10341 ? \n\\** 𐍊 **\\ \\char 1034A ? \n\n"
Glaemscribe.resource_manager.raw_charsets["unicode_runes"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Charset for the pfeffermediaeval font used by the furtharc mode **\\ \n\\** Very incomplete outside of the runes range **\\\n\\** Minimal service here ... **\\ \n\n\\**   **\\ \\char 20 SPACE                      \n\\** , **\\ \\char 2C COMA\n\\** . **\\ \\char 2E PERIOD \n\\** ; **\\ \\char 3B SEMICOLON   \n\\** ᚠ **\\ \\char 16A0 FEHU FEOH FE \n\\** ᚡ **\\ \\char 16A1 RUNIC_V \n\\** ᚢ **\\ \\char 16A2 URUZ UR \n\\** ᚣ **\\ \\char 16A3 YR \n\\** ᚤ **\\ \\char 16A4 RUNIC_Y \n\\** ᚥ **\\ \\char 16A5 RUNIC_W \n\\** ᚦ **\\ \\char 16A6 THURISAZ THURS THORN \n\\** ᚧ **\\ \\char 16A7 ETH \n\\** ᚨ **\\ \\char 16A8 ANSUZ \n\\** ᚩ **\\ \\char 16A9 OS \n\\** ᚪ **\\ \\char 16AA AC \n\\** ᚫ **\\ \\char 16AB AESC \n\\** ᚬ **\\ \\char 16AC LONG_BRANCH_OSS \n\\** ᚭ **\\ \\char 16AD SHORT_TWIG_OSS \n\\** ᚮ **\\ \\char 16AE RUNIC_O \n\\** ᚯ **\\ \\char 16AF RUNIC_OE \n\\** ᚰ **\\ \\char 16B0 RUNIC_ON \n\\** ᚱ **\\ \\char 16B1 RAIDO RAD REID \n\\** ᚲ **\\ \\char 16B2 KAUNA \n\\** ᚳ **\\ \\char 16B3 CEN \n\\** ᚴ **\\ \\char 16B4 KAUN \n\\** ᚵ **\\ \\char 16B5 RUNIC_G \n\\** ᚶ **\\ \\char 16B6 ENG \n\\** ᚷ **\\ \\char 16B7 GEBO GYFU \n\\** ᚷ **\\ \\char 16B8 GAR \n\\** ᚹ **\\ \\char 16B9 WUNJO WYNN \n\\** ᚺ **\\ \\char 16BA HAGLAZ \n\\** ᚻ **\\ \\char 16BB HAEGL \n\\** ᚼ **\\ \\char 16BC LONG_BRANCH_HAGALL \n\\** ᚽ **\\ \\char 16BD SHORT_TWIG_HAGALL \n\\** ᚾ **\\ \\char 16BE NAUDIZ NYD NAUD \n\\** ᚿ **\\ \\char 16BF SHORT_TWIG_NAUD \n\\** ᛀ **\\ \\char 16C0 DOTTED_N \n\\** ᛁ **\\ \\char 16C1 ISAZ IS ISS \n\\** ᛂ **\\ \\char 16C2 RUNIC_E \n\\** ᛃ **\\ \\char 16C3 JERAN \n\\** ᛄ **\\ \\char 16C4 GER \n\\** ᛅ **\\ \\char 16C5 LONG_BRANCH_AR \n\\** ᛆ **\\ \\char 16C6 SHORT_TWIG_AR \n\\** ᛇ **\\ \\char 16C7 IWAZ EOH \n\\** ᛈ **\\ \\char 16C8 PERTHO PEORTH \n\\** ᛉ **\\ \\char 16C9 ALGIZ EOLHX \n\\** ᛊ **\\ \\char 16CA SOWILO \n\\** ᛋ **\\ \\char 16CB SIGEL LONG_BRANCH_SOL \n\\** ᛌ **\\ \\char 16CC SHORT_TWIG_SOL \n\\** ᛍ **\\ \\char 16CD RUNIC_C \n\\** ᛎ **\\ \\char 16CE RUNIC_Z \n\\** ᛏ **\\ \\char 16CF TIWAZ TIR TYR \n\\** ᛐ **\\ \\char 16D0 SHORT_TWIG_TYR \n\\** ᛑ **\\ \\char 16D1 RUNIC_D \n\\** ᛒ **\\ \\char 16D2 BERKANAN BEORC BJARKAN \n\\** ᛓ **\\ \\char 16D3 SHORT_TWIG_BERKANAN SHORT_TWIG_BEORC SHORT_TWIG_BJARKAN\n\\** ᛔ **\\ \\char 16D4 DOTTED_P \n\\** ᛕ **\\ \\char 16D5 OPEN_P \n\\** ᛖ **\\ \\char 16D6 EHWAZ EH \n\\** ᛗ **\\ \\char 16D7 MANNAZ MAN \n\\** ᛘ **\\ \\char 16D8 LONG_BRANCH_MADR \n\\** ᛙ **\\ \\char 16D9 SHORT_TWIG_MADR \n\\** ᛚ **\\ \\char 16DA LAUKAZ LAGU LOGR \n\\** ᛛ **\\ \\char 16DB DOTTED_L \n\\** ᛜ **\\ \\char 16DC INGWAZ \n\\** ᛝ **\\ \\char 16DD ING \n\\** ᛞ **\\ \\char 16DE DAGAZ DAEG \n\\** ᛟ **\\ \\char 16DF OTHALAN ETHEL \n\\** ᛠ **\\ \\char 16E0 EAR \n\\** ᛡ **\\ \\char 16E1 IOR \n\\** ᛢ **\\ \\char 16E2 CWEORTH \n\\** ᛣ **\\ \\char 16E3 CALC \n\\** ᛤ **\\ \\char 16E4 CEALC \n\\** ᛥ **\\ \\char 16E4 STAN \n\\** ᛦ **\\ \\char 16E6 LONG_BRANCH_YR \n\\** ᛧ **\\ \\char 16E7 SHORT_TWIG_YR \n\\** ᛨ **\\ \\char 16E8 ICELANDIC_YR \n\\** ᛩ **\\ \\char 16E9 RUNIC_Q \n\\** ᛪ **\\ \\char 16EA RUNIC_X \n\\** ᛫ **\\ \\char 16EB RUNIC_SINGLE_PUNCTUATION \n\\** ᛬ **\\ \\char 16EC RUNIC_MULTIPLE_PUNCTUATION \n\\** ᛭ **\\ \\char 16ED RUNIC_CROSS_PUNCTUATION\n\\** ᛮ **\\ \\char 16EE RUNIC_ARLAUG_SYMBOL \n\\** ᛯ **\\ \\char 16EF RUNIC_TVIMADUR_SYMBOL \n\\** ᛰ **\\ \\char 16F0 RUNIC_BELGTHOR_SYMBOL \n\\** ᛱ **\\ \\char 16F1 RUNIC_LETTER_K \n\\** ᛲ **\\ \\char 16F2 RUNIC_LETTER_SH \n\\** ᛳ **\\ \\char 16F3 RUNIC_LETTER_OO   \n\\** ᛴ **\\ \\char 16F4 RUNIC_LETTER_FRANKS_CASKET_OS \n\\** ᛵ **\\ \\char 16F5 RUNIC_LETTER_FRANKS_CASKET_IS \n\\** ᛶ **\\ \\char 16F6 RUNIC_LETTER_FRANKS_CASKET_EH \n\\** ᛷ **\\ \\char 16F7 RUNIC_LETTER_FRANKS_CASKET_AC \n\\** ᛸ **\\ \\char 16F8 RUNIC_LETTER_FRANKS_CASKET_AESC\n"
Glaemscribe.resource_manager.raw_modes["adunaic"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n \\entry \"0.0.2\" \"Added option for o/u tehtar loop orientation\"\n \\entry \"0.0.3\" \"Normalizing to virtual chars\" \n \\entry \"0.0.4\" \"Added charset support for Annatar\"\n \\entry \"0.0.5\" \"Added support for the FreeMonoTengwar font\"\n \\entry \"0.0.6\" \"Added wave/bar option for consonant modifications sign\"\n \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"\n \\entry \"0.1.2\" \"Added support for non-breaking spaces\" \n\\end\n\n\\**  Adunaic mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\\language Adûnaic\n\\writing  Tengwar\n\\mode     \"Adûnaic Tengwar - G*\"\n\\version  \"0.1.2\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R Tolkien\"\n\n\\world      arda\n\\invention  experimental\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\beg      options\n  \\beg option reverse_o_u_tehtar O_UP_U_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute \"ä\" \"a\"\n  \\substitute \"ë\" \"e\"\n  \\substitute \"ï\" \"i\"\n  \\substitute \"ö\" \"o\"\n  \\substitute \"ü\" \"u\"\n  \\substitute \"ÿ\" \"y\"\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral  \n  \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n    \\endif\n  \n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n\n    \\** Short diphthongs **\\\n    {AI}  === {A}{I}\n    {AU}  === {A}{U}\n\n    \\** LONG diphthongs **\\      \n    {AAI} === {AA}{I} \\** âi **\\\n    {AAU} === {AA}{U} \\** âu **\\\n    {EEI} === {EE}{I} \\** êi **\\\n    {EEU} === {EE}{U} \\** êu **\\\n    {OOI} === {OO}{I} \\** ôi **\\\n    {OOU} === {OO}{U} \\** ôu **\\\n        \n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP} === O_TEHTA\n      {U_LOOP} === U_TEHTA\n    \\else\n      {O_LOOP} === U_TEHTA\n      {U_LOOP} === O_TEHTA\n    \\endif\n        \n    {SDIPHTHONGS}  === {AI}           * {AU}\n    {SDIPHTHENGS}  === YANTA A_TEHTA  * URE A_TEHTA \n                   \n    {LDIPHTHONGS}  === {AAI}               * {AAU}              * {EEI}              * {EEU}            * {OOI}               * {OOU}\n    {LDIPHTHENGS}  === ARA A_TEHTA YANTA   * ARA A_TEHTA URE    * ARA E_TEHTA YANTA  * ARA E_TEHTA URE  * ARA {O_LOOP} YANTA  * ARA {O_LOOP} URE\n                                                                                                                 \n    {VOWELS}      === {A}          * {E}          * {I}          * {O}          * {U}    \n    {_TEHTAR_}    === A_TEHTA      * E_TEHTA      *  I_TEHTA     * {O_LOOP}     * {U_LOOP}\n                   \n    {LVOWELS}     === {AA}         * {EE}         * {II}         * {OO}         * {UU}\n    {LVOWTNG}     === ARA A_TEHTA  * ARA E_TEHTA  * ARA I_TEHTA  * ARA {O_LOOP} * ARA {U_LOOP} \n\n    \\** Let\' put all vowels/diphthongs in the same basket **\\\n    {V_D}         === [ {VOWELS}    * {LVOWELS} * {SDIPHTHONGS} * {LDIPHTHONGS} ]        \n    \\** And their images... **\\            \n    {_V_D_}       === [ {_TEHTAR_}  * {LVOWTNG} * {SDIPHTHENGS} * {LDIPHTHENGS} ]\n  \n    [{VOWELS}]       --> TELCO [{_TEHTAR_}]   \\** Replace isolated short vowels **\\\n    [{LVOWELS}]      --> [{LVOWTNG}]    \\** Replace long vowels **\\\n    [{SDIPHTHONGS}]  --> [{SDIPHTHENGS}]  \\** Replace short diphthongs **\\\n    [{LDIPHTHONGS}]  --> [{LDIPHTHENGS}]  \\** Replace long diphthongs **\\\n\n    \\** ================ **\\\n    \\**    CONSONANTS    **\\\n    \\** ================ **\\     \n    {K}   === (c,k)\n    {V}   === (v,w)\n\n    {L1_S}         === {K}     * p     * t     * {K}{K}            * pp                * tt\n    {L1_T}         === QUESSE  * PARMA * TINCO * CALMA {GEMINATE}  * PARMA {GEMINATE}  * TINCO  {GEMINATE}\n    \n    [{L1_S}]       -->  [ {L1_T} ]\n    [{L1_S}]{V_D}  -->  [ {L1_T} ]{_V_D_} \n\n    {L2_S}         === d    * b     * g     * dd              * bb                * gg\n    {L2_T}         === ANDO * UMBAR * UNGWE * ANDO {GEMINATE} * UMBAR {GEMINATE}  * UNGWE {GEMINATE}\n    [{L2_S}]       --> [{L2_T}] \n    [{L2_S}]{V_D}  --> [{L2_T}]{_V_D_} \n\n    \\** Alignment of tehta is not the same in the font **\\\n    \\** So we need to split the third line unfortunately **\\\n    {L3_1_S}          === th    * ph      * (t,th)th          * (p,ph)ph            * (t,th)ph    * (k,kh)ph      * (p,ph)th    * (k,kh)th\n    {L3_1_T}          === SULE  * FORMEN  * SULE {GEMINATE}   * FORMEN {GEMINATE}   * SULE FORMEN * HWESTA FORMEN * FORMEN SULE * HWESTA SULE\n   \n    {L3_2_S}          === sh    * kh      * (k,kh)kh          * (p,ph)kh            * (t,th)kh\n    {L3_2_T}          === AHA   * HWESTA  * HWESTA {GEMINATE} * FORMEN HWESTA       * SULE HWESTA\n   \n    [{L3_1_S}]        --> [{L3_1_T}] \n    [{L3_1_S}]{V_D}   --> [{L3_1_T}]{_V_D_} \n    [{L3_2_S}]        --> [{L3_2_T}] \n    [{L3_2_S}]{V_D}   --> [{L3_2_T}]{_V_D_} \n\n    {L4_S}            === nd    * mb    * ng\n    {L4_T}            === ANTO  * AMPA  * UNQUE\n    [{L4_S}]          --> [{L4_T}] \n    [{L4_S}]{V_D}     --> [{L4_T}]{_V_D_} \n\n    {L5_S}            === n     * m     * nn                 * mm\n    {L5_T}            === NUMEN * MALTA * NUMEN {GEMINATE}   * MALTA {GEMINATE}\n    [{L5_S}]          --> [{L5_T}] \n    [{L5_S}]{V_D}     --> [{L5_T}]{_V_D_} \n\n    {L6_S}            === {V}   * y     * rr                 * {V}{V}             * yy\n    {L6_T}            === VALA  * ANNA  * ROMEN {GEMINATE}   * VALA {GEMINATE}    * ANNA {GEMINATE}\n    [r * {L6_S}]      --> [ ORE   * {L6_T}] \n    [r * {L6_S}]{V_D} --> [ ROMEN * {L6_T}]{_V_D_} \n\n    \\** This one is not useful (redundant with higher) **\\\n    \\** Keep it for clarity of mind **\\\n    r_                --> ORE\n\n    s{V_D}            --> SILME_NUQUERNA {_V_D_}  \\** Before a vowel goes down **\\\n    s                 --> SILME                   \\** Any other pos, up **\\\n    z{V_D}            --> ESSE_NUQUERNA {_V_D_}   \\** Before a vowel goes down **\\\n    z                 --> ESSE                    \\** Any other pos, up **\\\n\n    h{V_D}            --> HYARMEN {_V_D_}\n    h                 --> HYARMEN\n    hh{V_D}           --> HYARMEN {GEMINATE} {_V_D_}\n    hh                --> HYARMEN {GEMINATE}\n                      \n    l{V_D}            --> LAMBE {_V_D_}\n    l                 --> LAMBE\n                      \n    ll{V_D}           --> LAMBE {GEMINATE} {_V_D_}\n    ll                --> LAMBE {GEMINATE}\n  \n  \\end\n  \n  \\beg rules punctutation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n\n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> PUNCT_DOT    \n    – --> PUNCT_TILD  \n    — --> PUNCT_DTILD\n \n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11   \n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end\n"
Glaemscribe.resource_manager.raw_modes["blackspeech"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** BlackSpeech ring mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\n\\beg changelog\n  \\entry 0.0.1 \"First version\"\n  \\entry 0.0.2 \"Ported to virtual chars.\"\n  \\entry 0.0.3 \"Merging with blackspeech Annatar\".\n  \\entry 0.0.4 \"Adding double tehtar handling.\"\n  \\entry 0.0.5 \"Fixing ORE/ROMEN, refactoring.\"\n  \\entry 0.0.6 \"Added support for the FreeMonoTengwar font\"\n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"\n  \\entry \"0.1.2\" \"Added support for non-breaking spaces\"   \n  \\entry \"0.1.3\" \"Correcting visibility options to conform to new glaeml args strict syntax\"\n\\end\n\n\\language \"Black Speech\"\n\\writing  \"Tengwar\"\n\\mode     \"Black Speech Tengwar - General Use\"\n\\version  \"0.1.3\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\raw_mode \"raw-tengwar\"\n \n\\charset  tengwar_ds_sindarin false\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  true\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\beg      options\n\n  \\beg option reverse_o_u_tehtar O_UP_U_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\beg option long_vowels_format LONG_VOWELS_USE_DOUBLE_TEHTAR\n    \\value LONG_VOWELS_USE_LONG_CARRIER 1\n    \\value LONG_VOWELS_USE_DOUBLE_TEHTAR 2\n  \\end  \n  \n  \\beg option double_tehta_e true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_i true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_o true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_u true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_WAVE\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n  \n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute \"ä\" \"a\"\n  \\substitute \"ë\" \"e\"\n  \\substitute \"ï\" \"i\"\n  \\substitute \"ö\" \"o\"\n  \\substitute \"ü\" \"u\"\n  \\substitute \"ÿ\" \"y\"\n\n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n\n  \\** For ORE/ROMEN **\\\n  \\rxsubstitute \"r(a|e|i|o|u|á|é|í|ó|ú)\" \"R\\\\1\"\n\n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral\n     \n    {K}                 === (c,k)\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n      {NASAL}    === NASALIZE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n      {NASAL}    === NASALIZE_SIGN\n    \\endif\n    \n    {VOWELS}            === a               *  e              * i              * o              *  u\n    {LVOWELS}           === á               *  é              * í              * ó              *  ú\n    \n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif   \n       \n    {_TEHTAR_}          === A_TEHTA         * E_TEHTA         * I_TEHTA       *  {O_LOOP}  * {U_LOOP}      \n     \n    {DIPHTHONGS}        === ai              * au              * oi          \n    {_DIPHTHONGS_}      === YANTA A_TEHTA   * URE A_TEHTA     * YANTA {O_LOOP}  \n      \n		{WLONG}     === {NULL} \\** long vowels that can be used as tehtar **\\\n    {_WLONG_}   === {NULL} \\** tehtar of long vowels that can be used as tehtar **\\\n		\n		{_LONG_A_}      === ARA A_TEHTA\n		{_LONG_E_}      === ARA E_TEHTA	\n		{_LONG_I_}      === ARA I_TEHTA\n		{_LONG_O_}      === ARA {O_LOOP}	\n		{_LONG_U_}      === ARA {U_LOOP}\n		{_LONE_LONG_A_} === {_LONG_A_}\n		{_LONE_LONG_E_} === {_LONG_E_}\n		{_LONE_LONG_I_} === {_LONG_I_}\n		{_LONE_LONG_O_} === {_LONG_O_}\n		{_LONE_LONG_U_} === {_LONG_U_}\n    \n		\\if \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n	    \\if double_tehta_e\n		    {_LONG_E_}       === E_TEHTA_DOUBLE\n		    {_LONE_LONG_E_}  === TELCO {_LONG_E_}\n				{WLONG}          === {WLONG}   * é\n        {_WLONG_}        === {_WLONG_} * {_LONG_E_}\n			\\endif\n		  \\if double_tehta_i\n		    {_LONG_I_}       === I_TEHTA_DOUBLE\n		    {_LONE_LONG_I_}  === TELCO {_LONG_I_}\n				{WLONG}          === {WLONG}   * í             \n        {_WLONG_}        === {_WLONG_} * {_LONG_I_}\n		  \\endif\n		  \\if double_tehta_o\n		    {_LONG_O_}       === {O_LOOP_DOUBLE}\n		    {_LONE_LONG_O_}  === TELCO {_LONG_O_}\n				{WLONG}          === {WLONG}   * ó             \n        {_WLONG_}        === {_WLONG_} * {_LONG_O_}\n		  \\endif\n		  \\if double_tehta_u\n		    {_LONG_U_}       === {U_LOOP_DOUBLE}\n		    {_LONE_LONG_U_}  === TELCO {_LONG_U_}\n				{WLONG}          === {WLONG}   * ú            \n        {_WLONG_}        === {_WLONG_} * {_LONG_U_}\n		  \\endif\n    \\endif  \n			        \n    {V_D}           === [ {VOWELS} {WLONG}  ]\n    {V_D_WN}        === [ {VOWELS} {WLONG} * {NULL} ]\n\n    {_V_D_}         === [ {_TEHTAR_} {_WLONG_} ]\n    {_V_D_WN_}      === [ {_TEHTAR_} {_WLONG_} * {NULL} ]\n		\n		\\** LONE SHORT VOWELS **\\\n    [{VOWELS}]    --> TELCO [{_TEHTAR_}]  \\** Replace isolated short vowels **\\\n    \n		\\** LONE LONG VOWELS **\\	\n		[{LVOWELS}]   --> [{_LONE_LONG_A_} * {_LONE_LONG_E_} * {_LONE_LONG_I_} * {_LONE_LONG_O_} * {_LONE_LONG_U_}]\n    \n    [{DIPHTHONGS}] -->   [{_DIPHTHONGS_}]     \\**  Replace diphthongs **\\\n    \n    \\** ========================= **\\\n    \n    {V_D_WN}p     --> PARMA {_V_D_WN_}\n    {V_D_WN}t     --> TINCO {_V_D_WN_}\n    {V_D_WN}{K}   --> QUESSE {_V_D_WN_}\n  \n    {V_D_WN} b  --> UMBAR {_V_D_WN_}\n    {V_D_WN} d  --> ANDO {_V_D_WN_}\n    {V_D_WN} f  --> FORMEN_EXT {_V_D_WN_} \\** Beware. **\\ \n    {V_D_WN} g  --> UNGWE {_V_D_WN_}\n    {V_D_WN} gh --> UNGWE_EXT {_V_D_WN_}\n    {V_D_WN} h  --> HYARMEN {_V_D_WN_}\n\n    \\** ======================== **\\\n\n    {K}h          --> HWESTA\n    {V_D}{K}h     --> HWESTA_EXT {_V_D_} \\** Take care. **\\  \n\n    \\** ======================== **\\\n\n    {V_D_WN} l  --> LAMBE {_V_D_WN_} \n\n    \\** ======================== **\\\n\n    {V_D_WN} m  --> MALTA {_V_D_WN_}\n    {V_D_WN} mb --> UMBAR {NASAL} {_V_D_WN_}\n    {V_D_WN} mp --> PARMA {NASAL} {_V_D_WN_}\n\n    \\** ======================== **\\\n    \n    {V_D_WN}n   --> NUMEN {_V_D_WN_} \n    {V_D_WN}n{K}  --> QUESSE {NASAL} {_V_D_WN_} \n\n    \\** ======================== **\\\n    \n    \\** ROMEN / ORE handling probably not accurate **\\\n    {V_D_WN}r   --> ORE   {_V_D_WN_}\n    {V_D_WN}R   --> ROMEN {_V_D_WN_}\n    \n    \\** ======================== **\\\n\n    s             --> SILME\n    {V_D} s       --> SILME_NUQUERNA {_V_D_}\n    z             --> ESSE    \n    {V_D} z       --> ESSE_NUQUERNA {_V_D_}\n\n    \\** ======================== **\\\n\n    sh            --> AHA             \n    {V_D} sh      --> AHA_EXT {_V_D_} \\** BEWARE. **\\\n    \n\n    th            --> SULE\n    \n    y             --> ANNA\n\n  \\end\n  \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> {NULL}     \n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n    \n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n\n  \\end\n  \n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end\n"
Glaemscribe.resource_manager.raw_modes["futhark-runicus"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"Initial version\"\n  \\entry \"0.0.2\" \"Adding quotes handling\"\n\\end\n\n\\language \"Old Norse\"\n\\writing  \"Runes\"\n\\mode     \"Old Norse Futhark - Codex Runicus\"\n\\version  \"0.0.2\"\n\\authors  \"Historical, impl. Talagan (Benjamin Babut)\"\n\n\\world      primary_related_to_arda\n\\invention  historical\n\n\\charset  unicode_runes true\n\n\\beg      preprocessor\n  \\downcase\n\\end\n\n\\beg      processor\n    \n  \\beg    rules litteral\n    {A}       === (a,á) \n    {E}       === (e,é) \n    {I}       === (i,í,j)\n    {O}       === (o,ó,ą,ą́)\n    {U}       === (u,ú)\n    {Y}       === (y,ý)\n\n    {AE}      === (æ,ǽ,ę)\n    {OE}      === (ø,ǿ,œ)\n    {OTREM}   === (ö,ǫ,ǫ́,ǭ)\n    {AEI}     === (æi,ei)\n\n    \\**  VOWELS **\\\n    \n    \\**  ą (> a, o, á, ó plus tard)   **\\\n\n    {A}       --> SHORT_TWIG_AR\n    {E}       --> RUNIC_E\n    {I}       --> ISS \n    {O}       --> RUNIC_O\n    {U}       --> UR\n    {Y}       --> LONG_BRANCH_YR\n    {AE}      --> LONG_BRANCH_AR\n    {OE}      --> RUNIC_OE\n    {OTREM}   --> RUNIC_O       \\** # ö en islandais **\\\n    ǭ         --> SHORT_TWIG_AR \\** # á en islandais  **\\\n    {AEI}     --> LONG_BRANCH_AR ISS    \n    \n    \\**  au: ok    **\\\n    {E}{Y}    --> LONG_BRANCH_AR LONG_BRANCH_YR\n    {OE}{Y}   --> LONG_BRANCH_AR LONG_BRANCH_YR                       \n\n    \\**  CONSONANTS **\\\n  \n    b         --> BJARKAN\n    c         --> RUNIC_C\n    \\**  bb: ok **\\\n    \\**  mb: ok **\\\n    d         --> RUNIC_D\n    \\**  dd: ok **\\\n    \\**  nd: ok **\\\n    ð         --> THORN\n    (f,f_)    --> FEHU \\** # Second part is unuseful but exists in other modes **\\\n    _g        --> RUNIC_G \\** # Initial / After prefix **\\\n    (g,g_)    --> LONG_BRANCH_HAGALL \\** # Median / Final Spirant **\\\n    gg        --> RUNIC_G RUNIC_G\n    ng        --> SHORT_TWIG_NAUD RUNIC_G\n    h         --> LONG_BRANCH_HAGALL\n    k         --> KAUN\n    \\**  kk: ok **\\\n    \\**  nk: ok **\\\n    l         --> LOGR\n    \\**  ll: ok **\\\n    m         --> LONG_BRANCH_MADR\n    \\**  mm: ok **\\\n    n         --> SHORT_TWIG_NAUD\n    \\**  nn: ok **\\\n    p         --> DOTTED_P\n    \\**  pp: ok **\\\n    \\**  mp: ok **\\\n    (r,ř)     --> REID\n    \\**  rr: ok **\\\n    \\**  ř < z = rune ýr, none in this mode **\\\n    s         --> SIGEL\n    \\**  ss: ok **\\\n    t         --> SHORT_TWIG_TYR\n    nt        --> SHORT_TWIG_TYR\n    \\**  tt: ok **\\\n    þ        --> THORN\n    vv       --> FEHU  \\** # v (< f) **\\\n    v        --> URUZ  \\** # v (< w)  **\\\n    w        --> URUZ  \\** # Should not exist but let\'s handle it **\\\n    x        --> RUNIC_X                 \n    z        --> RUNIC_Z\n  \\end\n  \n  \\beg    rules  punctuation\n    , --> RUNIC_SINGLE_PUNCTUATION\n    ; --> RUNIC_SINGLE_PUNCTUATION\n    : --> RUNIC_MULTIPLE_PUNCTUATION\n    . --> RUNIC_MULTIPLE_PUNCTUATION\n    ! --> RUNIC_MULTIPLE_PUNCTUATION\n    ? --> RUNIC_CROSS_PUNCTUATION	\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL} \n    » --> {NULL} \n  \\end\n\\end\n  \n    \n      "
Glaemscribe.resource_manager.raw_modes["futhark-younger"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"Initial version\"\n  \\entry \"0.0.2\" \"Adding quotes handling\"\n\\end\n\n\\language \"Old Norse\"\n\\writing  \"Runes\"\n\\mode     \"Old Norse Futhark - Younger Futhark\"\n\\version  \"0.0.2\"\n\\authors  \"Historical impl. Bertrand Bellet\"\n\n\\world      primary_related_to_arda\n\\invention  historical\n\n\\charset  unicode_runes true\n\n\\beg options \n  \\beg option runic_style RUNIC_STYLE_LONG_BRANCH \n    \\value RUNIC_STYLE_LONG_BRANCH 0\n    \\value RUNIC_STYLE_SHORT_TWIG  1\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\downcase\n  \n  \\** Dis-ambiguate q,c,k **\\\n  \\rxsubstitute \"(q|c|k)\" \"k\"\n\\end\n\n\\beg      processor\n    \n  \\beg    rules litteral\n    {A}       === (a,á,æ,ǽ,ę) \n    {I}       === (i,í,j,e,é)\n    {O}       === (ą,ą́,ö,ǫ,ǫ́,ǭ)\n    {U}       === (u,ú,o,ó,y,ý,ø,ǿ,œ)\n    {AI}      === (æi,ei)\n  	{AU}      === (au,ǫu,ey,æy,øy,œy)\n\n    \\**  VOWELS **\\\n    \\if \"runic_style == RUNIC_STYLE_LONG_BRANCH\"\n      {AR}      === LONG_BRANCH_AR\n      {OSS}     === LONG_BRANCH_OSS     \n    \\else\n      {AR}      === SHORT_TWIG_AR\n      {OSS}     === SHORT_TWIG_OSS\n    \\endif\n    \n    {A}       --> {AR}\n    {I}       --> ISS \n    {O}       --> {OSS}\n    {U}       --> UR\n    {AI}      --> {AR} ISS \n	  {AU}      --> {OSS} UR\n    \n    \\** CONSONANTS **\\\n    \\if \"runic_style == RUNIC_STYLE_LONG_BRANCH\"\n      {BJARKAN} === BJARKAN\n      {HAGALL}  === LONG_BRANCH_HAGALL\n      {MADR}    === LONG_BRANCH_MADR\n      {NAUD}    === NAUD\n      {YR}      === LONG_BRANCH_YR\n      {SOL}     === LONG_BRANCH_SOL\n      {TYR}     === TYR\n    \\else\n      {BJARKAN} === SHORT_TWIG_BJARKAN\n      {HAGALL}  === SHORT_TWIG_HAGALL\n      {MADR}    === SHORT_TWIG_MADR\n      {NAUD}    === SHORT_TWIG_NAUD\n      {YR}      === SHORT_TWIG_YR\n      {SOL}     === SHORT_TWIG_SOL\n      {TYR}     === SHORT_TWIG_TYR\n    \\endif\n    \n    (b,bb,mb,p,pp,mp) --> {BJARKAN}\n    (f,ff)            --> FE\n    _g                --> KAUN      \\** # Initial / After prefix **\\\n    (g,g_)            --> {HAGALL}  \\** # Median or final spirant **\\\n    (h,hh)            --> {HAGALL}\n    (k,nk,kk,gg,ng)   --> KAUN\n    (l,ll)            --> LOGR\n    (m,mm)            --> {MADR}\n    (n,nn)            --> {NAUD}\n    (r,rr)            --> REID\n    (ř)               --> {YR} \\**  ř < Germanic z **\\\n    (s,ss)            --> {SOL}\n	  (t,tt,nt,d,dd,nd) --> {TYR}\n    (þ,þþ,ð,ðð)       --> THURS\n    (v,vv,w,ww)       --> URUZ\n    x                 --> KAUN {SOL}                 \n    z                 --> {TYR} {SOL}\n	\n    \\**  nasalization of a **\\\n		{A}(m,mm)        --> {OSS} {MADR}\n		{A}(n,nn)        --> {OSS} {NAUD}\n		{A}(mp,mb)       --> {OSS} {BJARKAN}\n		{A}(nt,nd)       --> {OSS} {TYR}\n		{A}(nk,ng)       --> {OSS} KAUN				\n  \\end\n  \n  \\beg    rules  punctuation\n    , --> RUNIC_SINGLE_PUNCTUATION\n    ; --> RUNIC_SINGLE_PUNCTUATION\n    : --> RUNIC_MULTIPLE_PUNCTUATION\n    . --> RUNIC_MULTIPLE_PUNCTUATION\n    ! --> RUNIC_MULTIPLE_PUNCTUATION\n    ? --> RUNIC_CROSS_PUNCTUATION	\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL} \n    » --> {NULL} \n  \\end\n\\end\n  \n    \n      "
Glaemscribe.resource_manager.raw_modes["futhorc"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"Initial version\"\n  \\entry \"0.0.2\" \"Adding quotes handling\"\n\\end\n\n\\language \"Old English\"\n\\writing  \"Runes\"\n\\mode     \"Old English Futhorc\"\n\\version  \"0.0.2\"\n\\authors  \"Historical impl. Bertrand Bellet\"\n\n\\world      primary_related_to_arda\n\\invention  historical\n\n\\charset  unicode_runes true\n\n\\beg options\n  \\option use_cweorth                     true\n  \\option use_stan                        true\n  \\option use_calc_and_gar                true\n\\end\n\n\\beg      preprocessor\n  \\downcase\n\\end\n\n\\beg      processor\n    \n  \\beg    rules litteral\n    {A}       === (a,á) \n    {E}       === (e,é) \n    {I}       === (i,í)\n    {O}       === (o,ó)\n    {U}       === (u,ú)\n    {Y}       === (y,ý)\n    {AE}      === (æ,ǽ)\n    {OE}      === (œ,œ́)\n    {EA}      === (ea,éa)\n    {EO}      === (eo,éo)\n    {IO}      === (io,ío)\n\n    \\**  VOWELS **\\\n\n    {A}       --> AC\n    {E}       --> EH\n    {I}       --> IS \n    {O}       --> OS\n    {U}       --> UR\n    {Y}       --> YR\n    {AE}      --> AESC\n    {OE}      --> ETHEL\n    {EA}      --> EAR\n    {EO}      --> EOH\n    {IO}      --> IOR                    \n\n    \\**  IOTATED VOWELS **\\\n    {IOTABLES}    ===  {A}  * {E} * {O} * {U} * {Y} * {AE} * {OE}   * {EA}  * {EO}\n    {_IOTABLES_}  ===  AC   * EH  * OS  * UR  * YR  * AESC * ETHEL  * EAR   * EOH \n    \n    i [{IOTABLES}] --> GER [{_IOTABLES_} ]  \n\n    \\**  CONSONANTS **\\\n    (b,bb)         --> BEORC\n    \n	  \\** (c,cc,k,kk)    --> CALC **\\\n    \\** (ċ,ċċ)         --> CEN **\\\n    (c,cc,k,kk)    --> CEN\n    (ċ,ċċ)         --> CEN\n    \\if use_calc_and_gar\n      \\** overload when option is on **\\ \n      (c,cc,k,kk)    --> CALC\n    \\endif\n      \n    (d,dd)         --> DAEG\n    (f,ff,v)       --> FEOH\n    \n	  \\**  (g,gg,cg)      --> GAR  **\\  \n    \\**  (ȝ,ġ,ġġ,ċġ)    --> GYFU **\\\n    (g,gg,cg)      --> GYFU    \n    (ȝ,ġ,ġġ,ċġ)    --> GYFU\n    \\if use_calc_and_gar\n      \\** overload when option is on **\\ \n      (g,gg,cg)      --> GAR\n    \\endif\n    \n    (h,hh,ç,χ)     --> HAEGL\n    (j,jj,ĭ)       --> GER\n    (l,ll)         --> LAGU\n    (m,mm)         --> MAN\n    (n,nn)         --> NYD\n    (p,pp)         --> PEORTH\n    (r,rr)         --> RAD\n    (s,ss,z)       --> SIGEL\n    (t,tt)         --> TIR\n    (þ,þþ,ð,ðð)    --> THORN\n    (w,ww)         --> WYNN\n  \n    \\** OLD ENGLISH AND **\\\n    \n    ⁊             --> OS NYD DAEG\n      \n    \\**  CLUSTERS WITH ING **\\    \n    \n    \\** ng            --> ING GAR **\\\n    \\** nġ            --> ING GYFU **\\\n    ng            --> ING GYFU\n    nġ            --> ING GYFU\n    \\if use_calc_and_gar\n      ng            --> ING GAR\n    \\endif\n      \n    \\** nc            --> ING CALC **\\\n    \\** (nċ,nk,nq)    --> ING CEN  **\\\n    nc            --> ING CEN\n    (nċ,nk,nq)    --> ING CEN\n    \\if use_calc_and_gar\n      ng            --> ING CALC\n    \\endif     \n      \n    \\**  CLUSTERS WITH S **\\   \n    x             --> EOLHX\n    (z,ts)        --> TIR SIGEL\n    \n    \\**  ADDITIONAL RUNES **\\    \n    \\if use_cweorth \n      (cw,qu,ccw,cqu)   --> CWEORTH\n    \\endif\n    \\if use_stan\n      st                --> STAN\n    \\endif\n      \n  \\end\n  \n  \\beg    rules  punctuation\n    , --> RUNIC_SINGLE_PUNCTUATION\n    ; --> RUNIC_SINGLE_PUNCTUATION\n    : --> RUNIC_MULTIPLE_PUNCTUATION\n    . --> RUNIC_MULTIPLE_PUNCTUATION\n    ! --> RUNIC_MULTIPLE_PUNCTUATION\n    ? --> RUNIC_CROSS_PUNCTUATION \n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL}\n    » --> {NULL}\n  \\end\n\\end\n  \n    \n      "
Glaemscribe.resource_manager.raw_modes["gothic"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\language \"Gothic\"\n\\writing  \"Gothic Alphabet\"\n\\mode     \"Gothic - Standard\"\n\\version  \"0.0.1\"\n\\authors  \"Historical, impl. Talagan (Benjamin Babut)\"\n\n\\world      primary_related_to_arda\n\\invention  historical\n\n\\charset  unicode_gothic true\n\n\\beg      preprocessor\n  \\downcase\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral\n    (a,ā) --> AZA\n    b     --> BERCNA\n    d     --> DAAZ\n    (e,ē) --> EYZ\n    f     --> FE\n    g     --> GEUUA\n    h     --> HAAL\n    i     --> IIZ\n    j     --> GAAR\n    k     --> CHOZMA\n    l     --> LAAZ  \n    m     --> MANNA  \n    n     --> NOICZ  \n    (o,ō) --> UTAL \n    p     --> PERTRA  \n    q     --> QUETRA\n    r     --> REDA  \n    s     --> SUGIL \n    t     --> TYZ  \n    þ     --> THYTH \n    u     --> URAZ  \n    x     --> ENGUZ  \n    (w,y) --> UUINNE\n    z     --> EZEC  \n    ƕ     --> UUAER\n	ï     --> IIZ_TREMA	\n    _i    --> IIZ_TREMA\n  \\end\n  \n  \\beg    rules punctuation\n    , --> COMA\n    . --> PERIOD\n    ; --> SEMICOLON\n  : --> COLON\n  \\end\n  \n\\end\n    \n      "
Glaemscribe.resource_manager.raw_modes["khuzdul"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.2\", \"Moved outspace character to general element\"\n\\end\n\n\\language \"Khuzdul\"\n\\writing  \"Cirth\"\n\\mode     \"Khuzdul Cirth - Angerthas Moria\"\n\\version  \"0.0.2\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\charset  cirth_ds true\n\n\\** We redefine the output space to have something beautiful, especially with erebor1 and erebor2 **\\ \n\\outspace CIRTH_SPACE_BIG\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute \"ä\" \"a\"\n  \\substitute \"ë\" \"e\"\n  \\substitute \"ï\" \"i\"\n  \\substitute \"ö\" \"o\"\n  \\substitute \"ü\" \"u\"\n  \\substitute \"ÿ\" \"y\"\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"â\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"ê\"\n  \\rxsubstitute \"(ī|î|ii)\" \"î\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ô\"\n  \\rxsubstitute \"(ū|û|uu)\" \"û\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ŷ\"\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral\n    a --> CIRTH_48\n    â --> CIRTH_49\n    e --> CIRTH_46\n    ê --> CIRTH_47\n\n    i --> CIRTH_39\n    î --> CIRTH_39 CIRTH_39\n\n    o --> CIRTH_50\n\n    u --> CIRTH_42\n    û --> CIRTH_43\n\n    b   --> CIRTH_2\n    d   --> CIRTH_9\n    f   --> CIRTH_3\n    g   --> CIRTH_19\n    h   --> CIRTH_34\n    gh  --> CIRTH_19 CIRTH_34\n    k   --> CIRTH_18\n    l   --> CIRTH_31\n    m   --> CIRTH_6\n    n   --> CIRTH_22\n    nd  --> CIRTH_33\n    r   --> CIRTH_12\n    s   --> CIRTH_54\n    t   --> CIRTH_8\n    sh  --> CIRTH_15\n    th  --> CIRTH_8 CIRTH_59\n    z   --> CIRTH_17\n\n    k   --> CIRTH_18\n    kh  --> CIRTH_18 CIRTH_59    \n  \\end\n  \n  \\beg    rules punctuation\n    . --> CIRTH_PUNCT_THREE_DOTS\n    .. --> CIRTH_PUNCT_THREE_DOTS\n    ... --> CIRTH_PUNCT_THREE_DOTS\n    …   --> CIRTH_PUNCT_THREE_DOTS\n    .... --> CIRTH_PUNCT_THREE_DOTS\n    ..... --> CIRTH_PUNCT_THREE_DOTS\n    ...... --> CIRTH_PUNCT_THREE_DOTS\n    ....... --> CIRTH_PUNCT_THREE_DOTS\n\n    , --> CIRTH_PUNCT_MID_DOT\n    : --> CIRTH_PUNCT_TWO_DOTS\n    ; --> CIRTH_PUNCT_TWO_DOTS\n    ! --> CIRTH_PUNCT_THREE_DOTS\n    ? --> CIRTH_PUNCT_THREE_DOTS\n    · --> CIRTH_PUNCT_MID_DOT\n\n    - --> CIRTH_PUNCT_MID_DOT\n    – --> CIRTH_PUNCT_TWO_DOTS  \n    — --> CIRTH_PUNCT_TWO_DOTS\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** Quotes **\\\n\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL} \n    » --> {NULL} \n\n    [ --> CIRTH_PUNCT_THREE_DOTS_L\n    ] --> CIRTH_PUNCT_THREE_DOTS_L\n    ( --> CIRTH_PUNCT_THREE_DOTS_L\n    ) --> CIRTH_PUNCT_THREE_DOTS_L\n    { --> CIRTH_PUNCT_THREE_DOTS_L\n    } --> CIRTH_PUNCT_THREE_DOTS_L\n    < --> CIRTH_PUNCT_THREE_DOTS_L\n    > --> CIRTH_PUNCT_THREE_DOTS_L\n\n    / --> CIRTH_PUNCT_FOUR_DOTS\n  \\end\n\\end\n"
Glaemscribe.resource_manager.raw_modes["mercian"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Porting to virtual chars\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"\n  \\entry \"0.1.2\" \"Doing some cleaning\"\n  \\entry \"0.1.3\" \"Added support for non-breaking spaces\"     \n\\end\n\n\\language \"Old English\"\n\\writing  \"Tengwar\"\n\\mode     \"Old English Tengwar - \'Mercian\' Usage\"\n\\version  \"0.1.3\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      primary_related_to_arda\n\\invention  jrrt\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_annatar false\n\\charset  tengwar_ds_eldamar true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\n\\** List of features that would prevent use of other charsets \n\\charset  tengwar_freemono    false\n Free Mono Tengwar : missing [OLD_ENGLISH_AND,SHOOK_BEAUTIFUL] / sa-rince management not accurate\n**\\\n\n\n\\beg options\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_WAVE\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\substitute \"ae\"  \"æ\"\n  \\substitute \"ea\"  \"æa\"\n  \\substitute \"éa\"  \"ǽa\"\n  \\substitute \"7\"   \"⁊\"\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\\end\n  \n\\beg      processor\n\n  \\beg    rules litteral\n  \n    {_GEMINATE_} === E_TEHTA_DOUBLE_INF\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {_NASAL_}    === NASALIZE_SIGN_TILD\n    \\else\n      {_NASAL_}    === NASALIZE_SIGN\n    \\endif\n  \n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n    {Y}   === y\n    {YY}  === ý\n\n    {AE}    === (æ,ae)\n    {AEAE}  === (ǽ,ǣ)\n\n    {OE}    === (ø,œ)\n    {OEOE}  === (ǿ,œ́)\n\n    \\** Diphtongs are always splitted, so consider we don\'t have any. **\\\n    \\** @ is the phantom vowel added by the preprocessor **\\\n\n    {S_VOWELS_NP_KERNEL}   === {A} * {AE} * {OE} * {E} * {I}   * {O} * {U} * {Y}\n    {S_VOWELS_WP_KERNEL}   === {S_VOWELS_NP_KERNEL} * @                           \n\n    \\** UP TEHTAS **\\    \n    {TEHTAR_UP_NP}  === A_TEHTA    * Y_TEHTA     * E_TEHTA_DOUBLE   * E_TEHTA   *   I_TEHTA    * O_TEHTA    * U_TEHTA   * SEV_TEHTA \n \n    {TEHTAR_UP}     === {TEHTAR_UP_NP}  * {NULL}\n\n    \\** FOR LONG VOWELS **\\\n    {LVOWELS}       === {AA}           * {AEAE}       * {OEOE}             * {EE}         * {II}         * {OO}          * {UU}         * {YY}  \n    {LTEHTAR}       === ARA A_TEHTA    * ARA Y_TEHTA  * ARA E_TEHTA_DOUBLE * ARA E_TEHTA  * ARA I_TEHTA  * ARA O_TEHTA   * ARA U_TEHTA  * ARA SEV_TEHTA    \n\n    {LVOWEL_MARKER}  === THINNAS\n  \n    \\** DOWN TEHTAS **\\\n    {DTEHTAR}        === A_TEHTA_INF   * Y_TEHTA_INF  * CIRC_TEHTA_INF     * E_TEHTA_INF  * I_TEHTA_INF  * O_TEHTA_INF  * U_TEHTA_INF   * THINNAS   * {NULL}\n  \n\n    {S_VOWELS_NP}       === [ {S_VOWELS_NP_KERNEL} ]\n    {S_VOWELS_NP_WN}    === [ {S_VOWELS_NP_KERNEL} * {NULL} ]\n    {S_VOWELS}          === [ {S_VOWELS_WP_KERNEL} ]\n    {S_VOWELS_WN}       === [ {S_VOWELS_WP_KERNEL} * {NULL} ]\n\n    \\** IMG Sheaves for all vowels **\\\n    {_S_VOWELS_UP_}        === [ {TEHTAR_UP} ]\n    {_S_VOWELS_DN_}        === [ {DTEHTAR} ]\n\n    {_S_VOWELS_UP_WN_}     === [ {TEHTAR_UP} * {NULL} ]\n    {_S_VOWELS_DN_WN_}     === [ {DTEHTAR} * {NULL} ]\n\n    \\** Fallback rule for all vowels **\\\n    [ {LVOWELS} ] --> [ {LTEHTAR} ]            \\** If found alone, long vowel will have a long carrier **\\\n\n    \\** Fallback rule for short vowels **\\\n    @                   --> {NULL}                     \\**  If found alone, put nothing **\\\n    [ {S_VOWELS_NP_KERNEL} ]   --> TELCO [ {TEHTAR_UP_NP} ]   \\**  If found alone, a vowel will have a short carrier **\\\n    _{A}                --> VILYA                      \\**  We don\'t want a short carrier for _a **\\\n    (w,u)_              --> VALA                       \\**  Only resolved after vowels **\\\n\n    \\** Next rule not valid in mercian mode **\\\n    \\** {UU} -> yU - Nope in mercian **\\\n\n\n    \\** ========== **\\\n    \\** CONSONANTS **\\\n    \\** ========== **\\\n\n    \\** ========== **\\\n    \\** 1st Line (Voiceless occlusives) **\\\n    \\** Short upper dash for nasalisation **\\\n\n    {L1_KER_1}      === t     * p \n    {L1_IMG_1}      === TINCO * PARMA\n\n    {L1_KER_2}      === ċ     * c       * k\n    {L1_IMG_2}      === CALMA * QUESSE  * QUESSE\n    \n    {L1_KER_1_GEMS} === tt                  * pp   \n    {L1_IMG_1_GEMS} === TINCO {_GEMINATE_}  * PARMA {_GEMINATE_}\n\n    {L1_KER_2_GEMS} === ċċ                  * cc                  * kk \n    {L1_IMG_2_GEMS} === CALMA {_GEMINATE_}  * QUESSE {_GEMINATE_} * QUESSE {_GEMINATE_}\n  \n    \\** C, CV, CVV. Rules are declared to avoid conflicts between [C, NULLV, V] and [C, V, NULLV] **\\\n    \\** We also have rules for long vowels **\\\n    [{L1_KER_1}]                                  --> [{L1_IMG_1}]\n    [{L1_KER_2}]                                  --> [{L1_IMG_2}]\n    [{L1_KER_1}]{S_VOWELS}{S_VOWELS_WN}           --> [{L1_IMG_1}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L1_KER_2}]{S_VOWELS}{S_VOWELS_WN}           --> [{L1_IMG_2}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L1_KER_1}][{LVOWELS}]                       --> [{L1_IMG_1}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n    [{L1_KER_2}][{LVOWELS}]                       --> [{L1_IMG_2}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminateds (double sign below) **\\\n    \\** C², C²V **\\\n    \\** NOT C²V² (cannot put second tehta below due to gemination sign) **\\\n    \\** NOT C²L (long vowel not possible with gemination sign) **\\\n    [{L1_KER_1_GEMS}]{S_VOWELS_WN}          --> [{L1_IMG_1_GEMS}]{_S_VOWELS_UP_WN_}\n    [{L1_KER_2_GEMS}]{S_VOWELS_WN}          --> [{L1_IMG_2_GEMS}]{_S_VOWELS_UP_WN_}\n\n    \\** Nasals (tild above) **\\\n    \\** nC, nCV, nCVV **\\\n    \\** We also have rules for long vowels **\\\n    [ nt * mp ]                                       -->  [ TINCO * PARMA  ] {_NASAL_} \n    [ nċ * nc ]                                       -->  [ CALMA * QUESSE ] {_NASAL_} \n    [ nt * mp ]{S_VOWELS}{S_VOWELS_WN}                -->  [ TINCO * PARMA  ] {_NASAL_} {_S_VOWELS_UP_} {_S_VOWELS_DN_WN_}\n    [ nċ * nc ]{S_VOWELS}{S_VOWELS_WN}                -->  [ CALMA * QUESSE ] {_NASAL_} {_S_VOWELS_UP_} {_S_VOWELS_DN_WN_}\n    [ nt * mp ][{LVOWELS}]                            -->  [ TINCO * PARMA  ] {_NASAL_} [{TEHTAR_UP_NP}] {LVOWEL_MARKER}\n    [ nċ * nc ][{LVOWELS}]                            -->  [ CALMA * QUESSE ] {_NASAL_} [{TEHTAR_UP_NP}] {LVOWEL_MARKER}\n\n    \\** ========== **\\\n    \\** 2nd Line (Voiced occlusives) **\\\n    \\** Long upper dash for nasalisation **\\\n\n    {L2_KER}        === d     * b     * ġ     * g\n    {L2_IMG}        === ANDO  * UMBAR * ANGA  * UNGWE\n    \n    {L2_KER_GEMS}   === dd                 * bb                 * (ċġ,ġġ)            * (cg,gg)\n    {L2_IMG_GEMS}   === ANDO {_GEMINATE_}  * UMBAR {_GEMINATE_} * ANGA {_GEMINATE_}  * UNGWE {_GEMINATE_}\n\n    \\** C, CV, CVV **\\\n    [{L2_KER}]                                        --> [{L2_IMG}]\n    [{L2_KER}]{S_VOWELS}{S_VOWELS_WN}                 --> [{L2_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L2_KER}][{LVOWELS}]                             --> [{L2_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    [{L2_KER_GEMS}]{S_VOWELS_WN}                      --> [{L2_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n    \\** Nasals, with diphthongs! **\\\n    [ nd * mb * nġ * ng ]                             -->  [ {L2_IMG} ] {_NASAL_}\n    [ nd * mb * nġ * ng ]{S_VOWELS}{S_VOWELS_WN}      -->  [ {L2_IMG} ] {_NASAL_} {_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [ nd * mb * nġ * ng ][{LVOWELS}]                  -->  [ {L2_IMG} ] {_NASAL_} [{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** ========== **\\\n    \\** 3rd Line (Voiceless fricatives) **\\\n    \\** Short upper dash for nasalisation **\\\n    {L3_KER_1}      === þ     * f\n    {L3_IMG_1}      === SULE  * FORMEN\n    \n    {L3_KER_2}      === ç     * (χ,ħ)\n    {L3_IMG_2}      === AHA   * HWESTA\n    \n    {L3_KER_1_GEMS} === þþ                * ff\n    {L3_IMG_1_GEMS} === SULE {_GEMINATE_} * FORMEN {_GEMINATE_}\n    \n    {L3_KER_2_GEMS} === çç                * (χχ,ħħ)\n    {L3_IMG_2_GEMS} === AHA {_GEMINATE_}  * HWESTA {_GEMINATE_}\n\n    [{L3_KER_1}]                              --> [{L3_IMG_1}]\n    [{L3_KER_2}]                              --> [{L3_IMG_2}]\n    [{L3_KER_1}]{S_VOWELS}{S_VOWELS_WN}       --> [{L3_IMG_1}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L3_KER_2}]{S_VOWELS}{S_VOWELS_WN}       --> [{L3_IMG_2}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L3_KER_1}][{LVOWELS}]                   --> [{L3_IMG_1}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n    [{L3_KER_2}][{LVOWELS}]                   --> [{L3_IMG_2}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    [{L3_KER_1_GEMS}]{S_VOWELS_WN}            --> [{L3_IMG_1_GEMS}]{_S_VOWELS_UP_WN_}\n    [{L3_KER_2_GEMS}]{S_VOWELS_WN}            --> [{L3_IMG_2_GEMS}]{_S_VOWELS_UP_WN_}\n  \n  \n    \\** ========== **\\\n    \\** 4th Line (Voiced fricatives) **\\\n    \\** Long upper dash for nasalisation **\\\n\n    {L4_KER}        === ð     * v     * j     * ȝ\n    {L4_IMG}        === ANTO  * AMPA  * ANCA  * UNQUE\n    \n    {L4_KER_GEMS}   === ðð                 * vv                 * jj                 * ȝȝ\n    {L4_IMG_GEMS}   === ANTO {_GEMINATE_}  * AMPA {_GEMINATE_}  * ANCA {_GEMINATE_}  * UNQUE {_GEMINATE_}\n\n    [{L4_KER}]                                --> [{L4_IMG}]\n    [{L4_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{L4_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L4_KER}][{LVOWELS}]                     --> [{L4_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    [{L4_KER_GEMS}]{S_VOWELS_WN}              --> [{L4_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n\n    \\** ========== **\\\n    \\** 5th Line (Nasals) **\\\n    \\** Long upper dash for nasalisation (wins on gemination) **\\\n\n    {L5_KER}        === n * m\n    {L5_IMG}        === NUMEN * MALTA\n\n    [{L5_KER}]                                --> [{L5_IMG}]\n    [{L5_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{L5_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L5_KER}][{LVOWELS}]                     --> [{L5_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Gemination === nasalisation **\\\n    \\** So prefer using tild to put tehtas up and down for diphthongs and long vowels **\\\n\n    [ nn * mm ]                               --> [{L5_IMG}] {_NASAL_} \n    [ nn * mm ]{S_VOWELS}{S_VOWELS_WN}        --> [{L5_IMG}] {_NASAL_} {_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [ nn * mm ][{LVOWELS}]                    --> [{L5_IMG}] {_NASAL_} [{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** ========== **\\\n    \\** 6th Line (Approximants == fr : Spirantes) **\\\n    \\** Short upper dash for nasalisation **\\\n\n    {L6_KER}        === r * ĭ\n    {L6_IMG}        === ORE * ANNA\n    {L6_KER_GEMS}   === rr * ĭĭ\n    {L6_IMG_GEMS}   === ORE {_GEMINATE_} * ANNA {_GEMINATE_}\n\n    [{L6_KER}]                                --> [{L6_IMG}]\n    [{L6_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{L6_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L6_KER}][{LVOWELS}]                     --> [{L6_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    [{L6_KER_GEMS}]{S_VOWELS_WN}              --> [{L6_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n    \\** ========== **\\\n    \\** Liquids **\\\n\n    w                                         --> ROMEN\n    w{S_VOWELS}{S_VOWELS_WN}                  --> ROMEN {_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    w[{LVOWELS}]                              --> ROMEN [{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    ww{S_VOWELS_WN}                           --> ROMEN {_GEMINATE_} {_S_VOWELS_UP_WN_}\n\n    \\** L and LL and ld are too big to receive tehtas under, so no diphthongs, no long vowels **\\\n    [l * ll * ld] {S_VOWELS_WN}               --> [LAMBE * LAMBE {_GEMINATE_} * ALDA] {_S_VOWELS_UP_WN_}\n\n    \\** ========== **\\\n    \\** Alveolar (sifflantes) **\\\n    \n    {L8_KER}      ===  s * z \n    {L8_IMG}      ===  SILME_NUQUERNA * ESSE_NUQUERNA \n    {L8_KER_GEMS} ===  ss * zz \n    {L8_IMG_GEMS} ===  SILME_NUQUERNA {_GEMINATE_} * ESSE_NUQUERNA {_GEMINATE_}\n\n    [{L8_KER}]                                --> [{L8_IMG}]\n    [{L8_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{L8_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{L8_KER}][{LVOWELS}]                     --> [{L8_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign under, cannot treat diphthongs or long vowels **\\\n    [{L8_KER_GEMS}]{S_VOWELS_WN}              --> [{L8_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n    \\**  Final s (Challenging!) **\\\n    s_                --> SHOOK_BEAUTIFUL                             \\** Final rule for s **\\\n    {S_VOWELS}s_      --> TELCO {_S_VOWELS_UP_} SILME_NUQUERNA     \\** Rule es_ **\\\n    [{LVOWELS}]s_     --> [{LTEHTAR}] SILME_NUQUERNA                \\** Rule és_ **\\\n\n    s --> SILME    \\** Overload lonely s **\\\n    z --> ESSE    \\** Overload lonely z **\\\n\n    \\** ========== **\\\n    \\** Ligatures **\\\n    \n    {LINE_VARIOUS_1_KER}      ===  sċ \n    {LINE_VARIOUS_1_IMG}      ===  ANCA_CLOSED  \n    {LINE_VARIOUS_2_KER}      ===  hw * çt * (χt,ħt)\n    {LINE_VARIOUS_2_IMG}      ===  HARP_SHAPED  * AHA_TINCO  * HWESTA_TINCO  \n\n    [{LINE_VARIOUS_1_KER}]                                --> [{LINE_VARIOUS_1_IMG}]\n    [{LINE_VARIOUS_2_KER}]                                --> [{LINE_VARIOUS_2_IMG}]\n    [{LINE_VARIOUS_1_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{LINE_VARIOUS_1_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{LINE_VARIOUS_2_KER}]{S_VOWELS}{S_VOWELS_WN}         --> [{LINE_VARIOUS_2_IMG}]{_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    [{LINE_VARIOUS_1_KER}][{LVOWELS}]                     --> [{LINE_VARIOUS_1_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n    [{LINE_VARIOUS_2_KER}][{LVOWELS}]                     --> [{LINE_VARIOUS_2_IMG}][{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** No nasals, no geminated **\\\n\n    \\** ========== **\\\n    \\** Various **\\\n   \n    h                                            --> HYARMEN\n    h{S_VOWELS}{S_VOWELS_WN}                     --> HYARMEN {_S_VOWELS_UP_}{_S_VOWELS_DN_WN_}\n    h[{LVOWELS}]                                 --> HYARMEN [{TEHTAR_UP_NP}]{LVOWEL_MARKER}\n\n    \\** Geminated sign below, cannot treat diphthongs or long vowels **\\\n    hh{S_VOWELS_WN}                              --> HYARMEN {_GEMINATE_} {_S_VOWELS_UP_WN_}\n\n    \\** ========== **\\\n    \\** X **\\\n    \\** For x, due to the cedilla, we cannot put tehtas under the tengwa (so no need to treat diphthongs or long vowels) **\\\n\n    x{S_VOWELS_WN}                               --> QUESSE ALVEOLAR_SIGN {_S_VOWELS_UP_WN_}\n    xx{S_VOWELS_WN}                              --> QUESSE ALVEOLAR_SIGN {_GEMINATE_} {_S_VOWELS_UP_WN_}\n    nx{S_VOWELS_WN}                              --> QUESSE ALVEOLAR_SIGN {_NASAL_} {_S_VOWELS_UP_WN_}     \n    \n    \n  \\end\n  \n  \\beg    rules punctuation \n    ⁊ --> OLD_ENGLISH_AND\n\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    - --> PUNCT_DOT    \n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L_ALT \\** TODO : Remove alt ? **\\\n    ) --> PUNCT_PAREN_R_ALT \\** TODO : Remove alt ? **\\\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end"
Glaemscribe.resource_manager.raw_modes["quenya-sarati"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Changelog **\\\n\\**\n\\beg changelog\n  \\entry \"0.0.2\", \"Moved outspace character to general element\"\n\\end\n**\\\n\n\\language \"Quenya\"\n\\writing  \"Sarati\"\n\\mode     \"Quenya Sarati - Quenya Usage\"\n\\version  \"0.0.3\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\beg changelog\n  \\entry \"0.0.1\" \"Initial version\"\n  \\entry \"0.0.2\" \"Adding quotes handling\"\n  \\entry \"0.0.3\" \"Adding simple punctuation. Correcting \'qui\' by changing rule order for \'qu\' in preprocessor. Adding hl/hr.\"\n\\end\n\n\\charset  sarati_eldamar true\n\n\\outspace SARATI_SPACE\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\** Removed ï and ü, not quite sure how to treat them for qenya : ex : oïkta diphthong or not ?  **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ö o\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\"          \"á\"\n  \\rxsubstitute \"(ē|ê)\"             \"é\" \\** ee is allowed in qenya **\\\n  \\rxsubstitute \"(ī|î|iï|ïi|ïï|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\"          \"ó\"\n  \\rxsubstitute \"(ū|û|uü|üu|üü|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\"          \"ý\"\n\n  \\** Dis-ambiguate qu. Should come BEFORE correcting diphthongs. **\\\n  \\substitute   \"qu\" \"q\" \n\n  \\** Dis-ambiguate old qenya diphthongs **\\\n  \\** AT: The Quenya diphthongs are iu, eu, au, ai, oi, ui. \n      In the Quenya Usage, u is treated as w, and i is treated as y, \n      when they are the second element in diphthongs. \n      Other than that, the standard conventions of each document apply. **\\\n  \\substitute   \"iu\" \"iw\"\n  \\substitute   \"eu\" \"ew\"\n  \\substitute   \"au\" \"aw\"\n  \\substitute   \"ai\" \"ay\"\n  \\substitute   \"oi\" \"oy\"\n  \\substitute   \"ui\" \"uy\"\n\n  \\** Split long a  **\\\n  \\substitute   \"á\" \"aa\" \n\\end\n\n\\beg      processor\n\n  \n  \\beg    rules litteral \n    {A}                           === a\n    {AA}                          === aa     \n    {E}                           === e\n    {EE}                          === é     \n    {I}                           === (i,ï) \n    {II}                          === í     \n    {O}                           === o \n    {OO}                          === ó     \n    {U}                           === (u,ü) \n    {UU}                          === ú     \n                                      \n    {K}                           === (c,k)\n    {MB}                          === (b,mb)\n    {SS}                          === (z,ss)\n\n    {VOWELS}                      === {A}                             * {E}                           * {I}                             * {O}                             * {U}\n    {LVOWELS}                     === {AA}                            * {EE}                          * {II}                            * {OO}                            * {UU}\n    {TEHTAS_}                     === SARATI_QUENYA_A                 * SARATI_QUENYA_E               * SARATI_QUENYA_I                 * SARATI_QUENYA_O                 * SARATI_QUENYA_U \n    {STEHTAS}                     === {NULL}                          * SARATI_QUENYA_E               * SARATI_QUENYA_I                 * SARATI_QUENYA_O                 * SARATI_QUENYA_U \n    {LTEHTAS}                     === SARATI_QUENYA_A SARATI_DASH_U   * SARATI_QUENYA_E SARATI_DASH_U * SARATI_QUENYA_I SARATI_DASH_U   * SARATI_QUENYA_O SARATI_DASH_U   * SARATI_QUENYA_U SARATI_DASH_U \n    {LTEHTAS_FOR_CONSONANTS}      === SARATI_QUENYA_A                 * SARATI_QUENYA_E SARATI_DASH_U * SARATI_QUENYA_I SARATI_DASH_U   * SARATI_QUENYA_O SARATI_DASH_U   * SARATI_QUENYA_U SARATI_DASH_U\n\n    {V_L_KER_WN}                  === [ {VOWELS}  * {LVOWELS}                 * {NULL} ]\n    {V_IMG_FOR_CONSONNANTS_WN}    === [ {STEHTAS} * {LTEHTAS_FOR_CONSONANTS}  * SARATI_DOT_D ] \\** No vowel == dot below **\\\n\n    \\**  RULES   **\\\n\n    [{VOWELS}]            -->   [{TEHTAS_}] SARATI_QUENYA_LONG_VOWEL_CARRIER  \\** Isolated vowels : use short carrier (reversed order RTL) **\\\n    [{LVOWELS}]           -->   [{LTEHTAS}] SARATI_QUENYA_LONG_VOWEL_CARRIER  \\** Long vowels: carrier + dash + tehta **\\\n\n    \\**  FIRST LINE **\\\n\n    {L1_KER}              === t         * p         * {K}             * q                 * tt                      * pp                      * {K}{K}  \n    {L1_IMG}              === SARATI_T  * SARATI_P  * SARATI_QUENYA_C * SARATI_QUENYA_QU  * SARATI_DASH_D SARATI_T  * SARATI_DASH_D SARATI_P  * SARATI_DASH_D SARATI_QUENYA_C \n\n    [{L1_KER}]{V_L_KER_WN}    --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{L1_IMG}]\n\n    ty{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_TY\n    ts{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_TS\n\n    \\** Missing py, ps? **\\\n\n    \\**  SECOND LINE **\\\n\n    {L2_KER}        === nd                * {MB}              * ng        * ngw\n    {L2_IMG}        === SARATI_QUENYA_ND  * SARATI_QUENYA_MB  * SARATI_NG * SARATI_QUENYA_NGW\n\n    [{L2_KER}]{V_L_KER_WN}    --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{L2_IMG}]\n\n    ndy{V_L_KER_WN}           --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_NDY\n\n    \\** ########### **\\\n    \\**  THIRD LINE **\\\n\n    {L3_KER}        === (th,þ)            * f                   * (h,χ)     *  hw\n    {L3_IMG}        === SARATI_QUENYA_S   * SARATI_QUENYA_F_ALT * SARATI_H  *  SARATI_QUENYA_HW\n\n    [{L3_KER}]{V_L_KER_WN}    --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{L3_IMG}]\n\n    hy{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_HY\n\n    \\** # The two following are not treated the same way in tengwar **\\\n    ht{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_HT_ALT_1\n    hty{V_L_KER_WN}           --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_HTY\n   \n    \n    hl{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_HL\n    hr{V_L_KER_WN}            --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_HR\n    \n    \n\n    \\** ########### **\\\n    \\**  FOURTH LINE **\\\n\n    {LINE_4TH_KER}        === nt                * mp                * nc                * nq \\** # Not nqu, due to preprocessor **\\\n    {LINE_4TH_IMG}        === SARATI_QUENYA_NT  * SARATI_QUENYA_MP  * SARATI_QUENYA_NC  * SARATI_QUENYA_NQU\n    \n    [{LINE_4TH_KER}]{V_L_KER_WN}  --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_4TH_IMG}]\n    nty{V_L_KER_WN}               --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_NTY\n\n    \\** ########### **\\\n    \\**  FIFTH LINE **\\\n\n    {LINE_5TH_KER}        === n         * m         * ñ                         * ñw                * _nw                 * nn                      * mm\n    {LINE_5TH_IMG}        === SARATI_N  * SARATI_M  * SARATI_QUENYA_VELAR_NASAL * SARATI_QUENYA_NW  * SARATI_QUENYA_NW    * SARATI_DASH_D SARATI_N  * SARATI_DASH_D SARATI_M\n\n    [{LINE_5TH_KER}]{V_L_KER_WN}  --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_5TH_IMG}]\n    ny{V_L_KER_WN}                -->  {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_NY\n\n    \\** Missing my ? **\\\n\n    \\** ########### **\\\n    \\**  SIXTH LINE **\\\n\n    {LINE_6TH_KER}                === r        * v                    * y               * w         * rr  \n    {LINE_6TH_IMG}                === SARATI_R * SARATI_QUENYA_V_ALT  * SARATI_QUENYA_Y * SARATI_W  * SARATI_DASH_D SARATI_R \n\n    [{LINE_6TH_KER}]{V_L_KER_WN}  --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_6TH_IMG}]\n\n    \\** Weak r is not distinguished **\\\n    \\** Missing ry? rd?  **\\\n\n    \\** ########### **\\\n    \\**  L Line **\\\n\n    {LINE_L_KER}                === l         * ll                      * d\n    {LINE_L_IMG}                === SARATI_L  * SARATI_DASH_D SARATI_L  * SARATI_D\n\n    [{LINE_L_KER}]{V_L_KER_WN}  --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_L_IMG}]\n\n    \\**  Missing ld, ly, hl, hr ? **\\\n\n    \\** ########### **\\\n    \\**  S/Z line **\\\n\n    \\** st v **\\\n    \\** sty … **\\\n    \\** ss ¦ ou w ou i  **\\\n\n    \\**  For s, use the same sarat as for th **\\\n\n    {LINE_8TH_KER}        === s                 * {SS}   \n    {LINE_8TH_IMG}        === SARATI_QUENYA_S   * SARATI_QUENYA_SS_ALT_1 \n\n    [{LINE_8TH_KER}]{V_L_KER_WN} --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_8TH_IMG}]\n\n    {LINE_8PTH_KER}        === st                 * sty\n    {LINE_8PTH_IMG}        === SARATI_QUENYA_ST   * SARATI_QUENYA_STY \n\n    [{LINE_8PTH_KER}]{V_L_KER_WN} --> 2,1 --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_8PTH_IMG}]\n\n    \\** ############ **\\\n    \\**  OTHERS **\\\n\n    x {V_L_KER_WN}   --> {V_IMG_FOR_CONSONNANTS_WN} SARATI_QUENYA_X\n  \\end\n    \n  \\beg    rules punctuation\n    . --> PUNCT_2_DOT\n    ! --> PUNCT_2_DOT\n    ? --> PUNCT_2_DOT\n    \n    , --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    : --> PUNCT_DOT\n    \n    - --> SARATI_SPACE\n    – --> SARATI_SPACE\n    \n    · --> {NULL}\n    \' --> {NULL}\n    [ --> {NULL}\n    ] --> {NULL}\n    ‘ --> {NULL}\n    ’ --> {NULL}\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL}\n    » --> {NULL}\n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\reverse\n\\end\n\n\\**  Ponctuation **\\\n\n\n\n\\** ############### **\\\n\\**  Helpers, transcribed from amanye tenceli **\\\n\n\\** ########### **\\\n\\** # p Z **\\\n\\** # t \" **\\\n\\** # c # **\\\n\\** # q p **\\\n\n\\** # ty ± **\\\n\\** # ts g **\\\n\n\\** ########### **\\\n\\** # mb _ **\\\n\\** # nd € **\\\n\\** # ndy ³ **\\\n\\** # ng & **\\\n\\** # ngw s **\\\n\n\\** ########### **\\\n\n\\** # f \\ ou [ ## Aside or below **\\\n\\** # s (th) Ÿ **\\\n\\** # hy ½ **\\\n\\** # h Ë **\\\n\\** # hw º **\\\n\n\\** # ht ² ou ‚ **\\\n\\** # hty Œ **\\\n\n\\** ########### **\\\n\n\\** # mp d **\\\n\\** # nt ª **\\\n\\** # nty „ **\\\n\\** # nc — **\\\n\\** # nq ˜ **\\\n\n\\** ########### **\\\n\n\\** # m P **\\\n\\** # n À **\\\n\\** # ny ‰ **\\\n\\** # ñ + **\\\n\\** # nw , **\\\n\n\\** ########### **\\\n\n\\** # v a ou ` ## Aside or below **\\\n\\** # r F **\\\n\\** # y » **\\\n\\** # w ¹ **\\\n\n\\** ########### **\\\n\n\\** # l ? **\\\n\n\\** ########### **\\\n\n\\** # st v **\\\n\\** # sty … **\\\n\\** # ss ¦ ou w ou i  **\\\n\n\\** ################ **\\\n\n\\** # x (ks) y **\\\n\n\n\\** # GEMINATION -> ó **\\\n\\** # PRECEDING S -> ý **\\\n\\** # SHORT CARRIER -> È **\\\n\\** #  **\\\n\\** # Vowels : **\\\n\\** # Stop Vowel: Ó **\\\n\\** # i   Ò **\\\n\\** # e   è ou Ô **\\\n\\** # a   Ö **\\\n\\** # o   Ü **\\\n\\** # u   Þ **\\\n\\** #  **\\\n\\** # Long Vowels: **\\\n\\** # Carrier dash : ò **\\\n\\** # Always use carrier dashes EXCEPT for a **\\\n\n      \n\n"
Glaemscribe.resource_manager.raw_modes["quenya"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more\nspecifically dedicated to the transcription of J.R.R. Tolkien\'s\ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\**\n  TODO : Option for dot or not in \'a implicit\' option before long vowels ?\n  TODO : bb, dd etc ? (for noobs)\n**\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"added χ for the word χarina, correcting ts/ps sequences to work better with eldamar\"\n  \\entry \"0.0.3\" \"added o/u curl option\"\n  \\entry \"0.0.4\" \"added voiced plosives corner cases treatment and option to chose method\"\n  \\entry \"0.0.5\" \"fixing h+long vowel medially\"\n  \\entry \"0.0.6\" \"adding option for alveolarized consonants  st (t+t), pt (p+t), ht (c+t)\"\n  \\entry \"0.0.7\" \"Fixing rb/lb, to be treated as r+mb and l+mb\"\n  \\entry \"0.0.8\" \"Correcting double dot version for ry (aesthetics)\"\n  \\entry \"0.0.9\" \"Adding \'implicit a\' option.\"\n  \\entry \"0.1.0\" \"Simplified diacritic use by using new post-processor directive\"\n  \\entry \"0.1.1\" \"Added default option for voiced plosives : use mb, nd, ng, ngw\"\n  \\entry \"0.1.2\" \"Added a tehta shape selection\"\n  \\entry \"0.1.3\" \"Fixing ks, ps, ts. Fixing dot under ore, romen in implicit a mode.\"\n  \\entry \"0.1.4\" \"Conforming to the new csub format. Cleaning with new csub classes.\"\n  \\entry \"0.1.5\" \"csub removed. Now using virtual chars defined in charsets.\"\n  \\entry \"0.1.6\" \"Removing unutixe under óre for coherency in implicit a submode.\"\n  \\entry \"0.9.0\" \"Adding double tehtar support\"\n  \\entry \"0.9.1\" \"Added support for the FreeMonoTengwar font\"\n  \\entry \"0.9.2\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.9.4\" \"Adding Vanyarin ldy, rdy, lg, rg, ff\"\n  \\entry \"0.9.5\" \"Added support for inlined raw tengwar\"\n  \\entry \"0.9.6\" \"Added support for non-breaking spaces\"     \n  \\entry \"0.9.7\" \"Correcting visibility options to conform to new glaeml args strict syntax\"\n  \\entry \"0.9.8\" \"Adding palatalized geminates (requested)\"\n  \\entry \"0.9.9\" \"Hotfix on 0.9.8\"\n\\end\n\\version  \"0.9.9\"\n\n\\language \"Quenya\"\n\\writing  \"Tengwar\"\n\\mode     \"Quenya Tengwar - Classical\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\raw_mode \"raw-tengwar\"\n\n\\beg      options\n  \\option implicit_a false\n  \n  \\beg option a_tetha_shape A_SHAPE_THREE_DOTS\n    \\value A_SHAPE_THREE_DOTS 1\n    \\value A_SHAPE_CIRCUMFLEX 2\n  \\end\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n  \\beg option long_vowels_format LONG_VOWELS_USE_LONG_CARRIER\n    \\value LONG_VOWELS_USE_LONG_CARRIER 1\n    \\value LONG_VOWELS_USE_DOUBLE_TEHTAR 2\n  \\end  \n  \n  \\** REMOVED BECAUSE UNATTESTED\n  \\beg option double_tehta_a false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  **\\\n  \\beg option double_tehta_e false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_i false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_o true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_u true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \n  \\option split_diphthongs false\n  \\option always_use_romen_for_r false\n  \n  \\beg option voiced_plosives_treatment VOICED_PLOSIVES_AS_NASALIZED\n    \\value VOICED_PLOSIVES_AS_NASALIZED 0\n    \\value VOICED_PLOSIVES_WITH_STROKE 1\n    \\value VOICED_PLOSIVES_WITH_XTD 2\n  \\end\n  \\beg option st_pt_ht ST_PT_HT_SEPARATED\n    \\value ST_PT_HT_SEPARATED 1\n    \\value ST_PT_HT_WITH_XTD 2\n  \\end\n  \n  \\beg option palatalized_geminates PALATALIZED_GEMINATES_SPLIT\n    \\value PALATALIZED_GEMINATES_SPLIT 0\n    \\value PALATALIZED_GEMINATES_CUMULATE 1\n  \\end\n  \n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n  \n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n\n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\n  \\** Dis-ambiguate qu **\\\n  \\substitute   \"qu\" \"q\" \n  \n  \\if \"palatalized_geminates == PALATALIZED_GEMINATES_SPLIT\"\n    \\substitute     \"ppy\"       \"p|py\"\n    \\substitute     \"tty\"       \"t|ty\"\n    \\rxsubstitute   \"[ck][ck]y\" \"k|ky\"\n\n    \\substitute     \"nny\"       \"n|ny\"\n    \\substitute     \"mmy\"       \"m|my\"\n\n    \\substitute     \"nnty\"      \"n|nty\"\n    \\substitute     \"nndy\"      \"n|ndy\"\n    \n    \\substitute     \"rry\"       \"r|ry\"\n    \\substitute     \"rrdy\"      \"r|rdy\"\n\n    \\substitute     \"lly\"       \"l|ly\"\n    \\substitute     \"lldy\"      \"l|ldy\"\n  \\endif\n  \n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n\n\n\\beg processor\n\n  \\beg    rules litteral\n    \n    {K}                 ===  (c,k)\n    {SS}                ===  (z,ss)\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n    \\endif\n    \n    {PALATAL} === PALATAL_SIGN\n\n    {VOWELS}            === a               *  e              * i              * o              *  u\n    {LVOWELS}           === á               *  é              * í              * ó              *  ú\n\n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif\n\n    \\if \"a_tetha_shape == A_SHAPE_THREE_DOTS\"\n      {A_SHAPE}         === A_TEHTA\n    \\else\n      {A_SHAPE}         === A_TEHTA_CIRCUM\n    \\endif\n\n    \\if implicit_a\n      {_A_}              === {NULL}\n      {_NVOWEL_}         === NO_VOWEL_DOT\n    \\else\n      {_A_}              === {A_SHAPE}\n      {_NVOWEL_}         === {NULL}\n    \\endif\n\n    {_TEHTAR_}          === {_A_}      *  E_TEHTA     *  I_TEHTA    * {O_LOOP}    *  {U_LOOP}\n\n    \\if split_diphthongs\n      {WDIPHTHONGS}     === {NULL}\n      {_WDIPHTHONGS_}   === {NULL}\n    \\else\n      {DIPHTHONGS}      === ai            * au            * eu            * iu             * oi               * ui\n      {_DIPHTHONGS_}    === YANTA {_A_}   * URE {_A_}     * URE E_TEHTA   * URE I_TEHTA    * YANTA {O_LOOP}   * YANTA {U_LOOP}\n      {WDIPHTHONGS}     === * {DIPHTHONGS}   \\** groovy! **\\\n      {_WDIPHTHONGS_}   === * {_DIPHTHONGS_} \\** same thing **\\\n    \\endif\n    \n		{_LONG_A_}      === ARA {A_SHAPE}\n		{_LONG_E_}      === ARA E_TEHTA	\n		{_LONG_I_}      === ARA I_TEHTA\n		{_LONG_O_}      === ARA {O_LOOP}	\n		{_LONG_U_}      === ARA {U_LOOP}\n		{_LONE_LONG_A_} === {_LONG_A_}\n		{_LONE_LONG_E_} === {_LONG_E_}\n		{_LONE_LONG_I_} === {_LONG_I_}\n		{_LONE_LONG_O_} === {_LONG_O_}\n		{_LONE_LONG_U_} === {_LONG_U_}\n    \n    {LTEHTAR}       === {NULL}\n    {_LTEHTAR_}     === {NULL} 				\n    	\n		\\if implicit_a\n     	{_LONG_A_}         === {A_SHAPE}        \\** Eat the long a **\\\n  		{_LONE_LONG_A_}    === TELCO {A_SHAPE}  \\** Eat the long a **\\\n      {LTEHTAR}          === {LTEHTAR}   * á\n      {_LTEHTAR_}        === {_LTEHTAR_} * {_LONG_A_}\n    \\endif\n 		\n		\\if \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n    \\** REMOVED BECAUSE UNATTESTED\n	    \\if \"double_tehta_a && !implicit_a\"\n		    {_LONG_A_}       === A_TEHTA_DOUBLE\n			  {_LONE_LONG_A_}  === TELCO {_LONG_A_}\n        {LTEHTAR}        === {LTEHTAR}   * á\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_A_}\n  	  \\endif		\n    **\\\n	    \\if double_tehta_e\n		    {_LONG_E_}       === E_TEHTA_DOUBLE\n		    {_LONE_LONG_E_}  === TELCO {_LONG_E_}\n        {LTEHTAR}        === {LTEHTAR}   * é\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_E_}\n			\\endif\n		  \\if double_tehta_i\n		    {_LONG_I_}       === I_TEHTA_DOUBLE\n		    {_LONE_LONG_I_}  === TELCO {_LONG_I_}\n        {LTEHTAR}        === {LTEHTAR}   * í\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_I_}\n		  \\endif\n		  \\if double_tehta_o\n		    {_LONG_O_}       === {O_LOOP_DOUBLE}\n		    {_LONE_LONG_O_}  === TELCO {_LONG_O_}\n        {LTEHTAR}        === {LTEHTAR}   * ó\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_O_}\n		  \\endif\n		  \\if double_tehta_u\n		    {_LONG_U_}       === {U_LOOP_DOUBLE}\n		    {_LONE_LONG_U_}  === TELCO {_LONG_U_}\n        {LTEHTAR}        === {LTEHTAR}   * ú\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_U_}\n		  \\endif\n    \\endif  \n       		\n    \\** images of long vowels, either tehtar or ara versions **\\\n    {_LVOWELS_}     === {_LONG_A_} * {_LONG_E_} * {_LONG_I_} * {_LONG_O_} * {_LONG_U_}      \n\n		{WLONG}         === * {LVOWELS} \n		{_WLONG_}       === * {_LVOWELS_}\n\n    {V_D}           === [ {VOWELS} {WLONG} {WDIPHTHONGS} ]\n    {V_D_WN}        === [ {VOWELS} {WLONG} {WDIPHTHONGS} * {NULL} ]\n\n    {_V_D_}         === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} ]\n    {_V_D_WN_}      === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} * {_NVOWEL_} ]\n		\n		\\** LONE SHORT VOWELS **\\\n    [{VOWELS}]    --> TELCO [{_TEHTAR_}]  \\** Replace isolated short vowels **\\\n    \n		\\** LONE LONG VOWELS **\\	\n		[{LVOWELS}]   --> [{_LONE_LONG_A_} * {_LONE_LONG_E_} * {_LONE_LONG_I_} * {_LONE_LONG_O_} * {_LONE_LONG_U_}]\n\n    \\if !split_diphthongs\n      [{DIPHTHONGS}]    -->   [{_DIPHTHONGS_}]     \\**  Replace diphthongs **\\\n    \\endif\n\n    \\** ===================== **\\\n    \\**     1ST LINE RULES    **\\\n    \\** ===================== **\\\n    {L1}          === t     * p       * {K}   * q\n    {_L1_}        === TINCO * PARMA   * CALMA * QUESSE\n\n    \\** GEMINATED **\\\n    {L1_1_GEMS}   === tt               * pp                 * {K}{K}\n    {_L1_1_GEMS_} === TINCO {GEMINATE} * PARMA {GEMINATE}   * CALMA {GEMINATE}\n\n    \\** NORMAL **\\\n    [ {L1} * {L1_1_GEMS} ] {V_D_WN} --> [ {_L1_} * {_L1_1_GEMS_} ] {_V_D_WN_}\n\n    \\** PALATAL **\\\n    [t * p * {K}] y {V_D_WN} --> [TINCO * PARMA * CALMA] {PALATAL} {_V_D_WN_}\n    \n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [tt * pp * {K}{K}] y {V_D_WN} --> [TINCO * PARMA * CALMA] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n    \n    \\** For alveolarized consonants, we must put the alveolar_sign just after the tengwa\n        because else, FreeMonoTengwar will not handle well the ligature. Anyway, this is\n        more logical, but the tehta placement will not be perfect for older fonts **\\\n    ts{V_D_WN}          --> TINCO ALVEOLAR_SIGN {_V_D_WN_} \n    ps{V_D_WN}          --> PARMA ALVEOLAR_SIGN {_V_D_WN_} \n    {K}s{V_D_WN}        --> CALMA ALVEOLAR_SIGN {_V_D_WN_}   \n    x{V_D_WN}           --> CALMA ALVEOLAR_SIGN {_V_D_WN_}   \\** render ks for x **\\\n\n    \\** ===================== **\\\n    \\**     2ND LINE RULES    **\\\n    \\** ===================== **\\\n    {L2}          === nd      * mb        * ng      * ngw\n    {_L2_}        === ANDO    * UMBAR     * ANGA    * UNGWE\n\n    \\** STANDARD **\\\n    [{L2}]{V_D_WN}  --> [{_L2_}]{_V_D_WN_}\n\n    \\** Palatalized **\\\n    ndy{V_D_WN} --> ANDO {PALATAL} {_V_D_WN_}\n\n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [nnd] y {V_D_WN} --> [ANDO] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n\n    \\** Have some rules for d,b,g,gw although there are not theoritically possible, aldudénie e.g needs it **\\\n    {L2_UN}               === d       * b         * g       * gw\n\n    \\if \"voiced_plosives_treatment == VOICED_PLOSIVES_AS_NASALIZED\"\n      [{L2_UN}]{V_D_WN}   --> [{_L2_}] {_V_D_WN_}\n    \\elsif \"voiced_plosives_treatment == VOICED_PLOSIVES_WITH_STROKE\"\n      [{L2_UN}]{V_D_WN}   --> [{_L2_}] THINF_STROKE {_V_D_WN_}\n    \\else\n      {_L2_UN_}            === TW_EXT_21 * TW_EXT_22 * TW_EXT_23 * TW_EXT_24\n      [{L2_UN}]{V_D_WN}    --> [{_L2_UN_}] {_V_D_WN_}\n    \\endif\n\n    \\if \"st_pt_ht == ST_PT_HT_WITH_XTD\"\n      {L2_ALVEOLARIZED}     === st        * pt        * ht\n      {_L2_ALVEOLARIZED_}   === TW_EXT_11 * TW_EXT_12 * TW_EXT_13\n\n      [{L2_ALVEOLARIZED}]{V_D_WN}  --> [{_L2_ALVEOLARIZED_}] {_V_D_WN_}\n    \\endif\n\n    \\** ===================== **\\\n    \\**     3RD LINE RULES    **\\\n    \\** ===================== **\\\n    {L3}      === (th,þ) * f       * (h,χ)  * hw\n    {_L3_}    === SULE   * FORMEN  * AHA    * HWESTA\n\n    {L3_GEMS}   === ff\n    {_L3_GEMS_} === FORMEN {GEMINATE}\n\n    \\** NORMAL **\\\n    [{L3}]{V_D_WN}        --> [{_L3_}]{_V_D_WN_}\n    [{L3_GEMS}]{V_D_WN}   --> [{_L3_GEMS_}]{_V_D_WN_}\n\n    \\** OTHERS **\\\n    hy{V_D_WN}      --> HYARMEN {PALATAL} {_V_D_WN_}\n\n    \\** Override h with vowels (descendent of hy) **\\\n    _h{V_D}         --> HYARMEN {_V_D_}\n    \\** Starting voiced h before long vowels **\\\n    _h[{LVOWELS}]   --> HYARMEN [{_LVOWELS_}]\n\n    (h,χ)           --> AHA\n\n    \\** ===================== **\\\n    \\**     4TH LINE RULES    **\\\n    \\** ===================== **\\\n    {L4}   === nt    * mp    * nc    * nq      \\** Not nqu, due to preprocessor **\\\n    {_L4_} === ANTO  * AMPA  * ANCA  * UNQUE\n\n    \\** NORMAL **\\\n    [{L4}]{V_D_WN}    --> [{_L4_}]{_V_D_WN_}\n\n    \\** PALATAL **\\\n    nty {V_D_WN}       --> ANTO {PALATAL} {_V_D_WN_}\n\n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [nnt] y {V_D_WN} --> [ANTO] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n\n    \\** ===================== **\\\n    \\**     5TH LINE RULES    **\\\n    \\** ===================== **\\\n    {L5}   === n     * m     * ñ     * ñw      * _nw\n    {_L5_} === NUMEN * MALTA * NOLDO * NWALME  * NWALME\n\n    [{L5}]{V_D_WN}  --> [{_L5_}]{_V_D_WN_}\n\n    nn{V_D_WN}          --> NUMEN {GEMINATE}   {_V_D_WN_}\n    mm{V_D_WN}          --> MALTA {GEMINATE}   {_V_D_WN_}\n    \n    ny{V_D_WN}          --> NUMEN {PALATAL} {_V_D_WN_}\n    my{V_D_WN}          --> MALTA {PALATAL} {_V_D_WN_}\n\n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [nn * mm] y {V_D_WN} --> [NUMEN * MALTA] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n\n    \\** ===================== **\\\n    \\**     6TH LINE RULES    **\\\n    \\** ===================== **\\\n\n    {_LONE_R_} === ORE \\** TODO: Add dot for full unutixe, don\'t add dot for lazy unutixe **\\\n    \\if always_use_romen_for_r\n      \\** Override lone r if option is on **\\\n      {_LONE_R_} === ROMEN {_NVOWEL_} \n    \\endif\n\n    {L6}        === r     * v     * y                * w\n    {_L6_}      === ROMEN * VALA  * ANNA {PALATAL}   * VILYA\n    \n    \\**  PE19:94 **\\\n    {L6}   === {L6} * rg * lg\n    {_L6_} === {_L6_} * {_LONE_R_} NOLDO * LAMBE NOLDO\n    \n    [{L6}]{V_D_WN} --> [{_L6_}]{_V_D_WN_}\n\n    \\** Override rule r + null **\\\n    r                 --> {_LONE_R_}\n \n    rd{V_D_WN}        --> ARDA {_V_D_WN_}\n \n    rr{V_D_WN}        --> ROMEN {GEMINATE} {_V_D_WN_}\n    rrd{V_D_WN}       --> ARDA {GEMINATE} {_V_D_WN_}\n    \n    ry{V_D_WN}        --> ROMEN {PALATAL} {_V_D_WN_}\n    rdy{V_D_WN}       --> ARDA {PALATAL} {_V_D_WN_}\n    \n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [rr * rrd] y {V_D_WN} --> [ROMEN * ARDA] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n\n    \\** ===================== **\\\n    \\**     L  LINE RULES     **\\\n    \\** ===================== **\\\n    {LINE_L}          === l     * ld      * ll                * lld\n    {_LINE_L_}        === LAMBE * ALDA    * LAMBE {GEMINATE}  * ALDA {GEMINATE}\n\n    [{LINE_L}]{V_D_WN}    --> [{_LINE_L_}]{_V_D_WN_}\n\n    ly{V_D_WN}            --> LAMBE {PALATAL} {_V_D_WN_}\n    ldy{V_D_WN}           --> ALDA  {PALATAL} {_V_D_WN_}\n    \n    \\if \"palatalized_geminates == PALATALIZED_GEMINATES_CUMULATE\"\n      [ll * lld] y {V_D_WN} --> [LAMBE * ALDA] {GEMINATE} {PALATAL} {_V_D_WN_}\n    \\endif\n    \n    hl{V_D_WN}            --> HALLA LAMBE {_V_D_WN_}\n    hr{V_D_WN}            --> HALLA ROMEN {_V_D_WN_}\n\n    \\** ===================== **\\\n    \\**   S/Z LINE RULES      **\\\n    \\** ===================== **\\\n    \n    \\** SILME is a bit tricky : the shape is not linked to voicing but to a tehta presence or not **\\\n    {L8}              === s               * {SS}\n    {_L8_TEHTAR_}     === SILME_NUQUERNA  * ESSE_NUQUERNA\n    {_L8_NO_TEHTAR_}  === SILME           * ESSE\n\n    [{L8}][{VOWELS}]   --> [{_L8_TEHTAR_}][{_TEHTAR_}]\n    [{L8}][{LTEHTAR}]  --> [{_L8_TEHTAR_}][{_LTEHTAR_}]\n    \n    {L8}               --> {_L8_NO_TEHTAR_}\n    {L8}[{DIPHTHONGS}] --> {_L8_NO_TEHTAR_}[{_DIPHTHONGS_}]\n    \n  \\end\n\n  \\beg    rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN\n    » --> DQUOT_CLOSE\n\n    - --> {NULL}\n    – --> PUNCT_TILD\n    — --> PUNCT_TILD\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n\n  \\end\n\n  \\beg    rules  numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11\n  \\end\n\n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end\n\n"
Glaemscribe.resource_manager.raw_modes["rlyehian"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** largely based on the Cthuvian dictionary compiled by cyberangel at yog-sothoth forums **\\\n\\** Discussion on the incatena forum : http://www.incatena.org/viewtopic.php?f=4&t=37194&start=1225 **\\\n\\** This reconstruction : http://conworkshop.info/view_language.php?l=RLH **\\\n\n\\** Changelog **\\\n\n\\**  R\'lyehian mode for glaemscribe : a non-euclidian joke, muhahahaha **\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"First version\"\n	\\entry \"0.0.2\" \"Ported to virtual chars\"\n	\\entry \"0.0.3\" \"Ported to various charsets\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"\n\\end\n\n\\language \"R\'lyehian\"\n\\writing  \"Tengwar\"\n\\mode     \"R\'lyehian Tengwar - G*\"\n\\version  \"0.1.1\"\n\\authors  \"H.P.Lovecraft & The Great Ancient Gods, impl. Fthalagn\"\n\n\\world      other_world\n\\invention  experimental\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\beg      options\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute \"ä\" \"a\"\n  \\substitute \"ë\" \"e\"\n  \\substitute \"ï\" \"i\"\n  \\substitute \"ö\" \"o\"\n  \\substitute \"ü\" \"u\"\n  \\substitute \"ÿ\" \"y\"\n\\end\n\n\\** Use H as gutturals **\\\n\n\n\\**\n\nHPL :\n-----\nPh\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn\nYgnaiih ... ygnaiih ... thflthkh\'ngha ... Yog-Sothoth ... y\'bthnk .. h\'ehye-n\'grkdl\'lh\nN\'gai, n\'gha\'ghaa, bugg-shoggog, y\'hah, Yog-Sothoth\nY\'ai \'ng\'ngah, Yog-Sothoth h\'ee - l\'geb f\'ai throdog uaaah\nogthrod ai\'f geb\'l - ee\'h Yog-Sothoth \'ngah\'ng ai\'y zhro\n\n\nDERLETH (The Return of Hastur) :\n--------------------------------\nCthulhu naflfhtagn\n\nCAMPBELL (The Moon-Lens) :\n--------------------------\nGof\'nn hupadgh Shub-Niggurath\n\nBRUNNER (Concerning the Forthcoming) :\n--------------------------------------\nLlllll-nglui, nnnn-lagl, fhtagn-ngah, ai Yog-Sothoth!\n\nPEREZ (The Likeness) :\n----------------------\nIa! Vthyarilops! Ut ftaghu wk\'hmr Vthyarilops! Ia! Ia!\n\nGLASBY (Return to Y\'ha-nthlei) :\n--------------------------------\nShtunggli grah\'nn fhhui Y\'ha-nthlei vra Dagon chtenff.\n\nKUTTNER (The Salem Horror):\n---------------------------\nYa na kadishtu nilgh\'ri \nstell\'bsna kn\'aa Nyogtha \nk\'yarnak phlegethor\n\nLUMLEY (The Burrowers Beneath):\n-------------------------------\nYa na kadishtu nilgh\'ri stell\'bsna Nyogtha, \nK\'yarnak phlegethor l\'ebumna syha\'h n\'ghft, \nYa hai kadishtu ep r\'luh-eeh Nyogtha eeh, \ns\'uhn-ngh athg li\'hee orr\'e syha\'h.\n\nRUSSELL (Faith):\n----------------\nCthugha fm\'latgh mnahn\' hlirgh! \nCthugha ch\'nw hafh\'drn! \nCthugha fm\'latgh uh\'e wfaqa!\n\nVESTER (Innsmouth\'s gold):\n--------------------------\nCthulhu fhtagn - G\'thugha w\'gah! \nNg\'goka y\'gotha ooboshu R\'lyeh! \nCthulhu fhtagn! Fhtagn!\n\nCLORE (The Dying God):\n----------------------\nsll\'ha-gn\'wgn-ll\'ah-sgn\'wahl\n\nI vs Y :\n========\nY looks like a semi vowel after consonants (r\'lyeh) but \nsometimes found as a vowel  \n\nC vs K : \n========\nWe should probably use c == k\n\n\n\'  Glottal stop\n+h cthuvianisation (aspiration + pharyngalisation)\n\na i u o e w\n\n\nb\nd\nc ch\nk kh\ng gh\nh hh hy\nl lh ly\nf fh\nn \nm\np ph\nr rh\ns sh\nt th\nz zh\n\ny palatal semi vowel ?\n\n**\\\n\n\\beg      processor\n\n  \\beg    rules litteral  \n    {VOWELS}            === a               *  e              * i              * o              *  u  * w\n\n    {O_LOOP}        === O_TEHTA\n    {U_LOOP}        === U_TEHTA\n       \n    {TEHTAR}            === A_TEHTA      * E_TEHTA      * I_TEHTA    * O_TEHTA     * U_TEHTA * SEV_TEHTA\n  \n    [{VOWELS}]          --> TELCO [{TEHTAR}]  \\** Replace isolated short vowels **\\\n  \n    {WDIPHTHONGS}       === {NULL} \n    {WDIPHTHENGS}       === {NULL}\n      \n    {V_D_KER}           === [ {VOWELS} {WDIPHTHONGS} ]\n    {V_D_KER_WN}        === [ {VOWELS} {WDIPHTHONGS} * {NULL} ]\n\n    {V_D_IMG}        === [ {TEHTAR} {WDIPHTHENGS} ]\n    {V_D_IMG_WN}     === [ {TEHTAR} {WDIPHTHENGS} * {NULL} ] \n  \n    {L1_KER_1}        === t                   * p  \n    {L1_IMG_1}        === TINCO               * PARMA\n    {L1_KER_2}        === (c,k)                   \n    {L1_IMG_2}        === CALMA               \n    \n    \\** NORMAL **\\\n    [ {L1_KER_1} ] [{NULL} * h] {V_D_KER_WN}  --> [ {L1_IMG_1} ] [{NULL} * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n    [ {L1_KER_2} ] [{NULL} * h] {V_D_KER_WN}  --> [ {L1_IMG_2} ] [{NULL} * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n\n    {L2_KER}        === d      * b        * g      \n    {L2_IMG}        === ANDO   * UMBAR    * ANGA    \n    [ {L2_KER} ] [{NULL} * h] {V_D_KER_WN}  --> [ {L2_IMG} ] [{NULL} * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n  \n    {L3_KER} === f\n    {L3_IMG} === FORMEN\n    [ {L3_KER} ] [{NULL} * h] {V_D_KER_WN}  --> [ {L3_IMG} ] [{NULL} * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n \n    {L5_KER}  === n     * m     \n    {L5_IMG}  === NUMEN * MALTA \n    [ {L5_KER} ] [{NULL} * h] {V_D_KER_WN}  --> [ {L5_IMG} ] [{NULL} * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n  \n    r [{NULL} * y * h] {V_D_KER_WN} --> ROMEN [{NULL} * PALATAL_SIGN * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n    s {V_D_KER_WN} --> SILME_NUQUERNA {V_D_IMG_WN}\n    z {V_D_KER_WN} --> ESSE_NUQUERNA {V_D_IMG_WN}\n\n    l [{NULL} * y * h] {V_D_KER_WN} --> LAMBE [{NULL} * PALATAL_SIGN * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n    h [{NULL} * y * h] {V_D_KER_WN} --> AHA [{NULL} * PALATAL_SIGN * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n    v [{NULL} * y * h] {V_D_KER_WN} --> VALA [{NULL} * PALATAL_SIGN * GEMINATE_SIGN_TILD] {V_D_IMG_WN}\n \n    y {V_D_KER_WN} --> VILYA {V_D_IMG_WN}\n\n    \' --> HARP_SHAPED\n    ’ --> HARP_SHAPED\n\n  \\end\n  \n  \\beg rules punctutation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> PUNCT_DOT    \n    – --> PUNCT_TILD  \n    — --> PUNCT_DTILD\n \n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11   \n  \\end\n	\n\\end\n\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end  \n"
Glaemscribe.resource_manager.raw_modes["sindarin-beleriand"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Sindarin Beleriand mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\\beg changelog\n  \\entry \"0.0.2\" \"Added lw\"\n  \\entry \"0.0.3\" \"Added thorn as equivalent for th\"\n  \\entry \"0.0.4\" \"Porting to virtual chars to simplify and beautify\"\n  \\entry \"0.0.5\" \"Added charset support for Annatar\"\n  \\entry \"0.0.6\" \"Added support for the FreeMonoTengwar font\"\n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"\n  \\entry \"0.1.2\" \"Fine tuning handling of the aw diphthong (Thanks to Dmitry Kourmyshov!)\"\n  \\entry \"0.1.3\" \"Merging au/aw\"\n\\end\n\n\\language \"Sindarin\"\n\\writing  \"Tengwar\"\n\\mode     \"Sindarin Tengwar - Beleriand\"\n\\version  \"0.1.3\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\beg      options\n\n  \\beg option beleriand_aw_diphthong AW_VILYA_AT_ENDINGS_CURL_ELSE\n    \\value AW_VILYA_AT_ENDINGS_CURL_ELSE 0\n    \\value AW_ALWAYS_VILYA 1\n    \\value AW_ALWAYS_CURL  2\n  \\end\n\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\option reverse_numbers true\n  \n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n  \n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\** We should do better for that one (todo) **\\\n  \\substitute œ e\n\n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\** Special case of starting \'i\' before vowels, replace i by j **\\     \n  \\rxsubstitute \"\\\\bi([aeouyáāâéēêíīîóōôúūûýȳŷ])\" \"j\\\\1\"\n  \n  \\** Special case of diphtong aw. Before vowels, do not treat \'aw\' as diphthong, \n  since it seems more logical that aw would behave as a semi vowel **\\\n  \\rxsubstitute \"aw([aeouyáāâéēêíīîóōôúūûýȳŷ])\" \"a|w\\\\1\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral\n  \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n      {NASAL}    === NASALIZE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n      {NASAL}    === NASALIZE_SIGN\n    \\endif\n  \n    {A}                 === a\n    {AA}                === á\n    {E}                 === e\n    {EE}                === é\n    {I}                 === i\n    {II}                === í\n    {O}                 === o\n    {OO}                === ó\n    {U}                 === u\n    {UU}                === ú\n    {Y}                 === y\n    {YY}                === ý\n    \n    {AE}                === {A}{E}\n    {AI}                === {A}{I}\n    {AU}                === {A}{U}\n    {AW}                === {A}w\n    {EI}                === {E}{I}\n    {UI}                === {U}{I}\n    {OE}                === {O}{E}\n             \n    {K}                 === (c,k)\n\n    \\** RULES **\\\n    {A}                 --> OSSE\n    {E}                 --> YANTA\n    {I}                 --> TELCO\n    {O}                 --> ANNA\n    {U}                 --> URE\n    \n    {Y}                 --> SILME_NUQUERNA_ALT\n\n    {AA}                --> OSSE  E_TEHTA\n    {EE}                --> YANTA E_TEHTA\n    {II}                --> TELCO E_TEHTA\n    {OO}                --> ANNA  E_TEHTA\n    {UU}                --> URE   E_TEHTA\n    {YY}                --> SILME_NUQUERNA_ALT E_TEHTA\n\n    {AE}                --> OSSE  YANTA  \\** Should chose between OSSE YANTA and OSSE THSUP_TICK_INV_L. Old tengscribe had second one, amanye tenceli has first one. **\\ \n    {AI}                --> OSSE  Y_TEHTA\n    {AU}                --> OSSE  SEV_TEHTA \n    \n    \\if \"beleriand_aw_diphthong == AW_VILYA_AT_ENDINGS_CURL_ELSE\"\n      ({AU},{AW})         --> OSSE SEV_TEHTA\n      ({AU},{AW})_        --> OSSE VILYA\n    \\elsif \"beleriand_aw_diphthong == AW_ALWAYS_VILYA\"\n      ({AU},{AW})         --> OSSE VILYA\n    \\elsif \"beleriand_aw_diphthong == AW_ALWAYS_CURL\"\n      ({AU},{AW})         --> OSSE SEV_TEHTA\n    \\endif\n      \n    {EI}                --> YANTA Y_TEHTA\n    {UI}                --> URE   Y_TEHTA\n    {OE}                --> ANNA  YANTA\n\n    \\** ======== **\\\n    \\** 1ST LINE **\\\n    \\** ======== **\\\n    {L1}         === t     * p      * {K}\n    {_L1_}       === TINCO * PARMA  * CALMA\n\n    [{L1}]       --> [{_L1_}]\n \n    nt   --> TINCO {NASAL}\n    mp   --> PARMA {NASAL}\n    n{K} --> CALMA {NASAL}\n\n    \\** ======== **\\\n    \\** 2ND LINE **\\\n    \\** ======== **\\\n    {L2}   === d     * b     * g \n    {_L2_} === ANDO  * UMBAR * ANGA \n\n    [{L2}] --> [{_L2_}]\n\n    mb   --> UMBAR  {NASAL}\n    nd   --> ANDO   {NASAL}\n\n    \\** ======== **\\\n    \\** 3RD LINE **\\\n    \\** ======== **\\\n    {L3}   === (þ,th) * (f,ph,ff) * ch\n    {_L3_} === SULE   * FORMEN    * AHA\n     \n    [{L3}] --> [{_L3_}]\n\n    nth   --> SULE    {NASAL}\n    mph   --> FORMEN  {NASAL}\n    nf    --> FORMEN  {NASAL}\n    nch   --> AHA     {NASAL}\n\n    \\** ======== **\\\n    \\** 4TH LINE **\\\n    \\** ======== **\\\n    {L4}    === (đ,ð,ðh,dh) * (v,bh,f_) \n    {_L4_}  === ANTO  * AMPA \n\n    [{L4}] --> [{_L4_}]\n\n    \\** ======== **\\\n    \\** 5TH LINE **\\\n    \\** ======== **\\\n    {L5}    === nn    * mm    * ng\n    {_L5_}  === NUMEN * MALTA * NOLDO \n\n    [{L5}] --> [{_L5_}]\n\n    \\** ======== **\\\n    \\** 6TH LINE **\\\n    \\** ======== **\\\n    {L6}    === n   * m     * w     * _mh \n    {_L6_}  === ORE * VALA  * VILYA * MALTA_W_HOOK  \n\n    [{L6}] --> [{_L6_}]\n\n    \\** ======== **\\\n    \\** R/L LINE **\\\n    \\** ======== **\\\n    {L_LINE}        === r     * _rh   * l     * _lh\n    {_L_LINE_}      === ROMEN * ARDA  * LAMBE  * ALDA \n\n    [{L_LINE}] --> [{_L_LINE_}]\n\n    \\** ======== **\\\n    \\** S/Z LINE **\\\n    \\** ======== **\\\n    {S_LINE}    === s\n    {_S_LINE_}  === SILME \n\n    [{S_LINE}] --> [{_S_LINE_}]\n\n    ns --> SILME_NUQUERNA {NASAL}\n\n    \\** ======== **\\\n    \\** OTHERS **\\\n    \\** ======== **\\\n\n    j --> ARA\n\n    h --> HYARMEN\n\n    hw   --> HWESTA_SINDARINWA\n\n    \\** labialized consonants **\\\n    dw   --> ANDO   SEV_TEHTA\n    gw   --> ANGA   SEV_TEHTA\n    lw   --> LAMBE  SEV_TEHTA\n    nw   --> ORE    SEV_TEHTA\n    rw   --> ROMEN  SEV_TEHTA \n\n  \\end\n  \n  \\beg    rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    ... --> PUNCT_TILD\n    …   --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> {NULL}\n\n    - --> {NULL}\n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg    rules  numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end\n"
Glaemscribe.resource_manager.raw_modes["sindarin-daeron"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Sindarin Angerthas Daeron mode for glaemscribe **\\\n\n\\beg changelog\n  \\entry 0.0.2 \"Added thorn as equivalent for th\"\n  \\entry 0.0.3 \"Moved out space to general element\"\n  \\entry 0.0.4 \"Fixed wrong ch, hw, h\"\n\\end\n\n\\language \"Sindarin\"\n\\writing  \"Cirth\"\n\\mode     \"Sindarin Cirth - Angerthas Daeron\"\n\\version  \"0.0.4\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\charset  cirth_ds true\n\n\\** We redefine the output space to have something beautiful, especially with erebor1 and erebor2 **\\ \n\\outspace CIRTH_SPACE_BIG\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\\end\n\n\\beg      processor\n  \n  \\beg    rules litteral\n  \n    \\** Vowels **\\\n  \n    a     --> CIRTH_48\n    á     --> CIRTH_49\n  \n    e     --> CIRTH_46\n    é     --> CIRTH_47\n    \n    i     --> CIRTH_39\n    í     --> CIRTH_39 CIRTH_39\n    \n    o     --> CIRTH_50\n    ó     --> CIRTH_51 \\** Can use CIRTH_51_ALT **\\\n    \n    ö     --> CIRTH_52 \\** Can use CIRTH_52_ALT **\\\n    œ     --> CIRTH_52\n \n    u     --> CIRTH_42\n    ú     --> CIRTH_43\n    \n    ü     --> CIRTH_45_ALT \\** Can use CIRTH_45 **\\\n    y     --> CIRTH_45_ALT \\** Can use CIRTH_45 **\\\n  \n    \\** Consonants **\\\n\n    p     --> CIRTH_1\n    b     --> CIRTH_2\n    t     --> CIRTH_8 \n    d     --> CIRTH_9\n  \n    f     --> CIRTH_3\n    v     --> CIRTH_4\n    ff_   --> CIRTH_3\n \n    bh    --> CIRTH_4\n    \n    dh    --> CIRTH_11\n    đ     --> CIRTH_11\n    ð     --> CIRTH_11\n    ðh    --> CIRTH_11\n\n    g     --> CIRTH_19\n    gh    --> CIRTH_21\n    (k,c)     --> CIRTH_18\n    (kh,ch)   --> CIRTH_20\n    \n    ghw   --> CIRTH_26\n    gw    --> CIRTH_24\n    \n    h     --> CIRTH_54 \\**  13 is more eng. ch like in chin and 15 is more eng. sh like in shoe **\\\n    hw    --> CIRTH_5\n    \n    j     --> CIRTH_14\n    \n    khw   --> CIRTH_25\n    kw    --> CIRTH_23\n    l     --> CIRTH_31\n    lh    --> CIRTH_32\n    m     --> CIRTH_6\n    mb    --> CIRTH_7\n    mh    --> CIRTH_7\n    n     --> CIRTH_12\n    nc_   --> CIRTH_22 CIRTH_18 \\** equals ŋc **\\\n    nd    --> CIRTH_38\n    ng    --> CIRTH_33\n  \n    _ng   --> CIRTH_22\n    ng_   --> CIRTH_22 \n    ŋ     --> CIRTH_22\n  \n    nw    --> CIRTH_28\n    ngw   --> CIRTH_27\n    nj    --> CIRTH_17\n    r     --> CIRTH_29\n    rh    --> CIRTH_30\n    s     --> CIRTH_34 \\** Can use CIRTH_35 **\\\n    sh    --> CIRTH_15\n    ss    --> CIRTH_36\n    (þ,th) --> CIRTH_10\n    w     --> CIRTH_44\n    zh    --> CIRTH_16\n  \\end\n  \n  \\beg    rules punctuation\n\n    . --> CIRTH_PUNCT_THREE_DOTS\n    .. --> CIRTH_PUNCT_THREE_DOTS\n    ... --> CIRTH_PUNCT_THREE_DOTS\n    …   --> CIRTH_PUNCT_THREE_DOTS\n    .... --> CIRTH_PUNCT_THREE_DOTS\n    ..... --> CIRTH_PUNCT_THREE_DOTS\n    ...... --> CIRTH_PUNCT_THREE_DOTS\n    ....... --> CIRTH_PUNCT_THREE_DOTS\n\n    , --> CIRTH_PUNCT_MID_DOT\n    : --> CIRTH_PUNCT_TWO_DOTS\n    ; --> CIRTH_PUNCT_TWO_DOTS\n    ! --> CIRTH_PUNCT_THREE_DOTS\n    ? --> CIRTH_PUNCT_THREE_DOTS\n    · --> {NULL}\n\n    - --> {NULL}\n    – --> CIRTH_PUNCT_TWO_DOTS  \n    — --> CIRTH_PUNCT_TWO_DOTS\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** Quotes **\\\n\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL} \n    » --> {NULL} \n\n    [ --> CIRTH_PUNCT_THREE_DOTS_L\n    ] --> CIRTH_PUNCT_THREE_DOTS_L\n    ( --> CIRTH_PUNCT_THREE_DOTS_L\n    ) --> CIRTH_PUNCT_THREE_DOTS_L\n    { --> CIRTH_PUNCT_THREE_DOTS_L\n    } --> CIRTH_PUNCT_THREE_DOTS_L\n    < --> CIRTH_PUNCT_THREE_DOTS_L\n    > --> CIRTH_PUNCT_THREE_DOTS_L\n\n    / --> CIRTH_PUNCT_FOUR_DOTS\n\n  \\end\n\\end\n\n\n    \n"
Glaemscribe.resource_manager.raw_modes["sindarin"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Sindarin Classical mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Fixed some tehtar versions which did not look quite nice for ch, dh, v, mb. Reworked the problem of labialized consonnants (+w), adding an option for treating the u-curl + tehta combination.\"\n  \\entry \"0.0.3\" \"Extended the labialized consonnants option.\"\n  \\entry \"0.0.4\" \"Fixed nw (BUG : was using ORE from the beleriand mode), added lw\"\n  \\entry \"0.0.5\" \"Added thorn as equivalent for th\"\n  \\entry \"0.0.6\" \"Porting to virtual chars to simplify and beautify\"\n  \\entry \"0.0.7\" \"Added charset support for Annatar\"\n  \\entry \"0.0.8\" \"Added support for the FreeMonoTengwar font\" \n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"  \n  \\entry \"0.1.2\" \"Added support for non-breaking spaces\"  \n\\end\n\n\\language \"Sindarin\"\n\\writing  \"Tengwar\"\n\\mode     \"Sindarin Tengwar - General Use\"\n\\version  \"0.1.2\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      arda\n\\invention  jrrt\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\raw_mode \"raw-tengwar\"\n\n\\beg      options\n\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\beg option labialized_consonants_u_curl LABIALIZED_U_CURL_ALWAYS\n    \\value    LABIALIZED_U_CURL_NONE      1\n    \\value    LABIALIZED_U_CURL_NO_TEHTAR 2\n    \\value    LABIALIZED_U_CURL_ALWAYS    3\n  \\end\n\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\n\\end\n\n\\beg preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\** We should do better for that one (todo) **\\\n  \\substitute œ e\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\** Special case of starting \'i\' before vowels, replace i by j **\\     \n  \\rxsubstitute \"\\\\bi([aeouyáāâéēêíīîóōôúūûýȳŷ])\" \"j\\\\1\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n \n\\beg processor\n\n  \\beg rules litteral\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n      {NASAL}    === NASALIZE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n      {NASAL}    === NASALIZE_SIGN\n    \\endif\n    \n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {U_LOOP}        === U_TEHTA\n     \\else\n      {O_LOOP}        === U_TEHTA\n      {U_LOOP}        === O_TEHTA\n    \\endif\n    \n    \\** VOWELS **\\\n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n    {Y}   === y\n    {YY}  === ý\n\n    {AE}  === {A}{E}\n    {AI}  === {A}{I}\n    {AU}  === {A}{U}\n    {AW}  === {A}w\n    {EI}  === {E}{I}\n    {OE}  === {O}{E}\n    {UI}  === {U}{I}\n\n    \\** CONSONANTS **\\\n    {K}         === (c,k)\n\n    {VOWELS}    === {A}             * {E}             * {I}           * {O}         * {U}         * {Y} \n    {LVOWELS}   === {AA}            * {EE}            * {II}          * {OO}        * {UU}        * {YY}   \n\n    {TEHTAR}    === A_TEHTA         * E_TEHTA         * I_TEHTA       * {O_LOOP}     * {U_LOOP}     * Y_TEHTA \n  \n    {_LTEHTAR_} === ARA A_TEHTA     * ARA E_TEHTA     * ARA I_TEHTA   * ARA {O_LOOP} * ARA {U_LOOP} * ARA Y_TEHTA \n\n    {DIPHTHONGS}   === {AI}            * {AU}            * {AW}            * {EI}            * {UI}         * {AE}          * {OE}              \n    {_DIPHTHONGS_} === ANNA A_TEHTA    * VALA A_TEHTA    * VALA A_TEHTA    * ANNA E_TEHTA    * ANNA {U_LOOP} * YANTA A_TEHTA * YANTA {O_LOOP}     \n\n    \\** Consonants + Vowels, we will often need these ones **\\\n    {V_D}         === [ {VOWELS} ]\n    {V_D_WN}      === [ {VOWELS} * {NULL} ]\n\n    {_V_D_}       === [ {TEHTAR} ]\n    {_V_D_WN_}    === [ {TEHTAR} * {NULL} ]\n \n    \\** Vowel rules **\\  \n    [{VOWELS}]      -->   TELCO [{TEHTAR}]  \\** Replace isolated short vowels **\\\n    [{LVOWELS}]     -->   [{_LTEHTAR_}]   \\** Replace long vowels **\\\n    [{DIPHTHONGS}]  -->   [{_DIPHTHONGS_}]    \\** Replace diphthongs **\\\n   \n    \\** 1ST LINE **\\\n    {L1}           === t     * p * {K}\n    {_L1_}         === TINCO * PARMA * QUESSE\n \n    {V_D_WN}[{L1}] --> 2,1 --> [{_L1_}]{_V_D_WN_}\n  \n    {V_D_WN}nt   --> TINCO {NASAL} {_V_D_WN_}\n    {V_D_WN}mp   --> PARMA {NASAL} {_V_D_WN_}\n    {V_D_WN}n{K} --> CALMA {NASAL} {_V_D_WN_}\n\n    \\** 2ND LINE **\\\n    {L2}        === d     * b     * g     * ng                    \\** * g **\\\n    {_L2_}      === ANDO  * UMBAR * UNGWE * UNGWE {NASAL}      \\** * s **\\\n\n    {V_D_WN}[{L2}] --> 2,1 --> [{_L2_}]{_V_D_WN_}\n\n    {V_D_WN}mb   --> UMBAR  {NASAL} {_V_D_WN_}\n    {V_D_WN}nd   --> ANDO   {NASAL} {_V_D_WN_}\n\n    \\** 3RD LINE **\\\n    {L3}    === (þ,th) * (f,ph,ff) * ch \n    {_L3_}  === SULE   * FORMEN * HWESTA\n\n    {V_D_WN}[{L3}] --> 2,1 --> [{_L3_}]{_V_D_WN_} \n   \n    {V_D_WN}nth   --> SULE   {NASAL} {_V_D_WN_}\n    {V_D_WN}mph   --> FORMEN {NASAL} {_V_D_WN_}\n    {V_D_WN}nf    --> FORMEN {NASAL} {_V_D_WN_}\n    {V_D_WN}nch   --> HWESTA {NASAL} {_V_D_WN_}\n\n    \\** 4TH LINE **\\\n    {L4}        === (đ,ð,ðh,dh)   * (v,bh,f_) \\** Some noldorin variants here ... **\\\n    {_L4_}        === ANTO          * AMPA \n\n    {V_D_WN}[{L4}] --> 2,1 --> [{_L4_}]{_V_D_WN_}\n\n    \\** 5TH LINE **\\\n    {L5}        === n * m * _ng * _mh\n    {_L5_}      === NUMEN * MALTA * NWALME * MALTA_W_HOOK \n\n    {V_D_WN}[{L5}] --> 2,1 --> [{_L5_}]{_V_D_WN_}\n\n    {V_D_WN}nn        --> NUMEN {NASAL} {_V_D_WN_}\n    {V_D_WN}mm        --> MALTA {NASAL} {_V_D_WN_}\n\n    \\** 6TH LINE **\\\n\n    \\** 7TH LINE **\\\n    {L7}        === r_    * r     * l     * ll                    * w     \n    {_L7_}      === ORE   * ROMEN * LAMBE * LAMBE {GEMINATE} * VALA\n        \n    {V_D_WN}[{L7}] --> 2,1 --> [{_L7_}]{_V_D_WN_}\n    \n    _rh --> ARDA\n    _lh --> ALDA\n\n    \\** S/Z LINE **\\\n    {L8}    === s * y * ss\n    {_L8_}  === SILME_NUQUERNA * SILME_NUQUERNA_ALT * ESSE_NUQUERNA \n\n    {V_D_WN}[{L8}]  --> 2,1 --> [{_L8_}]{_V_D_WN_}\n\n    {V_D_WN}ns      --> SILME_NUQUERNA {NASAL} {_V_D_WN_}\n\n    s --> SILME\n\n    \\** OTHERS **\\\n    j --> YANTA\n\n    {V_D_WN}h    --> HYARMEN {_V_D_WN_}\n    {V_D_WN}hw   --> HWESTA_SINDARINWA {_V_D_WN_}\n\n    \\** \n        Ok here come the labialized consonants which are really tricky\n        The fonts generally do not handle well the u curl + tehtar, this should be one more argument for\n        adopting open type anchors with which we can stack diacritics (see the sarati modes).\n        For here, we cheat. Either we don\'t have any tehta on the tengwa, and it\'s easy.\n        Or, we put the two signs in their small versions, side by side.\n        We give an option not to use that trick, if the option is not set, we simply do not use\n        the u-curl at all when there\'s a tehta on the tengwa.\n    **\\\n    \n    \\if \"labialized_consonants_u_curl == LABIALIZED_U_CURL_NO_TEHTAR || labialized_consonants_u_curl == LABIALIZED_U_CURL_ALWAYS\"\n      dw   --> ANDO  SEV_TEHTA  \n      gw   --> UNGWE SEV_TEHTA  \n      lw   --> LAMBE SEV_TEHTA\n      nw   --> NUMEN SEV_TEHTA   \n      rw   --> ROMEN SEV_TEHTA   \n    \\endif\n\n    \\if \"labialized_consonants_u_curl == LABIALIZED_U_CURL_ALWAYS\"    \n      {V_D}dw   --> ANDO  SEV_TEHTA {_V_D_}\n      {V_D}gw   --> UNGWE SEV_TEHTA {_V_D_}\n      {V_D}lw   --> LAMBE SEV_TEHTA {_V_D_}   \n      {V_D}nw   --> NUMEN SEV_TEHTA {_V_D_}\n      {V_D}rw   --> ROMEN SEV_TEHTA {_V_D_}\n    \\endif\n  \\end\n  \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    ... --> PUNCT_TILD\n    …   --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n    \n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> {NULL}\n\n    - --> {NULL} \n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end\n"
Glaemscribe.resource_manager.raw_modes["telerin"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Telerin mode for glaemscribe (MAY BE INCOMPLETE) - Derived from Quenya **\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Correcting ts/ps sequences to work better with eldamar\"\n  \\entry \"0.0.3\" \"Porting to virtual chars\"\n  \\entry \"0.0.4\" \"Added charset support for Annatar\"\n  \\entry \"0.0.5\" \"Added support for the FreeMonoTengwar font\" \n  \\entry \"0.0.6\" \"Ported some options from the quenya mode\"\n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"  \n  \\entry \"0.1.2\" \"Added support for non-breaking spaces\"   \n  \\entry \"0.1.3\" \"Correcting visibility options to conform to new glaeml args strict syntax\"  \n\\end\n\n\\language \"Telerin\"\n\\writing  \"Tengwar\"\n\\mode     \"Telerin Tengwar - G*\"\n\\version  \"0.1.3\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R Tolkien\"\n\n\\world      arda\n\\invention  experimental\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\raw_mode \"raw-tengwar\"\n\n\\beg      options\n\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\beg option long_vowels_format LONG_VOWELS_USE_LONG_CARRIER\n    \\value LONG_VOWELS_USE_LONG_CARRIER 1\n    \\value LONG_VOWELS_USE_DOUBLE_TEHTAR 2\n  \\end  \n\n  \\beg option double_tehta_e false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_i false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_o true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_u true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\" \n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\n  \\substitute   \"qu\" \"q\" \\** Dis-ambiguate qu **\\\n  \n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n  \n\\beg processor\n\n  \\beg rules litteral\n                       \n    {K}                 === (c,k)\n    {W}                 === (v,w)\n    {SS}                === (z,ss)\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n    \\endif\n    \n    {VOWELS}            === a               *  e              * i              * o              *  u\n    {LVOWELS}           === á               *  é              * í              * ó              *  ú\n\n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif\n\n    \\** Shape of the a, option removed from quenya, may be readded later **\\\n    {A_SHAPE}         === A_TEHTA\n\n    \\** Implicit a, option removed from quenya, may be readded later **\\\n    {_A_}              === {A_SHAPE}\n    {_NVOWEL_}         === {NULL}\n  \n    {_TEHTAR_}          === {_A_}      *  E_TEHTA     *  I_TEHTA    * {O_LOOP}    *  {U_LOOP}\n\n    \\** Split diphtongs option removed from quenya, may be readded later **\\\n    {DIPHTHONGS}      === ai            * au            * eu            * iu             * oi               * ui\n    {_DIPHTHONGS_}    === YANTA {_A_}   * URE {_A_}     * URE E_TEHTA   * URE I_TEHTA    * YANTA {O_LOOP}   * YANTA {U_LOOP}\n    {WDIPHTHONGS}     === * {DIPHTHONGS}   \\** groovy! **\\\n    {_WDIPHTHONGS_}   === * {_DIPHTHONGS_} \\** same thing **\\\n    \n		{_LONG_A_}      === ARA {A_SHAPE}\n		{_LONG_E_}      === ARA E_TEHTA	\n		{_LONG_I_}      === ARA I_TEHTA\n		{_LONG_O_}      === ARA {O_LOOP}	\n		{_LONG_U_}      === ARA {U_LOOP}\n		{_LONE_LONG_A_} === {_LONG_A_}\n		{_LONE_LONG_E_} === {_LONG_E_}\n		{_LONE_LONG_I_} === {_LONG_I_}\n		{_LONE_LONG_O_} === {_LONG_O_}\n		{_LONE_LONG_U_} === {_LONG_U_}\n    \n    {LTEHTAR}       === {NULL}\n    {_LTEHTAR_}     === {NULL} 				\n 		\n		\\if \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n	    \\if double_tehta_e\n		    {_LONG_E_}       === E_TEHTA_DOUBLE\n		    {_LONE_LONG_E_}  === TELCO {_LONG_E_}\n        {LTEHTAR}        === {LTEHTAR}   * é\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_E_}\n			\\endif\n		  \\if double_tehta_i\n		    {_LONG_I_}       === I_TEHTA_DOUBLE\n		    {_LONE_LONG_I_}  === TELCO {_LONG_I_}\n        {LTEHTAR}        === {LTEHTAR}   * í\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_I_}\n		  \\endif\n		  \\if double_tehta_o\n		    {_LONG_O_}       === {O_LOOP_DOUBLE}\n		    {_LONE_LONG_O_}  === TELCO {_LONG_O_}\n        {LTEHTAR}        === {LTEHTAR}   * ó\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_O_}\n		  \\endif\n		  \\if double_tehta_u\n		    {_LONG_U_}       === {U_LOOP_DOUBLE}\n		    {_LONE_LONG_U_}  === TELCO {_LONG_U_}\n        {LTEHTAR}        === {LTEHTAR}   * ú\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_U_}\n		  \\endif\n    \\endif  \n       		\n    \\** images of long vowels, either tehtar or ara versions **\\\n    {_LVOWELS_}     === {_LONG_A_} * {_LONG_E_} * {_LONG_I_} * {_LONG_O_} * {_LONG_U_}      \n\n		{WLONG}         === * {LVOWELS} \n		{_WLONG_}       === * {_LVOWELS_}\n\n    {V_D}           === [ {VOWELS} {WLONG} {WDIPHTHONGS} ]\n    {V_D_WN}        === [ {VOWELS} {WLONG} {WDIPHTHONGS} * {NULL} ]\n\n    {_V_D_}         === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} ]\n    {_V_D_WN_}      === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} * {_NVOWEL_} ]\n		\n		\\** LONE SHORT VOWELS **\\\n    [{VOWELS}]    --> TELCO [{_TEHTAR_}]  \\** Replace isolated short vowels **\\\n    \n		\\** LONE LONG VOWELS **\\	\n		[{LVOWELS}]   --> [{_LONE_LONG_A_} * {_LONE_LONG_E_} * {_LONE_LONG_I_} * {_LONE_LONG_O_} * {_LONE_LONG_U_}]\n\n    [{DIPHTHONGS}]    -->   [{_DIPHTHONGS_}]     \\**  Replace diphthongs **\\\n    \n  \n    \\** TELERIN: changed v/w, removed all y rules **\\\n    \n    \\** ===================== **\\\n    \\** 1ST LINE RULES **\\\n    \\** ===================== **\\\n    {L1}          === {K}   * q      * t       * p \n    {_L1_}        === CALMA * QUESSE * TINCO   * PARMA\n    \n    {L1_GEMS}     === {K}{K}              * tt                     * pp\n    {_L1_GEMS_}   === CALMA {GEMINATE} * TINCO {GEMINATE}    * PARMA {GEMINATE}\n\n    \\** NORMAL **\\\n    [ {L1} ] {V_D_WN}         --> [ {_L1_} ] {_V_D_WN_}\n    [ {L1_GEMS} ] {V_D_WN}    --> [ {_L1_GEMS_} ] {_V_D_WN_}\n                            \n    ts{V_D_WN}          --> TINCO ALVEOLAR_SIGN {_V_D_WN_} \n    ps{V_D_WN}          --> PARMA ALVEOLAR_SIGN {_V_D_WN_}\n    {K}s{V_D_WN}        --> CALMA ALVEOLAR_SIGN {_V_D_WN_}   \n    x{V_D_WN}           --> CALMA ALVEOLAR_SIGN {_V_D_WN_}   \\** render ks for x **\\\n                            \n    \\** ===================== **\\\n    \\** 2ND LINE RULES **\\\n    \\** ===================== **\\\n    {L2}        === nd      * mb        * ng      *  ngw    * d      * b        * g\n    {_L2_}      === ANDO    * UMBAR     * ANGA    *  UNGWE  * ORE    * VALA     * ANNA\n    \n    \\** STANDARD **\\\n    [{L2}]{V_D_WN}  --> [{_L2_}]{_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 3RD LINE RULES **\\\n    \\** ===================== **\\\n    {L3}    === th     * f      * h      * hw\n    {_L3_}  === SULE   * FORMEN * AHA    * HWESTA\n\n    \\** NORMAL **\\\n    [{L3}]{V_D_WN}  --> [{_L3_}]{_V_D_WN_}\n      \n    \\** Override h with vowels (descendent) **\\\n    _h{V_D}         --> HYARMEN {_V_D_}\n    \\** Starting voiced h before long vowels **\\\n    _h[{LVOWELS}]   --> HYARMEN [{_LVOWELS_}]\n\n    (h,χ)           --> AHA\n\n    \\** ===================== **\\\n    \\** 4TH LINE RULES **\\\n    \\** ===================== **\\\n    {L4}    === nt    * mp    * nc    * nq      \\** Not nqu, due to preprocessor **\\\n    {_L4_}  === ANTO  * AMPA  * ANCA  * UNQUE\n \n    \\** NORMAL **\\\n    [{L4}]{V_D_WN}    --> [{_L4_}]{_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 5TH LINE RULES **\\\n    \\** ===================== **\\\n    {L5}    === n     * m     * ñ     * ñw      * _nw \n    {_L5_}  === NUMEN * MALTA * NOLDO * NWALME  * NWALME\n\n    [{L5}]{V_D_WN}  --> [{_L5_}]{_V_D_WN_}\n\n    nn{V_D_WN}          --> NUMEN {GEMINATE} {_V_D_WN_}\n    mm{V_D_WN}          --> MALTA {GEMINATE} {_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 6TH LINE RULES **\\\n    \\** ===================== **\\\n    {L6}        === r     * {W}  \n    {_L6_}      === ROMEN * VILYA \n\n    [{L6}]{V_D_WN} --> [{_L6_}]{_V_D_WN_}\n\n    rr{V_D_WN}        --> ROMEN {GEMINATE} {_V_D_WN_}\n    rd{V_D_WN}        --> ARDA {_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** L   LINE RULES **\\\n    \\** ===================== **\\\n    {LINE_L}          === l     * ld      * ll\n    {_LINE_L_}        === LAMBE * ALDA    * LAMBE {GEMINATE}\n\n    [{LINE_L}]{V_D_WN}    --> [{_LINE_L_}]{_V_D_WN_}\n\n    hl{V_D_WN}            --> HALLA LAMBE {_V_D_WN_}\n    hr{V_D_WN}            --> HALLA ROMEN {_V_D_WN_}\n    \n    \\** ===================== **\\\n    \\** S/Z LINE RULES **\\\n    \\** ===================== **\\\n    {L8}              === s               * {SS}\n    {_L8_TEHTAR_}     === SILME_NUQUERNA  * ESSE_NUQUERNA\n    {_L8_NO_TEHTAR_}  === SILME           * ESSE\n\n    [{L8}][{VOWELS}]   --> [{_L8_TEHTAR_}][{_TEHTAR_}]\n    [{L8}][{LTEHTAR}]  --> [{_L8_TEHTAR_}][{_LTEHTAR_}]\n    \n    {L8}               --> {_L8_NO_TEHTAR_}\n    {L8}[{DIPHTHONGS}] --> {_L8_NO_TEHTAR_}[{_DIPHTHONGS_}]\n  \\end\n  \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> {NULL}\n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n \n  \\end\n  \n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end  \n"
Glaemscribe.resource_manager.raw_modes["valarin-sarati"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"Initial version\"\n  \\entry \"0.0.2\" \"Adding quotes handling\"\n  \\entry \"0.0.3\" \" Moved out space to general element\"\n\\end\n\n\\language \"Valarin\"\n\\writing  \"Sarati\"\n\\mode     \"Valarin Sarati - G*\"\n\\version  \"0.0.3\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R. Tolkien\"\n\n\\world      arda\n\\invention  experimental\n\n\\charset  sarati_eldamar true\n\n\\outspace SARATI_SPACE\n  \n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\" \n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\n  \\substitute   \"ai\" \"ay\" \\** Dis-ambiguate ai **\\\n\\end\n  \n\\beg      processor\n\n  \n  \\beg rules litteral \n      \n    {A}                           === a\n    {AA}                          === á     \n    {E}                           === e\n    {EE}                          === é     \n    {I}                           === i\n    {II}                          === í     \n    {O}                           === o\n    {OO}                          === ó     \n    {U}                           === u\n    {UU}                          === ú     \n    {Y}                           === y\n    {YY}                          === ý                                        \n\n    {AE}                          === (æ,ae)\n    {AEAE}                        === (ǽ,ǣ)\n\n    {OE}                          === ǫ\n    {OEOE}                        === ǭ\n\n    \\** ################################################# **\\\n    \\**  DIPHTHONGS are dis-ambiguated in the preprocessor # **\\\n    \\** ################################################# **\\\n\n    \\** ############# **\\\n    \\**  DIACRITICS # **\\\n    \\** ############# **\\\n\n    {VOWELS}                      === {A}                 * {E}                   * {I}                 * {O}                 * {U}                 * {AE}                            * {OE}    \n    {LVOWELS}                     === {AA}                * {EE}                  * {II}                * {OO}                * {UU}                * {AEAE}                          * {OEOE}  \n    {STEHTAS}                     === SARATI_QUENYA_A     * SARATI_QUENYA_E       * SARATI_QUENYA_I     * SARATI_QUENYA_O     * SARATI_QUENYA_U     * SARATI_QUENYA_A_REVERSED        * SARATI_DIACRITIC_CIRCLE       \n\n    {V_L_KER_WN}                  === [ {VOWELS}  * {NULL} ]\n    {V_IMG_FOR_CONSONNANTS_WN}    === [ {STEHTAS} * {NULL} ]  \\** # No vowel == nothing **\\\n\n    \\** ######## **\\\n    \\**  RULES # **\\\n    \\** ######## **\\\n\n    [{VOWELS}]      -->   [{STEHTAS}] SARATI_QUENYA_LONG_VOWEL_CARRIER    \\** # Isolated vowels : use short carrier (reversed order RTL) **\\\n    [{LVOWELS}]     -->   [{STEHTAS}] SARATI_DASH_U SARATI_QUENYA_LONG_VOWEL_CARRIER   \\** # Long vowels: carrier + dash + tehta **\\\n\n    \\** ########### **\\\n    \\**  FIRST LINE **\\\n\n    {K}   === (c,k) \\** # For tolkienian compatibility\'s sake **\\\n\n    {LINE_1ST_KER}        === t         * p         * {K}               \\** # * tt * pp * {K}{K}   **\\\n    {LINE_1ST_IMG}        === SARATI_T  * SARATI_P  * SARATI_QUENYA_C                 \\** # * ó\" * óq * ó# **\\\n\n    {V_L_KER_WN}[{LINE_1ST_KER}]  --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_1ST_IMG}]\n\n    \\** ########### **\\\n    \\**  SECOND LINE **\\\n\n    {LINE_2ND_KER}        === d                 * b                 * g         * gw \n    {LINE_2ND_IMG}        === SARATI_QUENYA_ND  * SARATI_QUENYA_MB  * SARATI_NG * SARATI_PHONETIC_GW\n\n    {V_L_KER_WN}[{LINE_2ND_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_2ND_IMG}]\n\n    \\** ########### **\\\n    \\**  THIRD LINE **\\\n\n    {LINE_3RD_KER}        ===   þ                 * s               * š                                                   * (χ,x)                             * h         * šš \\** # * s_ **\\\n    {LINE_3RD_IMG}        ===   SARATI_QUENYA_NT  * SARATI_QUENYA_S * SARATI_VOICELESS_PALATO_ALVEOLAR_SIBILANT_FRICATIVE * SARATI_VOICELESS_VELAR_FRICATIVE  * SARATI_H  * SARATI_DASH_D SARATI_VOICELESS_PALATO_ALVEOLAR_SIBILANT_FRICATIVE \\** # * ü **\\\n\n    {V_L_KER_WN}[{LINE_3RD_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_3RD_IMG}]\n\n    \\** ########### **\\\n    \\**  FOURTH LINE **\\\n\n    {LINE_4TH_KER}        ===   ð                               * z                       * ȝ \\** # * z_  **\\\n    {LINE_4TH_IMG}        ===   SARATI_VOICED_DENTAL_FRICATIVE  * SARATI_QUENYA_SS_ALT_1  * SARATI_VOICED_VELAR_FRICATIVE \\** # * ú **\\\n\n    {V_L_KER_WN}[{LINE_4TH_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_4TH_IMG}]\n\n    \\** ########### **\\\n    \\**  FIFTH LINE **\\\n\n    {LINE_5TH_KER}        ===   m         * n\n    {LINE_5TH_IMG}        ===   SARATI_M  * SARATI_N\n\n    {V_L_KER_WN}[{LINE_5TH_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_5TH_IMG}]\n\n    \\** ########### **\\\n    \\**  SIXTH LINE **\\\n\n    {LINE_6TH_KER}        === l * ll  \n    {LINE_6TH_IMG}        === SARATI_L * SARATI_DASH_D SARATI_L \n\n    {V_L_KER_WN}[{LINE_6TH_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_6TH_IMG}]\n\n    \\** ########### **\\\n    \\**  SEVENTH LINE **\\\n\n    {LINE_7TH_KER}        === r * rr  \n    {LINE_7TH_IMG}        === SARATI_R * SARATI_DASH_D SARATI_R  \n\n    {V_L_KER_WN}[{LINE_7TH_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_7TH_IMG}]\n\n    \\** ########### **\\\n    \\**  EIGHTH LINE **\\\n\n    {LINE_8TH_KER}        === y * w   \n    {LINE_8TH_IMG}        === SARATI_QUENYA_Y * SARATI_W  \n\n    {V_L_KER_WN}[{LINE_8TH_KER}] --> {V_IMG_FOR_CONSONNANTS_WN}[{LINE_8TH_IMG}]\n  \\end\n    \n  \\beg rules punctuation\n    · --> {NULL}\n    , --> {NULL}\n    ; --> {NULL}\n    : --> {NULL}\n    . --> SARATI_SPACE\n    - --> SARATI_SPACE\n    – --> SARATI_SPACE\n    ! --> {NULL}\n    ? --> {NULL}\n    \' --> {NULL}\n    [ --> {NULL}\n    ] --> {NULL}\n    ‘ --> {NULL}\n    ’ --> {NULL}\n    “ --> {NULL}\n    ” --> {NULL}\n    « --> {NULL}\n    » --> {NULL}\n  \\end \n\\end \n\n\\beg postprocessor\n  \\reverse\n\\end\n\n\n\\** # Voyelles : a æ e i o ǫ u / ǭ Ǭ **\\\n\\** # Diphtongues : ai **\\\n\\** # **\\\n\\** # Occlusives aspirées   ph th .  .  .  kh .  **\\\n\\** # Occlusives sourdes    p  t  .  .  .  k  .  **\\\n\\** # Occlusives sonores    b  d  .  .  .  g  .  **\\\n\\** # Fricatives sourdes    .  þ  s  š  .  χ  h  **\\\n\\** # Fricatives sonores    .  ð  z  .  .  ȝ  .  **\\\n\\** # Nasales               m  n  .  .  .  .  .  **\\\n\\** # Latérales             .  l  .  .  .  .  .  **\\\n\\** # Vibrantes             .  r  .  .  .  .  .  **\\\n\\** # Semi-voyelles         w  .  .  .  y  .  .  **\\\n\n\n      \n\n"
Glaemscribe.resource_manager.raw_modes["westron"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Correcting ts/ps sequences to work better with eldamar\"\n  \\entry \"0.0.3\" \"Porting to virtual chars\"\n  \\entry \"0.0.4\" \"Added charset support for Annatar\"\n  \\entry \"0.0.5\" \"Added support for the FreeMonoTengwar font\" \n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"  \n  \\entry \"0.1.2\" \"Added support for non-breaking spaces\"   \n\\end\n\n\\**  Westron mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\\language Westron\n\\writing  Tengwar\n\\mode     \"Westron Tengwar - G*\"\n\\version  \"0.1.2\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R. Tolkien\"\n\n\\world      arda\n\\invention  experimental\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\\charset  tengwar_freemono    false\n\n\\beg      options\n\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n  \n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute \"ä\" \"a\"\n  \\substitute \"ë\" \"e\"\n  \\substitute \"ï\" \"i\"\n  \\substitute \"ö\" \"o\"\n  \\substitute \"ü\" \"u\"\n  \\substitute \"ÿ\" \"y\"\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n\n\\beg      processor\n\n  \\beg    rules litteral  \n  \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n      {NASAL}    === NASALIZE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n      {NASAL}    === NASALIZE_SIGN\n    \\endif\n    \n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif\n  \n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n\n    \\** Short diphthongs **\\\n    {AI}  === {A}{I}\n    {AU}  === {A}{U}\n	  {EI}  === {E}{I}\n	  {EU}  === {E}{U}\n	  {OI}  === {O}{I}\n	  {OU}  === {O}{U}\n	  {UI}  === {U}{I}\n	  {IU}  === {I}{U}\n\n    \\** LONG diphthongs **\\      \n    {AAI} === {AA}{I} \\** âi **\\\n    {AAU} === {AA}{U} \\** âu **\\\n    {EEI} === {EE}{I} \\** êi **\\\n    {EEU} === {EE}{U} \\** êu **\\\n    {OOI} === {OO}{I} \\** ôi **\\\n    {OOU} === {OO}{U} \\** ôu **\\\n\n    {SDIPHTHONGS}  === {AI}           * {AU}          * {EI} 				    * {EU}        * {IU}        * {OI}          * {OU}        * {UI}\n    {_SDIPHTONGS_} === YANTA A_TEHTA  * URE A_TEHTA   * YANTA E_TEHTA	  * URE E_TEHTA * URE I_TEHTA * YANTA {O_LOOP} * URE {O_LOOP} * YANTA {U_LOOP}                   \n    \n    {LDIPHTHONGS}  === {AAI}              * {AAU}              * {EEI}              * {EEU}            * {OOI}              * {OOU}\n    {_LDIPHTONGS_} === ARA A_TEHTA YANTA  * ARA A_TEHTA URE    * ARA E_TEHTA YANTA  * ARA E_TEHTA URE  * ARA {O_LOOP} YANTA  * ARA {O_LOOP} URE\n                   \n    {VOWELS}      === {A}      * {E}      * {I}        * {O}        * {U}    \n    {TEHTAR}      === A_TEHTA  * E_TEHTA  * I_TEHTA    * {O_LOOP}    * {U_LOOP}\n                  \n    {LVOWELS}     === {AA}         * {EE}         * {II}         * {OO}         * {UU}\n    {LTETHAR}     === ARA A_TEHTA  * ARA E_TEHTA  * ARA I_TEHTA  * ARA {O_LOOP}  * ARA {U_LOOP} \n\n    \\** Let\' put all vowels/diphthongs in the same basket **\\\n    {V_D}         === [ {VOWELS}  * {LVOWELS} * {SDIPHTHONGS} * {LDIPHTHONGS} ]        \n    \\** And their images... **\\            \n    {_V_D_}       === [ {TEHTAR}  * {LTETHAR} * {_SDIPHTONGS_} * {_LDIPHTONGS_} ]\n \n    [{VOWELS}]      --> TELCO [{TEHTAR}]   \\** Replace isolated short vowels **\\\n    [{LVOWELS}]     --> [{LTETHAR}]    \\** Replace long vowels **\\\n    [{SDIPHTHONGS}]  --> [{_SDIPHTONGS_}]  \\** Replace short diphthongs **\\\n    [{LDIPHTHONGS}]  --> [{_LDIPHTONGS_}]  \\** Replace long diphthongs **\\\n\n    \\** ================ **\\\n    \\**    CONSONANTS    **\\\n    \\** ================ **\\     \n\n    {L1_S}         === t      * p     * ch		  * (c,k)       \n    {L1_T}         === TINCO  * PARMA * CALMA	  * QUESSE \n    \n    [{L1_S}]       -->  [ {L1_T} ]\n    [{L1_S}]{V_D}  -->  [ {L1_T} ]{_V_D_} \n	\n    {L1_G_S}         === tt			           * pp               * cch				        * (c,k)(c,k)             \n    {L1_G_T}         === TINCO {GEMINATE}  * PARMA {GEMINATE} * CALMA {GEMINATE}	* QUESSE {GEMINATE}  \n    \n    [{L1_G_S}]       -->  [ {L1_G_T} ]\n    [{L1_G_S}]{V_D}  -->  [ {L1_G_T} ]{_V_D_} \n	  \n    {L1_N_S}         === nt			        * mp              * nch				    * (n,ñ)(c,k)             \n    {L1_N_T}         === TINCO {NASAL}  * PARMA {NASAL}   * CALMA {NASAL} * QUESSE {NASAL}  \n    \n    [{L1_N_S}]       -->  [ {L1_N_T} ]\n    [{L1_N_S}]{V_D}  -->  [ {L1_N_T} ]{_V_D_} 	 \n\n    {L2_S}         === d    * b     * j	  	* g\n    {L2_T}         === ANDO * UMBAR * ANGA	* UNGWE\n		\n    [{L2_S}]       --> [{L2_T}] \n    [{L2_S}]{V_D}  --> [{L2_T}]{_V_D_} \n\n    {L2_G_S}         === dd              * bb               * jj			         * gg\n    {L2_G_T}         === ANDO {GEMINATE} * UMBAR {GEMINATE} * ANGA {GEMINATE}  * UNGWE {GEMINATE}\n		\n    [{L2_G_S}]       --> [{L2_G_T}] \n    [{L2_G_S}]{V_D}  --> [{L2_G_T}]{_V_D_} \n\n    {L2_N_S}         === nd           * mb            * nj			      * (n,ñ)g\n    {L2_N_T}         === ANDO {NASAL} * UMBAR {NASAL} * ANGA {NASAL}  * UNGWE {NASAL}\n		\n    [{L2_N_S}]       --> [{L2_N_T}] \n    [{L2_N_S}]{V_D}  --> [{L2_N_T}]{_V_D_} \n\n    \\** Alignment of tehta is not the same in the font **\\\n    \\** So we need to split the third line unfortunately **\\\n    {L3_1_S}          === (th,þ)    * (f,ph)      \n    {L3_1_T}          === SULE      * FORMEN  \n   \n    {L3_2_S}          === sh     * kh     \n    {L3_2_T}          === AHA    * HWESTA\n   \n    [{L3_1_S}]        --> [{L3_1_T}] \n    [{L3_1_S}]{V_D}   --> [{L3_1_T}]{_V_D_} \n    [{L3_2_S}]        --> [{L3_2_T}] \n    [{L3_2_S}]{V_D}   --> [{L3_2_T}]{_V_D_} \n		\n    {L3_1G_S}         === (thth,tth,þþ)    * (ff,phph,pph)\n    {L3_1G_T}         === SULE {GEMINATE}  * FORMEN {GEMINATE}\n   \n    {L3_2G_S}          === (shsh,ssh)      * (k,kh)kh\n    {L3_2G_T}          === AHA {GEMINATE}  * HWESTA {GEMINATE}\n   \n    [{L3_1G_S}]        --> [{L3_1G_T}] \n    [{L3_1G_S}]{V_D}   --> [{L3_1G_T}]{_V_D_} \n    [{L3_2G_S}]        --> [{L3_2G_T}] \n    [{L3_2G_S}]{V_D}   --> [{L3_2G_T}]{_V_D_} 		\n\n    {L3_1N_S}          === (nth,nþ)     * (nf,mf,mph)      \n    {L3_1N_T}          === SULE {NASAL} * FORMEN {NASAL}  \n   \n    {L3_2N_S}          === nsh         * (n,ñ)kh     \n    {L3_2N_T}          === AHA {NASAL} * HWESTA {NASAL}\n   \n    [{L3_1N_S}]        --> [{L3_1N_T}] \n    [{L3_1N_S}]{V_D}   --> [{L3_1N_T}]{_V_D_} \n    [{L3_2N_S}]        --> [{L3_2N_T}] \n    [{L3_2N_S}]{V_D}   --> [{L3_2N_T}]{_V_D_} \n\n    {L4_S}            === (dh,ð)    * v   	* zh	  * gh\n    {L4_T}            === ANTO      * AMPA  * ANCA	* UNQUE\n		\n    [{L4_S}]          --> [{L4_T}] \n    [{L4_S}]{V_D}     --> [{L4_T}]{_V_D_} \n\n    {L4_G_S}            === (dh,ð)(dh,ð)     * vv               * (zhzh,zzh)	     * (ghgh,ggh)\n    {L4_G_T}            === ANTO {GEMINATE}  * AMPA {GEMINATE}  * ANCA {GEMINATE}  * UNQUE {GEMINATE}\n		\n    [{L4_G_S}]          --> [{L4_G_T}] \n    [{L4_G_S}]{V_D}     --> [{L4_G_T}]{_V_D_} \n\n    {L4_N_S}            === n(dh,ð)       * (mv,nv)       * nzh	          * (n,ñ)gh\n    {L4_N_T}            === ANTO {NASAL}  * AMPA {NASAL}  * ANCA {NASAL}  * UNQUE {NASAL}\n		\n    [{L4_N_S}]          --> [{L4_N_T}] \n    [{L4_N_S}]{V_D}     --> [{L4_N_T}]{_V_D_} \n\n    {L5_S}            === n     * m     * ny     * ñ\n    {L5_T}            === NUMEN * MALTA * NOLDO  * NWALME\n		\n    [{L5_S}]          --> [{L5_T}] \n    [{L5_S}]{V_D}     --> [{L5_T}]{_V_D_} \n\n    {L5_G_S}            === nn      * mn      * (nyny,nny)   * ññ\n    {L5_G_T}            === NUMEN   * MALTA   * NOLDO        * NWALME\n		\n    [{L5_G_S}]          --> [{L5_G_T}] \n    [{L5_G_S}]{V_D}     --> [{L5_G_T}]{_V_D_} \n		\n    {L6_S}            === w  	  * y     * rr               * ww         	    * yy\n    {L6_T}            === VALA  * ANNA  * ROMEN {GEMINATE} * VALA {GEMINATE}  * ANNA {GEMINATE}\n    [r * {L6_S}]      --> [ ORE   * {L6_T}] \n    [r * {L6_S}]{V_D} --> [ ROMEN * {L6_T}]{_V_D_} \n\n    \\** This one is not useful (redundant with higher) **\\\n    \\** Keep it for clarity of mind **\\\n    r_                --> ORE\n\n    s{V_D}            --> SILME_NUQUERNA {_V_D_}  \\** Before a vowel goes down **\\\n    s                 --> SILME                   \\** Any other pos, up **\\\n    z{V_D}            --> ESSE_NUQUERNA {_V_D_}   \\** Before a vowel goes down **\\\n    z                 --> ESSE                    \\** Any other pos, up **\\\n		\n    ns{V_D}           --> SILME_NUQUERNA {NASAL} {_V_D_}\n    ns                --> SILME_NUQUERNA {NASAL}                   \n    nz{V_D}           --> ESSE_NUQUERNA {NASAL} {_V_D_}   \n    nz                --> ESSE_NUQUERNA {NASAL}                \n\n    ts                --> TINCO ALVEOLAR_SIGN\n    ps                --> PARMA ALVEOLAR_SIGN\n    (ks,cs,x)         --> QUESSE ALVEOLAR_SIGN\n\n    ts{V_D}           --> TINCO ALVEOLAR_SIGN {_V_D_}  \n    ps{V_D}           --> PARMA ALVEOLAR_SIGN {_V_D_}\n    (ks,cs,x){V_D}    --> QUESSE ALVEOLAR_SIGN {_V_D_}	\n\n    h{V_D}            --> HYARMEN {_V_D_}\n    h                 --> HYARMEN\n    hh{V_D}           --> HYARMEN {GEMINATE} {_V_D_}\n    hh                --> HYARMEN {GEMINATE}\n                      \n    l{V_D}            --> LAMBE {_V_D_}\n    l                 --> LAMBE\n                      \n    ll{V_D}           --> LAMBE {GEMINATE} {_V_D_}\n    ll                --> LAMBE {GEMINATE}\n		\n    (hl,lh){V_D}      --> ALDA {_V_D_}\n    (hl,lh)           --> ALDA		\n\n    (hr,rh){V_D}      --> ARDA {_V_D_}\n    (hr,rh)           --> ARDA	\n		\n  \\end\n  \n  \\beg rules punctutation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> PUNCT_DOT    \n    – --> PUNCT_TILD  \n    — --> PUNCT_DTILD\n \n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11   \n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end"
Glaemscribe.resource_manager.raw_modes["westsaxon"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Porting to virtual chars\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"  \n  \\entry \"0.1.2\" \"Doing some cleaning\"\n  \\entry \"0.1.3\" \"Added support for non-breaking spaces\"     \n\\end\n\n\\language \"Old English\"\n\\writing  \"Tengwar\"\n\\mode     \"Old English Tengwar - \'West Saxon\' Usage\"\n\\version  \"0.1.3\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut)\"\n\n\\world      primary_related_to_arda\n\\invention  jrrt\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_annatar false\n\\charset  tengwar_ds_eldamar true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\n\\** List of features that would prevent use of other charsets \n\\charset  tengwar_freemono    false\n Free Mono Tengwar : missing [OLD_ENGLISH_AND,SHOOK_BEAUTIFUL] / sa-rince management not accurate\n**\\\n\n\\beg options\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_WAVE\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\substitute \"ae\"  \"æ\"\n  \\substitute \"ea\"  \"æa\"\n  \\substitute \"éa\"  \"ǽa\"\n  \\substitute \"7\"   \"⁊\"\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\up_down_tehta_split \"æ,ǽ,a,ä,á,e,ë,é,i,ï,í,o,ö,ó,u,ü,ú,y,ÿ,ý,ø,ǿ,œ,œ́\" \"t,p,ċ,c,d,b,ġ,g,þ,f,ç,χ,ħ,ð,v,j,ȝ,n,m,r,ĭ,w,l,ld,s,z,h,x,sċ,hw,çt,χt,ħt\"\n\\end\n\n\\beg      processor\n\n  \\beg rules litteral\n  \n    {_GEMINATE_} === E_TEHTA_DOUBLE_INF\n  \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {_NASAL_}    === NASALIZE_SIGN_TILD\n    \\else\n      {_NASAL_}    === NASALIZE_SIGN\n    \\endif\n  \n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n    {Y}   === y\n    {YY}  === ý\n\n    {AE}    === (æ,ae)\n    {AEAE}  === (ǽ,ǣ)\n\n    {OE}    === (ø,œ)\n    {OEOE}  === (ǿ,œ́)\n\n    \\** Diphtongs are always splitted, so consider we don\'t have any. **\\\n    \\** @ is the phantom vowel **\\\n\n    {S_VOWELS_NP_KERNEL}   === {A} * {AE} * {OE} * {E} * {I}   * {O} * {U} * {Y} * {A}_\n    {S_VOWELS_WP_KERNEL}   === {S_VOWELS_NP_KERNEL} * @ \n    \n    \\** UP TEHTAS **\\    \n    {TEHTAR_UP_NP}  === E_TEHTA    * A_TEHTA    * E_TEHTA_DOUBLE   * Y_TEHTA      * I_TEHTA    * O_TEHTA    * U_TEHTA    * SEV_TEHTA   * VILYA    \n    {TEHTAR_UP}     === {TEHTAR_UP_NP}  * {NULL}\n  \n    \\** FOR LONG VOWELS **\\\n    {L_VOWELS}      === {AA}              * {AEAE}          * {OEOE}                * {EE}            * {II}            * {OO}              * {UU}            * {YY}  \n    {L_TEHTAR}      === ARA E_TEHTA       * ARA A_TEHTA     * ARA E_TEHTA_DOUBLE    * ARA Y_TEHTA     * ARA I_TEHTA     * ARA O_TEHTA       * ARA U_TEHTA     * ARA SEV_TEHTA       \n\n    \\** DOWN TEHTAS **\\\n    {TEHTAR_DN}     === E_TEHTA_INF       * A_TEHTA_INF     * CIRC_TEHTA_INF        * Y_TEHTA_INF     * I_TEHTA_INF     * TELCO O_TEHTA     * TELCO U_TEHTA   * THINNAS   * VILYA * {NULL}\n    \n    {S_VOWELS_NP}       === [ {S_VOWELS_NP_KERNEL} ]\n    {S_VOWELS_NP_WN}    === [ {S_VOWELS_NP_KERNEL} * {NULL} ]\n    {S_VOWELS}          === [ {S_VOWELS_WP_KERNEL} ]\n    {S_VOWELS_WN}       === [ {S_VOWELS_WP_KERNEL} * {NULL} ]\n\n    \\**  Img bundles for all vowels **\\\n    {_S_VOWELS_UP_}     === [ {TEHTAR_UP} ]\n    {_S_VOWELS_DN_}     === [ {TEHTAR_DN} ]\n \n    {_S_VOWELS_UP_WN_}  === [ {TEHTAR_UP} * {NULL} ]\n    {_S_VOWELS_DN_WN_}  === [ {TEHTAR_DN} * {NULL} ]\n\n    \\**  Rule for long vowels **\\\n    [ {L_VOWELS} ]  --> [ {L_TEHTAR} ] \n    {UU}            --> VALA U_TEHTA   \\** # Special treatment **\\\n\n    \\**  Fallback rule for short vowels **\\\n    @                          --> {NULL}                            \\** # If found alone, put nothing **\\\n    [ {S_VOWELS_NP_KERNEL} ]   --> TELCO [ {TEHTAR_UP_NP} ]  \n    {A}_                       --> VILYA                                 \\** # We don\'t want a short carrier for a_ **\\\n    (w,u)_                     --> VALA                                 \\** # Only resolved after vowels **\\\n\n    \\** ############# **\\\n    \\**  CONSONANTS # **\\\n    \\** ############# **\\\n\n    \\** ## 1st Line (Voiceless occlusives) **\\\n    \\** ## Short upper dash for nasalisation **\\\n    {L1_KER_1}      === t     * p \n    {L1_IMG_1}      === TINCO * PARMA \n    {L1_KER_2}      === ċ     * c       * k\n    {L1_IMG_2}      === CALMA * QUESSE  * QUESSE\n        \n    {L1_KER_1_GEMS} === tt                  * pp   \n    {L1_IMG_1_GEMS} === TINCO {_GEMINATE_}  * PARMA {_GEMINATE_}\n    {L1_KER_2_GEMS} === ċċ                  * cc                  * kk \n    {L1_IMG_2_GEMS} === CALMA {_GEMINATE_}  * QUESSE {_GEMINATE_} * QUESSE {_GEMINATE_}\n\n  \n    {S_VOWELS_WN}[{L1_KER_1}]{S_VOWELS_WN}  --> 2,1,3 --> [{L1_IMG_1}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L1_KER_1_GEMS}]          --> 2,1   --> [{L1_IMG_1_GEMS}]{_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}[{L1_KER_2}]{S_VOWELS_WN}  --> 2,1,3 --> [{L1_IMG_2}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L1_KER_2_GEMS}]          --> 2,1   --> [{L1_IMG_2_GEMS}]{_S_VOWELS_UP_WN_}\n\n    {S_VOWELS_WN}[ nt * mp ]{S_VOWELS_WN}   --> 2,1,3 -->  [ {L1_IMG_1} ]  {_NASAL_} {_S_VOWELS_UP_WN_} {_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[ nċ * nc ]{S_VOWELS_WN}   --> 2,1,3 -->  [ CALMA  * QUESSE ] {_NASAL_} {_S_VOWELS_UP_WN_} {_S_VOWELS_DN_WN_}\n\n\n    \\** ## 2nd Line (Voiced occlusives) **\\\n    \\** ## Long upper dash for nasalisation **\\\n    {L2_KER}        === d     * b     * ġ     * g\n    {L2_IMG}        === ANDO  * UMBAR * ANGA  * UNGWE\n                    \n    {L2_KER_GEMS}   === dd                 * bb                 * (ċġ,ġġ)            * (cg,gg)\n    {L2_IMG_GEMS}   === ANDO {_GEMINATE_}  * UMBAR {_GEMINATE_} * ANGA {_GEMINATE_}  * UNGWE {_GEMINATE_}\n    \n\n    {S_VOWELS_WN}[{L2_KER}]{S_VOWELS_WN}            --> 2,1,3 --> [{L2_IMG}] {_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L2_KER_GEMS}]                    --> 2,1   --> [{L2_IMG_GEMS}] {_S_VOWELS_UP_WN_}\n\n    {S_VOWELS_WN}[ nd * mb * nġ * ng ]{S_VOWELS_WN} --> 2,1,3 -->  [ {L2_IMG} ] {_NASAL_} {_S_VOWELS_UP_WN_} {_S_VOWELS_DN_WN_}\n\n\n    \\** ## 3rd Line (Voiceless fricatives) **\\\n    \\** ## Short upper dash for nasalisation **\\\n    {L3_KER_1}      === þ     * f\n    {L3_IMG_1}      === SULE  * FORMEN    \n    {L3_KER_2}      === ç     * (χ,ħ)\n    {L3_IMG_2}      === AHA   * HWESTA\n    \n    {L3_KER_1_GEMS} === þþ                * ff\n    {L3_IMG_1_GEMS} === SULE {_GEMINATE_} * FORMEN {_GEMINATE_}   \n    {L3_KER_2_GEMS} === çç                * (χχ,ħħ)\n    {L3_IMG_2_GEMS} === AHA {_GEMINATE_}  * HWESTA {_GEMINATE_}\n\n    {S_VOWELS_WN}[{L3_KER_1}]{S_VOWELS_WN}  --> 2,1,3 --> [{L3_IMG_1}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L3_KER_1_GEMS}]          --> 2,1   --> [{L3_IMG_1_GEMS}]{_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}[{L3_KER_2}]{S_VOWELS_WN}  --> 2,1,3 --> [{L3_IMG_2}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L3_KER_2_GEMS}]          --> 2,1   --> [{L3_IMG_2_GEMS}]{_S_VOWELS_UP_WN_}\n\n  \n    \\** ## 4th Line (Voiced fricatives) **\\\n    \\** ## Long upper dash for nasalisation **\\\n    \n    {L4_KER}        === ð     * v     * j     * ȝ\n    {L4_IMG}        === ANTO  * AMPA  * ANCA  * UNQUE\n    \n    {L4_KER_GEMS}   === ðð                 * vv                 * jj                 * ȝȝ\n    {L4_IMG_GEMS}   === ANTO {_GEMINATE_}  * AMPA {_GEMINATE_}  * ANCA {_GEMINATE_}  * UNQUE {_GEMINATE_}\n    \n\n    {S_VOWELS_WN}[{L4_KER}]{S_VOWELS_WN}  --> 2,1,3 --> [{L4_IMG}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L4_KER_GEMS}]          --> 2,1   --> [{L4_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n\n    \\** ## 5th Line (Nasals) **\\\n    \\** ## Long upper dash for nasalisation (wins on gemination) **\\\n\n    {L5_KER}        === n * m\n    {L5_IMG}        === NUMEN * MALTA\n\n    {S_VOWELS_WN}[{L5_KER}]{S_VOWELS_WN}  --> 2,1,3 --> [{L5_IMG}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[ nn * mm ]{S_VOWELS_WN} --> 2,1,3 --> [ {L5_IMG} ] {_NASAL_} {_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n\n\n    \\** ## 6th Line (Approximants == fr : Spirantes) **\\\n    \\** ## Short upper dash for nasalisation **\\\n\n    {L6_KER}        === r                 * ĭ\n    {L6_IMG}        === ORE               * ANNA\n    {L6_KER_GEMS}   === rr                * ĭĭ\n    {L6_IMG_GEMS}   === ORE {_GEMINATE_}  * ANNA {_GEMINATE_}\n\n    {S_VOWELS_WN}[{L6_KER}]{S_VOWELS_WN}  --> 2,1,3 --> [{L6_IMG}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L6_KER_GEMS}]          --> 2,1   --> [{L6_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n\n    \\** ## Liquids **\\\n    \\** ## **\\\n\n    {S_VOWELS_WN}w{S_VOWELS_WN}             --> ROMEN {_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}ww                         --> ROMEN {_GEMINATE_} {_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}[l * ll]         --> 2,1   --> [LAMBE * LAMBE {_GEMINATE_}]{_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}ld                         --> ALDA {_S_VOWELS_UP_WN_}\n\n\n    \\** ## Alveolar (sifflantes) **\\\n    \\** ## **\\\n    {L8_KER}      ===  s * z \n    {L8_IMG}      ===  SILME_NUQUERNA * ESSE_NUQUERNA \n    {L8_KER_GEMS} ===  ss * zz \n    {L8_IMG_GEMS} ===  SILME_NUQUERNA {_GEMINATE_} * ESSE_NUQUERNA {_GEMINATE_}\n    \n    {S_VOWELS_WN}[{L8_KER}]{S_VOWELS_WN}  --> 2,1,3 --> [{L8_IMG}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}[{L8_KER_GEMS}]          --> 2,1   --> [{L8_IMG_GEMS}]{_S_VOWELS_UP_WN_}\n\n\n    \\** ## FINAL S (Challenging!) **\\\n    {S_VOWELS_WN}s_                               --> SHOOK_BEAUTIFUL {_S_VOWELS_UP_WN_} \\** # Final rule for s **\\\n    _{S_VOWELS_WN}s_                              --> SILME_NUQUERNA {_S_VOWELS_UP_WN_} \\** # Rule _es_ **\\\n    [{L_VOWELS} * _ ]{S_VOWELS_WN}s_              --> [{L_TEHTAR} * {NULL} ] SILME_NUQUERNA {_S_VOWELS_UP_WN_} \\** # Rule for éis_, és_ **\\\n    {NULL}[ {S_VOWELS_NP_KERNEL} ]{S_VOWELS}s_    --> TELCO [ {TEHTAR_UP_NP} ] SILME_NUQUERNA {_S_VOWELS_UP_} \\** # Rule for ies_   **\\\n\n    s --> SILME \\** # Overload lonely s **\\\n    z --> ESSE  \\** # Overload lonely z **\\\n\n    \\** ## Ligatures **\\\n    \\** ## **\\\n    {LINE_VARIOUS_KER}      ===  sċ * hw * çt * (χt,ħt)\n    {LINE_VARIOUS_IMG}      ===  ANCA_CLOSED * TW_HW_LOWDHAM  * AHA_TINCO  * HWESTA_TINCO \n \n    {S_VOWELS_WN}[{LINE_VARIOUS_KER}]{S_VOWELS_WN} --> 2,1,3 --> [{LINE_VARIOUS_IMG}]{_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n  \n    \\** ## Various **\\\n    \\** ## **\\\n    {S_VOWELS_WN}h{S_VOWELS_WN}   --> HYARMEN {_S_VOWELS_UP_WN_}{_S_VOWELS_DN_WN_}\n    {S_VOWELS_WN}hh               --> HYARMEN {_GEMINATE_} {_S_VOWELS_UP_WN_}\n\n\n    \\** ## X **\\\n    \\** ## For x, due to the cedilla, we cannot put tehtas under the tengwa. **\\\n    {S_VOWELS_WN}x  --> QUESSE SHOOK_LEFT_L {_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}xx --> QUESSE SHOOK_LEFT_L {_GEMINATE_} {_S_VOWELS_UP_WN_}\n    {S_VOWELS_WN}nx --> QUESSE SHOOK_LEFT_L {_NASAL_} {_S_VOWELS_UP_WN_}\n  \\end\n  \n  \\beg rules punctuation \n    ⁊ --> OLD_ENGLISH_AND\n  \n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    - --> {NULL}\n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n  \n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L_ALT \\** TODO : Remove alt ? **\\\n    ) --> PUNCT_PAREN_R_ALT \\** TODO : Remove alt ? **\\\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n\n  \\end\n  \n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end"
export default Glaemscribe;