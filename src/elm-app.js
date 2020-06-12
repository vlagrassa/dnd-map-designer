(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Tool$FreeformPen = {$: 'FreeformPen'};
var $author$project$Grid$Path = function (a) {
	return {$: 'Path', a: a};
};
var $author$project$Grid$Polygon = function (a) {
	return {$: 'Polygon', a: a};
};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $simonh1000$elm_colorpicker$ColorPicker$State = function (a) {
	return {$: 'State', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$Unpressed = {$: 'Unpressed'};
var $simonh1000$elm_colorpicker$ColorPicker$blankModel = {hue: $elm$core$Maybe$Nothing, mouseTarget: $simonh1000$elm_colorpicker$ColorPicker$Unpressed};
var $simonh1000$elm_colorpicker$ColorPicker$empty = $simonh1000$elm_colorpicker$ColorPicker$State($simonh1000$elm_colorpicker$ColorPicker$blankModel);
var $author$project$Stack$S = function (a) {
	return {$: 'S', a: a};
};
var $author$project$Stack$empty = function (n) {
	return $author$project$Stack$S(
		_Utils_Tuple2(n, _List_Nil));
};
var $author$project$Main$newMP = F2(
	function (p, c) {
		return {color: c, path: p};
	});
var $author$project$Main$newMS = F2(
	function (s, c) {
		return {color: c, shape: s};
	});
var $author$project$Main$HeightSliderChange = function (a) {
	return {$: 'HeightSliderChange', a: a};
};
var $carwow$elm_slider$SingleSlider$SingleSlider = function (a) {
	return {$: 'SingleSlider', a: a};
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $carwow$elm_slider$RangeSlider$defaultLabelFormatter = function (value) {
	return $elm$core$String$fromFloat(value);
};
var $carwow$elm_slider$RangeSlider$defaultValueFormatter = F2(
	function (value, max) {
		return _Utils_eq(value, max) ? '' : $elm$core$String$fromFloat(value);
	});
var $carwow$elm_slider$SingleSlider$init = function (attrs) {
	return $carwow$elm_slider$SingleSlider$SingleSlider(
		{
			commonAttributes: {max: attrs.max, maxFormatter: $carwow$elm_slider$RangeSlider$defaultLabelFormatter, min: attrs.min, minFormatter: $carwow$elm_slider$RangeSlider$defaultLabelFormatter, step: attrs.step},
			valueAttributes: {change: attrs.onChange, formatter: $carwow$elm_slider$RangeSlider$defaultValueFormatter, value: attrs.value}
		});
};
var $carwow$elm_slider$SingleSlider$withMaxFormatter = F2(
	function (formatter, _v0) {
		var slider = _v0.a;
		var commonAttributes = slider.commonAttributes;
		return $carwow$elm_slider$SingleSlider$SingleSlider(
			{
				commonAttributes: _Utils_update(
					commonAttributes,
					{maxFormatter: formatter}),
				valueAttributes: slider.valueAttributes
			});
	});
var $carwow$elm_slider$SingleSlider$withMinFormatter = F2(
	function (formatter, _v0) {
		var slider = _v0.a;
		var commonAttributes = slider.commonAttributes;
		return $carwow$elm_slider$SingleSlider$SingleSlider(
			{
				commonAttributes: _Utils_update(
					commonAttributes,
					{minFormatter: formatter}),
				valueAttributes: slider.valueAttributes
			});
	});
var $carwow$elm_slider$SingleSlider$withValueFormatter = F2(
	function (formatter, _v0) {
		var slider = _v0.a;
		var valueAttributes = slider.valueAttributes;
		return $carwow$elm_slider$SingleSlider$SingleSlider(
			{
				commonAttributes: slider.commonAttributes,
				valueAttributes: _Utils_update(
					valueAttributes,
					{formatter: formatter})
			});
	});
var $author$project$Main$new_h_slider = F2(
	function (min, val) {
		return A2(
			$carwow$elm_slider$SingleSlider$withValueFormatter,
			F2(
				function (x, y) {
					return '';
				}),
			A2(
				$carwow$elm_slider$SingleSlider$withMaxFormatter,
				function (value) {
					return '';
				},
				A2(
					$carwow$elm_slider$SingleSlider$withMinFormatter,
					function (value) {
						return '';
					},
					$carwow$elm_slider$SingleSlider$init(
						{max: 50, min: min, onChange: $author$project$Main$HeightSliderChange, step: 1, value: val}))));
	});
var $author$project$Main$WidthSliderChange = function (a) {
	return {$: 'WidthSliderChange', a: a};
};
var $author$project$Main$new_w_slider = F2(
	function (min, val) {
		return A2(
			$carwow$elm_slider$SingleSlider$withValueFormatter,
			F2(
				function (x, y) {
					return '';
				}),
			A2(
				$carwow$elm_slider$SingleSlider$withMaxFormatter,
				function (value) {
					return '';
				},
				A2(
					$carwow$elm_slider$SingleSlider$withMinFormatter,
					function (value) {
						return '';
					},
					$carwow$elm_slider$SingleSlider$init(
						{max: 50, min: min, onChange: $author$project$Main$WidthSliderChange, step: 1, value: val}))));
	});
var $author$project$Main$initModel = {
	colorPicker: $simonh1000$elm_colorpicker$ColorPicker$empty,
	currentColor: $avh4$elm_color$Color$black,
	currentDrawing: A2(
		$author$project$Main$newMP,
		$author$project$Grid$Path(_List_Nil),
		$avh4$elm_color$Color$black),
	currentRect: A2(
		$author$project$Main$newMS,
		$author$project$Grid$Polygon(_List_Nil),
		$avh4$elm_color$Color$black),
	editState: true,
	erasing: false,
	galleryMaps: _List_Nil,
	ground: _List_Nil,
	heightSlider: A2($author$project$Main$new_h_slider, 1, 15),
	mapHeight: 20,
	mapName: '',
	mapWidth: 25,
	mouseDown: false,
	mouseLocation: $elm$core$Maybe$Nothing,
	redoStack: $author$project$Stack$empty(5),
	tool: $author$project$Tool$FreeformPen,
	undoStack: $author$project$Stack$empty(5),
	walls: _List_Nil,
	widthSlider: A2($author$project$Main$new_w_slider, 1, 20)
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$requestGallery = _Platform_outgoingPort(
	'requestGallery',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		$author$project$Main$initModel,
		$author$project$Main$requestGallery(_Utils_Tuple0));
};
var $author$project$Main$LoadGallery = function (a) {
	return {$: 'LoadGallery', a: a};
};
var $author$project$Main$LoadMap = function (a) {
	return {$: 'LoadMap', a: a};
};
var $author$project$Main$MapNames = function (a) {
	return {$: 'MapNames', a: a};
};
var $author$project$Main$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var $author$project$Main$MouseUpDown = function (a) {
	return {$: 'MouseUpDown', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$Map = F3(
	function (name, ground, walls) {
		return {ground: ground, name: name, walls: walls};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$decode_field_default = F3(
	function (field, decoder, _default) {
		return A2(
			$elm$json$Json$Decode$map,
			$elm$core$Maybe$withDefault(_default),
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, field, decoder)));
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Main$MapPath = F2(
	function (path, color) {
		return {color: color, path: path};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $avh4$elm_color$Color$rgba = F4(
	function (r, g, b, a) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, a);
	});
var $author$project$Main$color_decoder = A5(
	$elm$json$Json$Decode$map4,
	$avh4$elm_color$Color$rgba,
	A3($author$project$Main$decode_field_default, 'red', $elm$json$Json$Decode$float, 0),
	A3($author$project$Main$decode_field_default, 'green', $elm$json$Json$Decode$float, 0),
	A3($author$project$Main$decode_field_default, 'blue', $elm$json$Json$Decode$float, 0),
	A3($author$project$Main$decode_field_default, 'alpha', $elm$json$Json$Decode$float, 1));
var $author$project$Grid$Json$pointDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return _Utils_Tuple2(x, y);
		}),
	A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$float));
var $author$project$Grid$Json$pathDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Grid$Path,
	$elm$json$Json$Decode$list($author$project$Grid$Json$pointDecoder));
var $author$project$Main$map_path_decoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$MapPath,
	A2($elm$json$Json$Decode$field, 'path', $author$project$Grid$Json$pathDecoder),
	A3($author$project$Main$decode_field_default, 'color', $author$project$Main$color_decoder, $avh4$elm_color$Color$black));
var $author$project$Main$MapShape = F2(
	function (shape, color) {
		return {color: color, shape: shape};
	});
var $author$project$Grid$Composite = F2(
	function (a, b) {
		return {$: 'Composite', a: a, b: b};
	});
var $author$project$Grid$fromPolygonTuple = function (_v0) {
	var outline = _v0.a;
	var holes = _v0.b;
	if (!holes.b) {
		return $author$project$Grid$Polygon(outline);
	} else {
		return A2($author$project$Grid$Composite, outline, holes);
	}
};
var $author$project$Grid$Json$polygonDecoder = $elm$json$Json$Decode$list($author$project$Grid$Json$pointDecoder);
var $author$project$Grid$Json$shapeDecoder = function () {
	var decode_outline = A2($elm$json$Json$Decode$field, 'outline', $author$project$Grid$Json$polygonDecoder);
	var decode_holes = A2(
		$elm$json$Json$Decode$map,
		$elm$core$Maybe$withDefault(_List_Nil),
		$elm$json$Json$Decode$maybe(
			A2(
				$elm$json$Json$Decode$field,
				'holes',
				$elm$json$Json$Decode$list($author$project$Grid$Json$polygonDecoder))));
	return A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (x, y) {
				return $author$project$Grid$fromPolygonTuple(
					_Utils_Tuple2(x, y));
			}),
		decode_outline,
		decode_holes);
}();
var $author$project$Main$map_shape_decoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$MapShape,
	A2($elm$json$Json$Decode$field, 'shape', $author$project$Grid$Json$shapeDecoder),
	A3($author$project$Main$decode_field_default, 'color', $author$project$Main$color_decoder, $avh4$elm_color$Color$black));
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm_community$maybe_extra$Maybe$Extra$cons = F2(
	function (item, list) {
		if (item.$ === 'Just') {
			var v = item.a;
			return A2($elm$core$List$cons, v, list);
		} else {
			return list;
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$values = A2($elm$core$List$foldr, $elm_community$maybe_extra$Maybe$Extra$cons, _List_Nil);
var $author$project$Main$map_decoder = function () {
	var walls_decoder = A2(
		$elm$json$Json$Decode$map,
		$elm_community$maybe_extra$Maybe$Extra$values,
		$elm$json$Json$Decode$list(
			$elm$json$Json$Decode$maybe($author$project$Main$map_path_decoder)));
	var walls_field_decoder = A3($author$project$Main$decode_field_default, 'walls', walls_decoder, _List_Nil);
	var name_field_decoder = A3($author$project$Main$decode_field_default, 'name', $elm$json$Json$Decode$string, '');
	var ground_decoder = A2(
		$elm$json$Json$Decode$map,
		$elm_community$maybe_extra$Maybe$Extra$values,
		$elm$json$Json$Decode$list(
			$elm$json$Json$Decode$maybe($author$project$Main$map_shape_decoder)));
	var ground_field_decoder = A3($author$project$Main$decode_field_default, 'ground', ground_decoder, _List_Nil);
	return A4($elm$json$Json$Decode$map3, $author$project$Main$Map, name_field_decoder, ground_field_decoder, walls_field_decoder);
}();
var $author$project$Main$gallery_decoder = $elm$json$Json$Decode$list($author$project$Main$map_decoder);
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$decode_gallery = A2(
	$elm$core$Basics$composeL,
	$elm$core$Result$withDefault(_List_Nil),
	$elm$json$Json$Decode$decodeValue($author$project$Main$gallery_decoder));
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$decode_map = A2(
	$elm$core$Basics$composeL,
	$elm$core$Result$toMaybe,
	$elm$json$Json$Decode$decodeValue($author$project$Main$map_decoder));
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$receiveGallery = _Platform_incomingPort('receiveGallery', $elm$json$Json$Decode$value);
var $author$project$Main$receiveMap = _Platform_incomingPort('receiveMap', $elm$json$Json$Decode$value);
var $author$project$Main$receiveMapNames = _Platform_incomingPort(
	'receiveMapNames',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$Main$receiveMouseMove = _Platform_incomingPort(
	'receiveMouseMove',
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$Just,
				A2(
					$elm$json$Json$Decode$andThen,
					function (y) {
						return A2(
							$elm$json$Json$Decode$andThen,
							function (x) {
								return $elm$json$Json$Decode$succeed(
									{x: x, y: y});
							},
							A2($elm$json$Json$Decode$field, 'x', $elm$json$Json$Decode$int));
					},
					A2($elm$json$Json$Decode$field, 'y', $elm$json$Json$Decode$int)))
			])));
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Main$receiveMouseUpDown = _Platform_incomingPort('receiveMouseUpDown', $elm$json$Json$Decode$bool);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$receiveMouseMove($author$project$Main$MouseMove),
				$author$project$Main$receiveMouseUpDown($author$project$Main$MouseUpDown),
				$author$project$Main$receiveMapNames($author$project$Main$MapNames),
				$author$project$Main$receiveMap(
				A2($elm$core$Basics$composeL, $author$project$Main$LoadMap, $author$project$Main$decode_map)),
				$author$project$Main$receiveGallery(
				A2($elm$core$Basics$composeL, $author$project$Main$LoadGallery, $author$project$Main$decode_gallery))
			]));
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 'Unstyled':
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 'Unstyled':
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'MediaRule':
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'SupportsRule':
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'DocumentRule':
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'PageRule':
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'FontFace':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'Keyframes':
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.declaration) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.name, record.declaration, keyframesByName),
					declarations);
			case 'Viewport':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'CounterStyle':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 'Keyframes', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{declaration: decl, name: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {charset: charset, declarations: finalDeclarations, imports: imports, namespaces: namespaces};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.feature + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.value)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType.$) {
		case 'Print':
			return 'print';
		case 'Screen':
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 'AllQuery':
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 'OnlyQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 'NotQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0.a;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator.$) {
		case 'AdjacentSibling':
			return '+';
		case 'GeneralSibling':
			return '~';
		case 'Child':
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 'ClassSelector':
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 'IdSelector':
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 'PseudoClassSelector':
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 'TypeSelectorSequence':
			var str = simpleSelectorSequence.a.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 'UniversalSelectorSequence':
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 'MediaRule':
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 'SupportsRule':
			return 'TODO';
		case 'DocumentRule':
			return 'TODO';
		case 'PageRule':
			return 'TODO';
		case 'FontFace':
			return 'TODO';
		case 'Keyframes':
			var name = decl.a.name;
			var declaration = decl.a.declaration;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 'Viewport':
			return 'TODO';
		case 'CounterStyle':
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 'CounterStyle', a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 'FontFace', a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 'PageRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 'Selector', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 'SupportsRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 'Viewport', a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 'MediaRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 'StyleBlockDeclaration':
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 'MediaRule':
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 'CustomSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 'TypeSelectorSequence', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 'UniversalSelectorSequence', a: a};
};
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 'TypeSelectorSequence':
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 'UniversalSelectorSequence':
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (declarations.a.$ === 'StyleBlockDeclaration') {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 'DocumentRule', a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 'StyleBlockDeclaration':
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 'MediaRule':
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 'MediaRule')) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 'SupportsRule':
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 'DocumentRule':
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 'PageRule':
							var _v9 = declarations.a;
							return declarations;
						case 'FontFace':
							return declarations;
						case 'Keyframes':
							return declarations;
						case 'Viewport':
							return declarations;
						case 'CounterStyle':
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {charsProcessed: charsProcessed, hash: hash, seed: seed, shift: shift};
	});
var $Skinney$murmur3$Murmur3$c1 = 3432918353;
var $Skinney$murmur3$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.hash)) ? (data.seed ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.hash)))) : data.seed;
	var h0 = acc ^ data.charsProcessed;
	var h1 = A2($Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$Skinney$murmur3$Murmur3$multiplyBy,
					$Skinney$murmur3$Murmur3$c2,
					A2(
						$Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.hash | ((255 & $elm$core$Char$toCode(c)) << data.shift);
		var _v0 = data.shift;
		if (_v0 === 24) {
			return {
				charsProcessed: data.charsProcessed + 1,
				hash: 0,
				seed: A2($Skinney$murmur3$Murmur3$mix, data.seed, res),
				shift: 0
			};
		} else {
			return {charsProcessed: data.charsProcessed + 1, hash: res, seed: data.seed, shift: data.shift + 8};
		}
	});
var $Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $Skinney$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$Skinney$murmur3$Murmur3$hashFold,
				A4($Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return _Utils_chr('0');
			case 1:
				return _Utils_chr('1');
			case 2:
				return _Utils_chr('2');
			case 3:
				return _Utils_chr('3');
			case 4:
				return _Utils_chr('4');
			case 5:
				return _Utils_chr('5');
			case 6:
				return _Utils_chr('6');
			case 7:
				return _Utils_chr('7');
			case 8:
				return _Utils_chr('8');
			case 9:
				return _Utils_chr('9');
			case 10:
				return _Utils_chr('a');
			case 11:
				return _Utils_chr('b');
			case 12:
				return _Utils_chr('c');
			case 13:
				return _Utils_chr('d');
			case 14:
				return _Utils_chr('e');
			case 15:
				return _Utils_chr('f');
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			_Utils_chr('-'),
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2($Skinney$murmur3$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 'Nothing') {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 'FontFeatureValues', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 'MediaRule':
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 'SupportsRule':
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 'DocumentRule':
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 'PageRule':
				return declaration;
			case 'FontFace':
				return declaration;
			case 'Keyframes':
				return declaration;
			case 'Viewport':
				return declaration;
			case 'CounterStyle':
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0.a;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((_v14.a.$ === 'Just') && (_v14.b.$ === 'Just')) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 'AppendProperty':
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 'ExtendSelector':
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 'NestSnippet':
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 'StyleBlockDeclaration':
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 'MediaRule':
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 'SupportsRule':
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 'DocumentRule':
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 'PageRule':
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 'FontFace':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 'Viewport':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 'CounterStyle':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 'WithPseudoElement':
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 'WithKeyframes':
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{declaration: str, name: name})
							]));
				case 'WithMedia':
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 'MediaRule':
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 'SupportsRule':
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 'DocumentRule':
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 'PageRule':
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 'FontFace':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 'Viewport':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 'CounterStyle':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var snippets = _v0.snippets;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {charset: charset, declarations: declarations, imports: imports, namespaces: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 'ClassSelector', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = function (a) {
	return {$: 'Snippet', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {charset: $elm$core$Maybe$Nothing, imports: _List_Nil, namespaces: _List_Nil, snippets: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 'Unstyled':
			var plainNode = vdom.a;
			return plainNode;
		case 'Node':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 'NodeNS':
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 'KeyedNode':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $author$project$Grid$slope_intercept = function (_v0) {
	var _v1 = _v0.a;
	var p_x = _v1.a;
	var p_y = _v1.b;
	var _v2 = _v0.b;
	var q_x = _v2.a;
	var q_y = _v2.b;
	if (_Utils_eq(p_x, q_x)) {
		return $elm$core$Maybe$Nothing;
	} else {
		var m = (q_y - p_y) / (q_x - p_x);
		var b = p_y - (m * p_x);
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(m, b));
	}
};
var $author$project$Grid$colinear = F3(
	function (p, q, r) {
		return (_Utils_eq(p, q) || (_Utils_eq(q, r) || _Utils_eq(p, r))) ? true : _Utils_eq(
			$author$project$Grid$slope_intercept(
				_Utils_Tuple2(p, q)),
			$author$project$Grid$slope_intercept(
				_Utils_Tuple2(q, r)));
	});
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Grid$distance = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, x2 - x1, 2) + A2($elm$core$Basics$pow, y2 - y1, 2));
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Grid$addPointIfBeyond = F3(
	function (d, new_pt, _v0) {
		var path = _v0.a;
		if (!path.b) {
			return $author$project$Grid$Path(
				_List_fromArray(
					[new_pt]));
		} else {
			if (path.b.b) {
				var pt1 = path.a;
				var _v2 = path.b;
				var pt2 = _v2.a;
				var pts = _v2.b;
				return A3($author$project$Grid$colinear, new_pt, pt1, pt2) ? $author$project$Grid$Path(
					A2(
						$elm$core$List$cons,
						new_pt,
						A2($elm$core$List$cons, pt2, pts))) : ((_Utils_cmp(
					A2($author$project$Grid$distance, pt1, new_pt),
					d) > -1) ? $author$project$Grid$Path(
					A2($elm$core$List$cons, new_pt, path)) : $author$project$Grid$Path(path));
			} else {
				var pt = path.a;
				var pts = path.b;
				return (_Utils_cmp(
					A2($author$project$Grid$distance, pt, new_pt),
					d) > -1) ? $author$project$Grid$Path(
					A2($elm$core$List$cons, new_pt, path)) : $author$project$Grid$Path(path);
			}
		}
	});
var $toastal$either$Either$Left = function (a) {
	return {$: 'Left', a: a};
};
var $author$project$Utils$cart_prod = F3(
	function (f, a_list, b_list) {
		return A2(
			$elm$core$List$concatMap,
			function (b) {
				return A2(
					$elm$core$List$map,
					function (a) {
						return A2(f, a, b);
					},
					a_list);
			},
			b_list);
	});
var $author$project$Cycle$Backward = {$: 'Backward'};
var $author$project$Grid$Clockwise = {$: 'Clockwise'};
var $toastal$either$Either$Right = function (a) {
	return {$: 'Right', a: a};
};
var $author$project$Grid$Widdershins = {$: 'Widdershins'};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Grid$map2 = F3(
	function (_v0, p1, p2) {
		var f = _v0.a;
		var g = _v0.b;
		var ypos = A2(g, p1.b, p2.b);
		var xpos = A2(f, p1.a, p2.a);
		return _Utils_Tuple2(xpos, ypos);
	});
var $author$project$Grid$mapBoth2 = F2(
	function (f, g) {
		return $author$project$Grid$map2(
			_Utils_Tuple2(f, g));
	});
var $author$project$Utils$listPairsWrap = function (list) {
	if (!list.b) {
		return _List_Nil;
	} else {
		var p = list.a;
		var ps = list.b;
		var recurse = function (xs) {
			if (!xs.b) {
				return _List_Nil;
			} else {
				if (!xs.b.b) {
					var x = xs.a;
					return _List_fromArray(
						[
							_Utils_Tuple2(x, p)
						]);
				} else {
					var x = xs.a;
					var _v2 = xs.b;
					var y = _v2.a;
					var more = _v2.b;
					return A2(
						$elm$core$List$cons,
						_Utils_Tuple2(x, y),
						recurse(
							A2($elm$core$List$cons, y, more)));
				}
			}
		};
		return recurse(list);
	}
};
var $author$project$Grid$pointsToLines = $author$project$Utils$listPairsWrap;
var $author$project$Grid$reduce = F2(
	function (f, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(f, x, y);
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Grid$direction = function (poly) {
	var lines = $author$project$Grid$pointsToLines(poly);
	var line_val = function (_v0) {
		var p = _v0.a;
		var q = _v0.b;
		return A2(
			$author$project$Grid$reduce,
			$elm$core$Basics$mul,
			A4($author$project$Grid$mapBoth2, $elm$core$Basics$add, $elm$core$Basics$sub, q, p));
	};
	var total_val = $elm$core$List$sum(
		A2($elm$core$List$map, line_val, lines));
	return (total_val < 0) ? $author$project$Grid$Clockwise : $author$project$Grid$Widdershins;
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Grid$check_bound = F2(
	function (_v0, _v3) {
		var _v1 = _v0.a;
		var p1_x = _v1.a;
		var p1_y = _v1.b;
		var _v2 = _v0.b;
		var p2_x = _v2.a;
		var p2_y = _v2.b;
		var x = _v3.a;
		var y = _v3.b;
		var _v4 = _Utils_Tuple2(
			A2($elm$core$Basics$min, p1_y, p2_y),
			A2($elm$core$Basics$max, p1_y, p2_y));
		var p_y_min = _v4.a;
		var p_y_max = _v4.b;
		var _v5 = _Utils_Tuple2(
			A2($elm$core$Basics$min, p1_x, p2_x),
			A2($elm$core$Basics$max, p1_x, p2_x));
		var p_x_min = _v5.a;
		var p_x_max = _v5.b;
		return ((_Utils_cmp(p_x_min, x) < 1) && ((_Utils_cmp(x, p_x_max) < 1) && ((_Utils_cmp(p_y_min, y) < 1) && (_Utils_cmp(y, p_y_max) < 1)))) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(x, y)) : $elm$core$Maybe$Nothing;
	});
var $author$project$Grid$slope = function (_v0) {
	var _v1 = _v0.a;
	var p_x = _v1.a;
	var p_y = _v1.b;
	var _v2 = _v0.b;
	var q_x = _v2.a;
	var q_y = _v2.b;
	return _Utils_eq(p_x, q_x) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just((q_y - p_y) / (q_x - p_x));
};
var $author$project$Grid$isHorizontal = function (_v0) {
	var p = _v0.a;
	var q = _v0.b;
	var _v1 = $author$project$Grid$slope(
		_Utils_Tuple2(p, q));
	if (_v1.$ === 'Nothing') {
		return false;
	} else {
		var m = _v1.a;
		return !m;
	}
};
var $author$project$Grid$solve_for_x = F2(
	function (y, _v0) {
		var _v1 = _v0.a;
		var x1 = _v1.a;
		var y1 = _v1.b;
		var _v2 = _v0.b;
		var x2 = _v2.a;
		var y2 = _v2.b;
		if (_Utils_eq(x1, x2)) {
			return _Utils_eq(y1, y2) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(x1);
		} else {
			var m = (y2 - y1) / (x2 - x1);
			return $elm$core$Maybe$Just(x1 + ((y - y1) / m));
		}
	});
var $author$project$Grid$point_inside_polygon = F2(
	function (_v0, poly) {
		var x = _v0.a;
		var y = _v0.b;
		var shape_lines = $author$project$Grid$pointsToLines(poly);
		var maybe_to_bool = function (m) {
			if (m.$ === 'Nothing') {
				return false;
			} else {
				var foo = m.a;
				return true;
			}
		};
		var ends_on_horizontal = function (_v3) {
			var _v4 = _v3.a;
			var p_x = _v4.a;
			var p_y = _v4.b;
			var _v5 = _v3.b;
			var q_x = _v5.a;
			var q_y = _v5.b;
			var _v2 = _Utils_Tuple2(
				A2($elm$core$Basics$min, p_y, q_y),
				A2($elm$core$Basics$max, p_y, q_y));
			var min_y = _v2.a;
			var max_y = _v2.b;
			return (!_Utils_eq(min_y, y)) && (_Utils_eq(max_y, y) && (_Utils_cmp(q_x, x) > -1));
		};
		var num_ends = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				$elm$core$Basics$identity,
				A2($elm$core$List$map, ends_on_horizontal, shape_lines)));
		var check_x = function (_v1) {
			var n = _v1.a;
			return (_Utils_cmp(n, x) > -1) ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
		};
		var intersects_horizontal = function (line) {
			return $author$project$Grid$isHorizontal(line) ? A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				A2(
					$author$project$Grid$check_bound,
					line,
					_Utils_Tuple2(x, y))) : A2(
				$elm$core$Maybe$andThen,
				check_x,
				A2(
					$elm$core$Maybe$andThen,
					function (n) {
						return A2(
							$author$project$Grid$check_bound,
							line,
							_Utils_Tuple2(n, y));
					},
					A2($author$project$Grid$solve_for_x, y, line)));
		};
		var intersections = A2($elm$core$List$map, intersects_horizontal, shape_lines);
		var num_intersections = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				$elm$core$Basics$identity,
				A2($elm$core$List$map, maybe_to_bool, intersections)));
		var on_outline = A3(
			$elm$core$List$foldl,
			F2(
				function (n, acc) {
					return acc || _Utils_eq(
						n,
						$elm$core$Maybe$Just(x));
				}),
			false,
			intersections);
		return on_outline || (A2($elm$core$Basics$modBy, 2, num_intersections - num_ends) === 1);
	});
var $author$project$Grid$is_inner = F2(
	function (x, y) {
		return A3(
			$elm$core$List$foldl,
			$elm$core$Basics$and,
			true,
			A2(
				$elm$core$List$map,
				function (pt) {
					return A2($author$project$Grid$point_inside_polygon, pt, y);
				},
				x));
	});
var $author$project$Grid$is_outer = F2(
	function (x, y) {
		return A3(
			$elm$core$List$foldl,
			$elm$core$Basics$and,
			true,
			A2(
				$elm$core$List$map,
				function (pt) {
					return A2($author$project$Grid$point_inside_polygon, pt, x);
				},
				y));
	});
var $elm_community$maybe_extra$Maybe$Extra$oneOf = F2(
	function (fmbs, a) {
		oneOf:
		while (true) {
			if (!fmbs.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var fmb = fmbs.a;
				var rest = fmbs.b;
				var _v1 = fmb(a);
				if (_v1.$ === 'Just') {
					var b = _v1.a;
					return $elm$core$Maybe$Just(b);
				} else {
					var $temp$fmbs = rest,
						$temp$a = a;
					fmbs = $temp$fmbs;
					a = $temp$a;
					continue oneOf;
				}
			}
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$orListLazy = function (maybes) {
	return A2($elm_community$maybe_extra$Maybe$Extra$oneOf, maybes, _Utils_Tuple0);
};
var $author$project$Grid$reverse = $elm$core$List$reverse;
var $author$project$Grid$set_direction = F2(
	function (dir, poly) {
		return _Utils_eq(
			dir,
			$author$project$Grid$direction(poly)) ? poly : $author$project$Grid$reverse(poly);
	});
var $author$project$Cycle$Forward = {$: 'Forward'};
var $author$project$Cycle$current = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $elm$core$Maybe$Nothing;
	} else {
		var n = cyc.b;
		return $elm$core$Maybe$Just(n);
	}
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $author$project$Cycle$next = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $elm$core$Maybe$Nothing;
	} else {
		if (!cyc.c.b) {
			var cba = cyc.a;
			return $elm_community$list_extra$List$Extra$last(cba);
		} else {
			var _v1 = cyc.c;
			var x = _v1.a;
			var yz = _v1.b;
			return $elm$core$Maybe$Just(x);
		}
	}
};
var $author$project$Cycle$prev = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $elm$core$Maybe$Nothing;
	} else {
		if (!cyc.a.b) {
			var xyz = cyc.c;
			return $elm_community$list_extra$List$Extra$last(xyz);
		} else {
			var _v1 = cyc.a;
			var c = _v1.a;
			var ba = _v1.b;
			return $elm$core$Maybe$Just(c);
		}
	}
};
var $author$project$Cycle$Cycle = F3(
	function (a, b, c) {
		return {$: 'Cycle', a: a, b: b, c: c};
	});
var $author$project$Cycle$Empty = {$: 'Empty'};
var $author$project$Cycle$stepBackward = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $author$project$Cycle$Empty;
	} else {
		if (cyc.a.b) {
			var _v1 = cyc.a;
			var c = _v1.a;
			var ba = _v1.b;
			var n = cyc.b;
			var xyz = cyc.c;
			return A3(
				$author$project$Cycle$Cycle,
				ba,
				c,
				A2($elm$core$List$cons, n, xyz));
		} else {
			if (!cyc.c.b) {
				var n = cyc.b;
				return A3($author$project$Cycle$Cycle, _List_Nil, n, _List_Nil);
			} else {
				var n = cyc.b;
				var xyz = cyc.c;
				var _v2 = $elm$core$List$reverse(
					A2($elm$core$List$cons, n, xyz));
				if (!_v2.b) {
					return cyc;
				} else {
					var z = _v2.a;
					var yxn = _v2.b;
					return A3($author$project$Cycle$Cycle, yxn, z, _List_Nil);
				}
			}
		}
	}
};
var $author$project$Grid$calc_point = F2(
	function (_v0, _v3) {
		var _v1 = _v0.a;
		var p1_x = _v1.a;
		var p1_y = _v1.b;
		var _v2 = _v0.b;
		var p2_x = _v2.a;
		var p2_y = _v2.b;
		var _v4 = _v3.a;
		var q1_x = _v4.a;
		var q1_y = _v4.b;
		var _v5 = _v3.b;
		var q2_x = _v5.a;
		var q2_y = _v5.b;
		var q_b = q1_x - q2_x;
		var q_a = q2_y - q1_y;
		var q_c = (q_a * q1_x) + (q_b * q1_y);
		var p_b = p1_x - p2_x;
		var p_a = p2_y - p1_y;
		var p_c = (p_a * p1_x) + (p_b * p1_y);
		var determinant = (p_a * q_b) - (q_a * p_b);
		return (!determinant) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			_Utils_Tuple2(((q_b * p_c) - (p_b * q_c)) / determinant, ((p_a * q_c) - (q_a * p_c)) / determinant));
	});
var $author$project$Grid$check_bounds = F3(
	function (line_1, line_2, pt) {
		return A2(
			$elm$core$Maybe$andThen,
			$author$project$Grid$check_bound(line_2),
			A2($author$project$Grid$check_bound, line_1, pt));
	});
var $author$project$Grid$line_intersect = F2(
	function (line_1, line_2) {
		return A2(
			$elm$core$Maybe$andThen,
			A2($author$project$Grid$check_bounds, line_1, line_2),
			A2($author$project$Grid$calc_point, line_1, line_2));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Grid$order_points = function (_v0) {
	var p = _v0.a;
	return $elm$core$List$sortBy(
		$author$project$Grid$distance(p));
};
var $author$project$Grid$insert_intersection_points = F2(
	function (poly, outline) {
		var recurse = F2(
			function (lines, outline_) {
				if (!lines.b) {
					return _List_Nil;
				} else {
					var _v1 = lines.a;
					var p = _v1.a;
					var q = _v1.b;
					var rest = lines.b;
					var curr_intersects = A2(
						$author$project$Grid$order_points,
						_Utils_Tuple2(p, q),
						$elm_community$maybe_extra$Maybe$Extra$values(
							A2(
								$elm$core$List$map,
								$author$project$Grid$line_intersect(
									_Utils_Tuple2(p, q)),
								outline_)));
					return _Utils_ap(
						A2($elm$core$List$cons, p, curr_intersects),
						A2(recurse, rest, outline_));
				}
			});
		var _v2 = _Utils_Tuple2(
			$author$project$Grid$pointsToLines(poly),
			$author$project$Grid$pointsToLines(outline));
		var poly_lines = _v2.a;
		var outline_lines = _v2.b;
		var new_pts = A2(recurse, poly_lines, outline_lines);
		return _Utils_eq(new_pts, poly) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(new_pts);
	});
var $author$project$Grid$create_intersections = F2(
	function (poly_a, poly_b) {
		var _v0 = _Utils_Tuple2(
			$author$project$Grid$pointsToLines(poly_a),
			$author$project$Grid$pointsToLines(poly_b));
		var a_lines = _v0.a;
		var b_lines = _v0.b;
		var sects = $elm_community$maybe_extra$Maybe$Extra$values(
			$elm$core$List$concat(
				A2(
					$elm$core$List$map,
					function (p) {
						return A2(
							$elm$core$List$map,
							function (q) {
								return A2($author$project$Grid$line_intersect, p, q);
							},
							a_lines);
					},
					b_lines)));
		if (!sects.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v2 = _Utils_Tuple2(
				A2($author$project$Grid$insert_intersection_points, poly_a, poly_b),
				A2($author$project$Grid$insert_intersection_points, poly_b, poly_a));
			if ((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) {
				var new_a = _v2.a.a;
				var new_b = _v2.b.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple3(new_a, new_b, sects));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Cycle$fromList = function (list) {
	if (!list.b) {
		return $author$project$Cycle$Empty;
	} else {
		var x = list.a;
		var xs = list.b;
		return A3($author$project$Cycle$Cycle, _List_Nil, x, xs);
	}
};
var $author$project$Cycle$stepForward = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $author$project$Cycle$Empty;
	} else {
		if (cyc.c.b) {
			var cba = cyc.a;
			var n = cyc.b;
			var _v1 = cyc.c;
			var x = _v1.a;
			var yz = _v1.b;
			return A3(
				$author$project$Cycle$Cycle,
				A2($elm$core$List$cons, n, cba),
				x,
				yz);
		} else {
			if (!cyc.a.b) {
				var n = cyc.b;
				return A3($author$project$Cycle$Cycle, _List_Nil, n, _List_Nil);
			} else {
				var cba = cyc.a;
				var n = cyc.b;
				var _v2 = $elm$core$List$reverse(
					A2($elm$core$List$cons, n, cba));
				if (!_v2.b) {
					return cyc;
				} else {
					var a = _v2.a;
					var bcn = _v2.b;
					return A3($author$project$Cycle$Cycle, _List_Nil, a, bcn);
				}
			}
		}
	}
};
var $author$project$Cycle$toFirst = function (cyc) {
	if (cyc.$ === 'Empty') {
		return $author$project$Cycle$Empty;
	} else {
		var cba = cyc.a;
		var n = cyc.b;
		var xyz = cyc.c;
		var _v1 = $elm$core$List$reverse(cba);
		if (!_v1.b) {
			return cyc;
		} else {
			var a = _v1.a;
			var bc = _v1.b;
			return A3(
				$author$project$Cycle$Cycle,
				_List_Nil,
				a,
				_Utils_ap(
					bc,
					_Utils_ap(
						_List_fromArray(
							[n]),
						xyz)));
		}
	}
};
var $author$project$Cycle$shiftUntilWhole = F2(
	function (success, cyc) {
		var recurse = function (cyc_) {
			recurse:
			while (true) {
				if (cyc_.$ === 'Empty') {
					return success($author$project$Cycle$Empty) ? $elm$core$Maybe$Just($author$project$Cycle$Empty) : $elm$core$Maybe$Nothing;
				} else {
					var xyz = cyc_.c;
					if (success(cyc_)) {
						return $elm$core$Maybe$Just(cyc_);
					} else {
						if (!xyz.b) {
							return $elm$core$Maybe$Nothing;
						} else {
							var $temp$cyc_ = $author$project$Cycle$stepForward(cyc_);
							cyc_ = $temp$cyc_;
							continue recurse;
						}
					}
				}
			}
		};
		return recurse(
			$author$project$Cycle$toFirst(cyc));
	});
var $author$project$Grid$trace_polygons = F4(
	function (valid_start, weave_func, poly_a, poly_b) {
		var recurse = F3(
			function (cyc_a, cyc_b, sects) {
				if (_Utils_eq(sects, _List_Nil)) {
					return _List_Nil;
				} else {
					var shift_to_intersection = F2(
						function (cyc_x, poly_y) {
							return A2(
								$author$project$Cycle$shiftUntilWhole,
								A2(valid_start, sects, poly_y),
								cyc_x);
						});
					var remaining_sects = function (s) {
						return A2(
							$elm$core$List$filter,
							function (x) {
								return !A2($elm$core$List$member, x, s);
							},
							sects);
					};
					var perform_weave = function (cyc_x) {
						return A2(weave_func, cyc_x, cyc_b);
					};
					var _v0 = A2(shift_to_intersection, cyc_a, poly_b);
					if (_v0.$ === 'Nothing') {
						return _List_Nil;
					} else {
						var shifted_a = _v0.a;
						var new_shape = perform_weave(shifted_a);
						return A2(
							$elm$core$List$cons,
							new_shape,
							A3(
								recurse,
								shifted_a,
								cyc_b,
								remaining_sects(new_shape)));
					}
				}
			});
		var init_recurse = function (_v1) {
			var poly_a_i = _v1.a;
			var poly_b_i = _v1.b;
			var sects = _v1.c;
			return A3(
				recurse,
				$author$project$Cycle$fromList(poly_a_i),
				$author$project$Cycle$fromList(poly_b_i),
				sects);
		};
		return A2(
			$elm$core$Maybe$map,
			init_recurse,
			A2($author$project$Grid$create_intersections, poly_a, poly_b));
	});
var $elm_community$maybe_extra$Maybe$Extra$unwrap = F3(
	function (_default, f, m) {
		if (m.$ === 'Nothing') {
			return _default;
		} else {
			var a = m.a;
			return f(a);
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$orLazy = F2(
	function (ma, fmb) {
		if (ma.$ === 'Nothing') {
			return fmb(_Utils_Tuple0);
		} else {
			return ma;
		}
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Cycle$lengths = function (cyc) {
	if (cyc.$ === 'Empty') {
		return _Utils_Tuple2(0, 0);
	} else {
		var cba = cyc.a;
		var xyz = cyc.c;
		return _Utils_Tuple2(
			$elm$core$List$length(cba),
			$elm$core$List$length(xyz));
	}
};
var $author$project$Cycle$shift = F2(
	function (amount, cyc) {
		if (cyc.$ === 'Empty') {
			return $author$project$Cycle$Empty;
		} else {
			var cba = cyc.a;
			var n = cyc.b;
			var xyz = cyc.c;
			var recurse_t = F2(
				function (i, cyc_) {
					recurse_t:
					while (true) {
						if (!i) {
							return cyc_;
						} else {
							var $temp$i = i - 1,
								$temp$cyc_ = $author$project$Cycle$stepForward(cyc_);
							i = $temp$i;
							cyc_ = $temp$cyc_;
							continue recurse_t;
						}
					}
				});
			var recurse_h = F2(
				function (i, cyc_) {
					recurse_h:
					while (true) {
						if (!i) {
							return cyc_;
						} else {
							var $temp$i = i - 1,
								$temp$cyc_ = $author$project$Cycle$stepBackward(cyc_);
							i = $temp$i;
							cyc_ = $temp$cyc_;
							continue recurse_h;
						}
					}
				});
			var _v1 = $author$project$Cycle$lengths(cyc);
			var h_len = _v1.a;
			var t_len = _v1.b;
			var len = (h_len + t_len) + 1;
			var num = A2($elm$core$Basics$modBy, len, amount);
			return (_Utils_cmp(num, t_len) < 0) ? A2(recurse_t, num, cyc) : A2(
				recurse_h,
				$elm$core$Basics$abs(num - len),
				cyc);
		}
	});
var $author$project$Cycle$shiftUntil = F2(
	function (success, cyc) {
		if (cyc.$ === 'Empty') {
			return $elm$core$Maybe$Nothing;
		} else {
			var cba = cyc.a;
			var n = cyc.b;
			var xyz = cyc.c;
			var in_list = F2(
				function (list, acc) {
					in_list:
					while (true) {
						if (!list.b) {
							return $elm$core$Maybe$Nothing;
						} else {
							var x = list.a;
							var xs = list.b;
							if (success(x)) {
								return $elm$core$Maybe$Just(acc);
							} else {
								var $temp$list = xs,
									$temp$acc = acc + 1;
								list = $temp$list;
								acc = $temp$acc;
								continue in_list;
							}
						}
					}
				});
			var in_right = A2(in_list, xyz, 1);
			var in_left = function (_v2) {
				return A2(
					$elm$core$Maybe$map,
					$elm$core$Basics$mul(-1),
					A2(in_list, cba, 1));
			};
			return A2(
				$elm$core$Maybe$map,
				function (i) {
					return A2($author$project$Cycle$shift, i, cyc);
				},
				A2($elm_community$maybe_extra$Maybe$Extra$orLazy, in_right, in_left));
		}
	});
var $author$project$Cycle$step = function (dir) {
	if (dir.$ === 'Forward') {
		return $author$project$Cycle$stepForward;
	} else {
		return $author$project$Cycle$stepBackward;
	}
};
var $author$project$Cycle$weaveMatchDiff = F6(
	function (match_func, decision_func_1, decision_func_2, init_dir, c_1, c_2) {
		var decision_func = function (b) {
			return b ? decision_func_1 : decision_func_2;
		};
		var recurse = F6(
			function (first_cycle, main_cycle, other_cycle, last_dec, start_pt, counter) {
				if (main_cycle.$ === 'Empty') {
					return _List_Nil;
				} else {
					var n = main_cycle.b;
					if (_Utils_eq(n, start_pt)) {
						return _List_Nil;
					} else {
						var _v1 = A2(
							$author$project$Cycle$shiftUntil,
							match_func(n),
							other_cycle);
						if (_v1.$ === 'Nothing') {
							return A2(
								$elm$core$List$cons,
								n,
								A6(
									recurse,
									first_cycle,
									A2($author$project$Cycle$step, last_dec.dir, main_cycle),
									other_cycle,
									last_dec,
									start_pt,
									counter - 1));
						} else {
							var other_cycle_shifted = _v1.a;
							if (other_cycle_shifted.$ === 'Empty') {
								return _List_Nil;
							} else {
								var _v3 = A5(decision_func, first_cycle, n, main_cycle, other_cycle_shifted, last_dec);
								if (_v3.$ === 'Nothing') {
									return _List_Nil;
								} else {
									var new_dec = _v3.a;
									return new_dec._switch ? A2(
										$elm$core$List$cons,
										n,
										A6(
											recurse,
											!first_cycle,
											A2($author$project$Cycle$step, new_dec.dir, other_cycle_shifted),
											main_cycle,
											new_dec,
											start_pt,
											counter - 1)) : A2(
										$elm$core$List$cons,
										n,
										A6(
											recurse,
											first_cycle,
											A2($author$project$Cycle$step, new_dec.dir, main_cycle),
											other_cycle,
											new_dec,
											start_pt,
											counter - 1));
								}
							}
						}
					}
				}
			});
		var _v4 = $author$project$Cycle$current(c_1);
		if (_v4.$ === 'Nothing') {
			return _List_Nil;
		} else {
			var pt = _v4.a;
			return A2(
				$elm$core$List$cons,
				pt,
				A6(
					recurse,
					true,
					A2($author$project$Cycle$step, init_dir, c_1),
					c_2,
					{dir: init_dir, _switch: true},
					pt,
					50));
		}
	});
var $author$project$Grid$trace_polygons_maker = F3(
	function (initial_d, poly_a, poly_b) {
		var mb_point_inside_b = A2(
			$elm_community$maybe_extra$Maybe$Extra$unwrap,
			false,
			function (pt) {
				return A2($author$project$Grid$point_inside_polygon, pt, poly_b);
			});
		var switch_a = F4(
			function (_v5, cyc_a, cyc_b, _v6) {
				return (_Utils_eq(initial_d, $author$project$Cycle$Forward) && mb_point_inside_b(
					$author$project$Cycle$next(cyc_a))) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Forward, _switch: true}) : (mb_point_inside_b(
					$author$project$Cycle$prev(cyc_a)) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Backward, _switch: true}) : (mb_point_inside_b(
					$author$project$Cycle$next(cyc_a)) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Forward, _switch: true}) : $elm$core$Maybe$Nothing));
			});
		var mb_point_inside_a = A2(
			$elm_community$maybe_extra$Maybe$Extra$unwrap,
			false,
			function (pt) {
				return A2($author$project$Grid$point_inside_polygon, pt, poly_a);
			});
		var switch_b = F4(
			function (_v3, cyc_a, cyc_b, _v4) {
				return (_Utils_eq(initial_d, $author$project$Cycle$Forward) && mb_point_inside_a(
					$author$project$Cycle$next(cyc_b))) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Forward, _switch: true}) : (mb_point_inside_a(
					$author$project$Cycle$prev(cyc_b)) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Backward, _switch: true}) : (mb_point_inside_a(
					$author$project$Cycle$next(cyc_b)) ? $elm$core$Maybe$Just(
					{dir: $author$project$Cycle$Forward, _switch: true}) : $elm$core$Maybe$Nothing));
			});
		var weave_func = A4($author$project$Cycle$weaveMatchDiff, $elm$core$Basics$eq, switch_a, switch_b, initial_d);
		var entering_poly = F3(
			function (sects, poly, cyc) {
				if (cyc.$ === 'Empty') {
					return false;
				} else {
					var start_pt = cyc.b;
					var recurse = F2(
						function (b, curr_cyc) {
							recurse:
							while (true) {
								var shifted_cyc = $author$project$Cycle$stepBackward(curr_cyc);
								var _v2 = $author$project$Cycle$current(shifted_cyc);
								if (_v2.$ === 'Nothing') {
									return false;
								} else {
									var pt = _v2.a;
									if (_Utils_eq(pt, start_pt)) {
										return false;
									} else {
										if (A2($elm$core$List$member, pt, sects)) {
											var $temp$b = !b,
												$temp$curr_cyc = shifted_cyc;
											b = $temp$b;
											curr_cyc = $temp$curr_cyc;
											continue recurse;
										} else {
											return (b ? $elm$core$Basics$not : $elm$core$Basics$identity)(
												A2($author$project$Grid$point_inside_polygon, pt, poly));
										}
									}
								}
							}
						});
					return A2(recurse, true, cyc);
				}
			});
		var valid_start = F3(
			function (sects, poly, cyc) {
				var _v0 = $author$project$Cycle$current(cyc);
				if (_v0.$ === 'Just') {
					var curr = _v0.a;
					return A2($elm$core$List$member, curr, sects) && A3(entering_poly, sects, poly, cyc);
				} else {
					return false;
				}
			});
		return A4($author$project$Grid$trace_polygons, valid_start, weave_func, poly_a, poly_b);
	});
var $author$project$Grid$difference_polygons = F2(
	function (poly_a, poly_b) {
		var make_trace = F2(
			function (a, b) {
				return A2(
					$elm$core$Maybe$map,
					$toastal$either$Either$Left,
					A3($author$project$Grid$trace_polygons_maker, $author$project$Cycle$Backward, a, b));
			});
		var make_composite = F2(
			function (a, b) {
				return A2($author$project$Grid$is_outer, a, b) ? $elm$core$Maybe$Just(
					$toastal$either$Either$Right(
						_Utils_Tuple2(
							a,
							_List_fromArray(
								[b])))) : (A2($author$project$Grid$is_inner, a, b) ? $elm$core$Maybe$Just(
					$toastal$either$Either$Left(_List_Nil)) : $elm$core$Maybe$Nothing);
			});
		var corrected_b = A2($author$project$Grid$set_direction, $author$project$Grid$Clockwise, poly_b);
		var corrected_a = A2($author$project$Grid$set_direction, $author$project$Grid$Widdershins, poly_a);
		var _v0 = _Utils_Tuple2(
			$author$project$Grid$direction(poly_a),
			$author$project$Grid$direction(poly_b));
		var dir_a = _v0.a;
		var dir_b = _v0.b;
		return $elm_community$maybe_extra$Maybe$Extra$orListLazy(
			_List_fromArray(
				[
					function (_v1) {
					return A2(make_trace, corrected_a, corrected_b);
				},
					function (_v2) {
					return A2(make_composite, poly_a, poly_b);
				}
				]));
	});
var $author$project$Grid$get_outer_inner = F2(
	function (poly_a, poly_b) {
		var x_in_y = F2(
			function (x, y) {
				return A3(
					$elm$core$List$foldl,
					$elm$core$Basics$and,
					true,
					A2(
						$elm$core$List$map,
						function (pt) {
							return A2($author$project$Grid$point_inside_polygon, pt, y);
						},
						x));
			});
		return A2(x_in_y, poly_a, poly_b) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(poly_b, poly_a)) : (A2(x_in_y, poly_b, poly_a) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(poly_a, poly_b)) : $elm$core$Maybe$Nothing);
	});
var $author$project$Grid$get_inner = F2(
	function (poly_a, poly_b) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2($author$project$Grid$get_outer_inner, poly_a, poly_b));
	});
var $author$project$Grid$opposite_dir = function (dir) {
	if (dir.$ === 'Clockwise') {
		return $author$project$Grid$Widdershins;
	} else {
		return $author$project$Grid$Clockwise;
	}
};
var $author$project$Grid$intersect_polygons = F2(
	function (poly_a, poly_b) {
		var take_inner = F2(
			function (a, b) {
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$singleton,
					A2($author$project$Grid$get_inner, a, b));
			});
		var make_trace = $author$project$Grid$trace_polygons_maker($author$project$Cycle$Forward);
		var corrected_b = A2(
			$author$project$Grid$set_direction,
			$author$project$Grid$opposite_dir(
				$author$project$Grid$direction(poly_a)),
			poly_b);
		return $elm_community$maybe_extra$Maybe$Extra$orListLazy(
			_List_fromArray(
				[
					function (_v0) {
					return A2(make_trace, poly_a, corrected_b);
				},
					function (_v1) {
					return A2(take_inner, poly_a, poly_b);
				}
				]));
	});
var $toastal$either$Either$leftToMaybe = function (e) {
	if (e.$ === 'Right') {
		return $elm$core$Maybe$Nothing;
	} else {
		var x = e.a;
		return $elm$core$Maybe$Just(x);
	}
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Grid$determine_outline = function (p_list) {
	if (!p_list.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		if (!p_list.b.b) {
			var p = p_list.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(p, _List_Nil));
		} else {
			var p = p_list.a;
			var ps = p_list.b;
			var results = A2(
				$elm$core$Maybe$map,
				function (pt) {
					return A2(
						$elm$core$List$partition,
						function (q) {
							return A2($author$project$Grid$point_inside_polygon, pt, q);
						},
						ps);
				},
				$elm$core$List$head(p));
			if (results.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = results.a;
				var candidates = _v2.a;
				var holes = _v2.b;
				if (!candidates.b) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(p, holes));
				} else {
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapSecond(
							$elm$core$Basics$append(holes)),
						$author$project$Grid$determine_outline(candidates));
				}
			}
		}
	}
};
var $author$project$Grid$get_outer = F2(
	function (poly_a, poly_b) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			A2($author$project$Grid$get_outer_inner, poly_a, poly_b));
	});
var $author$project$Grid$union_polygons = F2(
	function (poly_a, poly_b) {
		var take_outer = F2(
			function (a, b) {
				return A2(
					$elm$core$Maybe$map,
					function (x) {
						return _Utils_Tuple2(x, _List_Nil);
					},
					A2($author$project$Grid$get_outer, a, b));
			});
		var make_trace = F2(
			function (a, b) {
				return A2(
					$elm$core$Maybe$andThen,
					$author$project$Grid$determine_outline,
					A3($author$project$Grid$trace_polygons_maker, $author$project$Cycle$Backward, a, b));
			});
		var corrected_b = A2(
			$author$project$Grid$set_direction,
			$author$project$Grid$direction(poly_a),
			poly_b);
		return $elm_community$maybe_extra$Maybe$Extra$orListLazy(
			_List_fromArray(
				[
					function (_v0) {
					return A2(make_trace, poly_a, corrected_b);
				},
					function (_v1) {
					return A2(take_outer, poly_a, poly_b);
				}
				]));
	});
var $author$project$Grid$union = F2(
	function (a, b) {
		union:
		while (true) {
			var make_holes = F2(
				function (outline, holes) {
					var map_func = function (p) {
						return A2(
							$elm$core$Maybe$withDefault,
							$toastal$either$Either$Left(
								_List_fromArray(
									[p])),
							A2($author$project$Grid$difference_polygons, p, outline));
					};
					var differences = A2($elm$core$List$map, map_func, holes);
					return A3(
						$elm$core$List$foldl,
						F2(
							function (c, acc) {
								return A3(
									$elm$core$Maybe$map2,
									$elm$core$Basics$append,
									$toastal$either$Either$leftToMaybe(c),
									acc);
							}),
						$elm$core$Maybe$Just(_List_Nil),
						differences);
				});
			var _v0 = _Utils_Tuple2(a, b);
			if (_v0.a.$ === 'Polygon') {
				if (_v0.b.$ === 'Polygon') {
					var a_poly = _v0.a.a;
					var b_poly = _v0.b.a;
					return A2(
						$elm$core$Maybe$map,
						$author$project$Grid$fromPolygonTuple,
						A2($author$project$Grid$union_polygons, a_poly, b_poly));
				} else {
					var _v3 = _v0.b;
					var $temp$a = b,
						$temp$b = a;
					a = $temp$a;
					b = $temp$b;
					continue union;
				}
			} else {
				if (_v0.b.$ === 'Polygon') {
					var _v1 = _v0.a;
					var a_outline = _v1.a;
					var a_holes = _v1.b;
					var b_poly = _v0.b.a;
					var new_outline = A2($author$project$Grid$union_polygons, a_outline, b_poly);
					var new_holes = A2(make_holes, b_poly, a_holes);
					var handle_holes_and_outline = F2(
						function (holes, _v2) {
							var outline = _v2.a;
							var more_holes = _v2.b;
							return $author$project$Grid$fromPolygonTuple(
								_Utils_Tuple2(
									outline,
									_Utils_ap(holes, more_holes)));
						});
					return A3($elm$core$Maybe$map2, handle_holes_and_outline, new_holes, new_outline);
				} else {
					var _v4 = _v0.a;
					var a_outline = _v4.a;
					var a_holes = _v4.b;
					var _v5 = _v0.b;
					var b_outline = _v5.a;
					var b_holes = _v5.b;
					var new_outline = A2($author$project$Grid$union_polygons, a_outline, b_outline);
					var new_holes_both = $elm$core$List$concat(
						$elm_community$maybe_extra$Maybe$Extra$values(
							A3($author$project$Utils$cart_prod, $author$project$Grid$intersect_polygons, b_holes, a_holes)));
					var new_holes_b = A2(make_holes, a_outline, b_holes);
					var new_holes_a = A2(make_holes, b_outline, a_holes);
					var new_holes_either = A3($elm$core$Maybe$map2, $elm$core$Basics$append, new_holes_a, new_holes_b);
					var handle_holes_and_outline = F2(
						function (holes, _v6) {
							var outline = _v6.a;
							var more_holes = _v6.b;
							return $author$project$Grid$fromPolygonTuple(
								_Utils_Tuple2(
									outline,
									_Utils_ap(
										holes,
										_Utils_ap(more_holes, new_holes_both))));
						});
					return A3($elm$core$Maybe$map2, handle_holes_and_outline, new_holes_either, new_outline);
				}
			}
		}
	});
var $author$project$Main$add_ground = F2(
	function (new_shape, shape_list) {
		add_ground:
		while (true) {
			if (!shape_list.b) {
				return _List_fromArray(
					[new_shape]);
			} else {
				var head = shape_list.a;
				var tail = shape_list.b;
				var _v1 = A2($author$project$Grid$union, head.shape, new_shape.shape);
				if (_v1.$ === 'Nothing') {
					return A2(
						$elm$core$List$cons,
						head,
						A2($author$project$Main$add_ground, new_shape, tail));
				} else {
					var u = _v1.a;
					var $temp$new_shape = A2($author$project$Main$newMS, u, head.color),
						$temp$shape_list = tail;
					new_shape = $temp$new_shape;
					shape_list = $temp$shape_list;
					continue add_ground;
				}
			}
		}
	});
var $author$project$Main$add_wall = F2(
	function (path, path_list) {
		return A2($elm$core$List$cons, path, path_list);
	});
var $carwow$elm_slider$SingleSlider$fetchValue = function (_v0) {
	var valueAttributes = _v0.a.valueAttributes;
	return valueAttributes.value;
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Main$scaling_factor = 35;
var $author$project$Main$scaleColToGrid = function (n) {
	return n / $author$project$Main$scaling_factor;
};
var $author$project$Main$colToGrid = A2($elm$core$Tuple$mapBoth, $author$project$Main$scaleColToGrid, $author$project$Main$scaleColToGrid);
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Main$scaleGridToCol = $elm$core$Basics$mul($author$project$Main$scaling_factor);
var $author$project$Main$scaleGridToCol_i = A2($elm$core$Basics$composeL, $author$project$Main$scaleGridToCol, $elm$core$Basics$toFloat);
var $author$project$Main$jsToCol = F2(
	function (model, coord) {
		var ypos = $author$project$Main$scaleGridToCol_i(model.mapHeight + 2) - (coord.y + $author$project$Main$scaleGridToCol(1));
		var xpos = coord.x - $author$project$Main$scaleGridToCol(1);
		var topBound = $author$project$Main$scaleGridToCol_i(model.mapHeight + 1) - 10;
		var rightBound = $author$project$Main$scaleGridToCol_i(model.mapWidth + 1) - 10;
		var leftBound = $author$project$Main$scaleGridToCol(-1) + 10;
		var bottomBound = $author$project$Main$scaleGridToCol(-1) + 10;
		return _Utils_Tuple2(
			A3($elm$core$Basics$clamp, leftBound, rightBound, xpos),
			A3($elm$core$Basics$clamp, bottomBound, topBound, ypos));
	});
var $author$project$Main$jsToGrid = F2(
	function (model, coord) {
		return $author$project$Main$colToGrid(
			A2($author$project$Main$jsToCol, model, coord));
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Grid$roundPoint = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return _Utils_Tuple2(
		$elm$core$Basics$round(x),
		$elm$core$Basics$round(y));
};
var $author$project$Main$jsToGridLocked = F2(
	function (model, coord) {
		return $author$project$Grid$roundPoint(
			$author$project$Main$colToGrid(
				A2($author$project$Main$jsToCol, model, coord)));
	});
var $avh4$elm_color$Color$lightGray = A4($avh4$elm_color$Color$RgbaSpace, 238 / 255, 238 / 255, 236 / 255, 1.0);
var $author$project$Grid$lineOrigin = function (_v0) {
	var l = _v0.a;
	if (l.b && l.b.b) {
		var fst = l.a;
		var _v2 = l.b;
		return $elm$core$Maybe$Just(fst);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Grid$makeLinePts = F2(
	function (p1, p2) {
		return $author$project$Grid$Path(
			_List_fromArray(
				[p1, p2]));
	});
var $author$project$Grid$makeRectDims = F3(
	function (_v0, width, height) {
		var x = _v0.a;
		var y = _v0.b;
		return $author$project$Grid$Polygon(
			_List_fromArray(
				[
					_Utils_Tuple2(x, y),
					_Utils_Tuple2(x + width, y),
					_Utils_Tuple2(x + width, y + height),
					_Utils_Tuple2(x, y + height)
				]));
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Main$max_x_shape = function (s) {
	max_x_shape:
	while (true) {
		if (s.$ === 'Polygon') {
			var p = s.a;
			var _v1 = $elm$core$List$maximum(
				$elm$core$List$unzip(p).a);
			if (_v1.$ === 'Nothing') {
				return 1;
			} else {
				var x = _v1.a;
				return x;
			}
		} else {
			var outside = s.a;
			var holes = s.b;
			var $temp$s = $author$project$Grid$Polygon(outside);
			s = $temp$s;
			continue max_x_shape;
		}
	}
};
var $author$project$Main$msToShapeList = function (mss) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return x.shape;
		},
		mss);
};
var $author$project$Main$max_x_ground = function (xs) {
	var _v0 = $elm$core$List$maximum(
		A2(
			$elm$core$List$map,
			$author$project$Main$max_x_shape,
			$author$project$Main$msToShapeList(xs)));
	if (_v0.$ === 'Nothing') {
		return 1;
	} else {
		var x = _v0.a;
		return x;
	}
};
var $author$project$Main$max_x_path = function (_v0) {
	var p = _v0.a;
	var _v1 = $elm$core$List$maximum(
		$elm$core$List$unzip(p).a);
	if (_v1.$ === 'Nothing') {
		return 1;
	} else {
		var x = _v1.a;
		return x;
	}
};
var $author$project$Main$mpToPathList = function (mps) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return x.path;
		},
		mps);
};
var $author$project$Main$max_x_walls = function (xs) {
	var _v0 = $elm$core$List$maximum(
		A2(
			$elm$core$List$map,
			$author$project$Main$max_x_path,
			$author$project$Main$mpToPathList(xs)));
	if (_v0.$ === 'Nothing') {
		return 1;
	} else {
		var x = _v0.a;
		return x;
	}
};
var $author$project$Main$max_y_shape = function (s) {
	max_y_shape:
	while (true) {
		if (s.$ === 'Polygon') {
			var p = s.a;
			var _v1 = $elm$core$List$maximum(
				$elm$core$List$unzip(p).b);
			if (_v1.$ === 'Nothing') {
				return 1;
			} else {
				var y = _v1.a;
				return y;
			}
		} else {
			var outside = s.a;
			var holes = s.b;
			var $temp$s = $author$project$Grid$Polygon(outside);
			s = $temp$s;
			continue max_y_shape;
		}
	}
};
var $author$project$Main$max_y_ground = function (xs) {
	var _v0 = $elm$core$List$maximum(
		A2(
			$elm$core$List$map,
			$author$project$Main$max_y_shape,
			$author$project$Main$msToShapeList(xs)));
	if (_v0.$ === 'Nothing') {
		return 1;
	} else {
		var y = _v0.a;
		return y;
	}
};
var $author$project$Main$max_y_path = function (_v0) {
	var p = _v0.a;
	var _v1 = $elm$core$List$maximum(
		$elm$core$List$unzip(p).b);
	if (_v1.$ === 'Nothing') {
		return 1;
	} else {
		var y = _v1.a;
		return y;
	}
};
var $author$project$Main$max_y_walls = function (xs) {
	var _v0 = $elm$core$List$maximum(
		A2(
			$elm$core$List$map,
			$author$project$Main$max_y_path,
			$author$project$Main$mpToPathList(xs)));
	if (_v0.$ === 'Nothing') {
		return 1;
	} else {
		var y = _v0.a;
		return y;
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Grid$pathToShape = function (_v0) {
	var p = _v0.a;
	return $author$project$Grid$Polygon(p);
};
var $author$project$Stack$pop = function (_v0) {
	var _v1 = _v0.a;
	var n = _v1.a;
	var xs = _v1.b;
	if (!xs.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var hd = xs.a;
		var tl = xs.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(
				hd,
				$author$project$Stack$S(
					_Utils_Tuple2(n, tl))));
	}
};
var $author$project$Stack$push = F2(
	function (x, _v0) {
		var _v1 = _v0.a;
		var n = _v1.a;
		var xs = _v1.b;
		return (_Utils_cmp(
			$elm$core$List$length(xs),
			n) > -1) ? $author$project$Stack$S(
			_Utils_Tuple2(
				n,
				A2(
					$elm$core$List$cons,
					x,
					A2($elm$core$List$take, n - 1, xs)))) : $author$project$Stack$S(
			_Utils_Tuple2(
				n,
				A2($elm$core$List$cons, x, xs)));
	});
var $author$project$Grid$rach_makeRectPts = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var case1 = ((_Utils_cmp(x1, x2) > 0) && (_Utils_cmp(y1, y2) > 0)) || ((_Utils_cmp(x1, x2) < 0) && (_Utils_cmp(y1, y2) < 0));
		return $author$project$Grid$Polygon(
			_List_fromArray(
				[
					_Utils_Tuple2(x1, y1),
					case1 ? _Utils_Tuple2(x1, y2) : _Utils_Tuple2(
					A2($elm$core$Basics$max, x1, x2),
					A2($elm$core$Basics$max, y1, y2)),
					_Utils_Tuple2(x2, y2),
					case1 ? _Utils_Tuple2(x2, y1) : _Utils_Tuple2(
					A2($elm$core$Basics$min, x1, x2),
					A2($elm$core$Basics$min, y1, y2))
				]));
	});
var $author$project$Grid$rectOrigin = function (s) {
	rectOrigin:
	while (true) {
		if (s.$ === 'Polygon') {
			var p = s.a;
			var _v1 = $elm$core$List$head(p);
			if (_v1.$ === 'Just') {
				var point = _v1.a;
				return ($elm$core$List$length(p) === 4) ? $elm$core$Maybe$Just(point) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var outside = s.a;
			var holes = s.b;
			var $temp$s = $author$project$Grid$Polygon(outside);
			s = $temp$s;
			continue rectOrigin;
		}
	}
};
var $author$project$Grid$intersect_polygons_ = F2(
	function (poly_a, poly_b) {
		return A2(
			$elm$core$Maybe$withDefault,
			_List_fromArray(
				[poly_a, poly_b]),
			A2($author$project$Grid$intersect_polygons, poly_a, poly_b));
	});
var $author$project$Grid$union_list = F2(
	function (shape, list) {
		var transform_acc = F2(
			function (c, _v3) {
				var cs = _v3.a;
				var acc = _v3.b;
				var byproducts = _v3.c;
				var _v1 = A2($author$project$Grid$union_polygons, c, acc);
				if (_v1.$ === 'Nothing') {
					return _Utils_Tuple3(
						A2($elm$core$List$cons, c, cs),
						acc,
						byproducts);
				} else {
					var _v2 = _v1.a;
					var new_acc = _v2.a;
					var new_byproducts = _v2.b;
					return _Utils_Tuple3(
						cs,
						new_acc,
						_Utils_ap(new_byproducts, byproducts));
				}
			});
		var append_acc = function (_v0) {
			var cs = _v0.a;
			var acc = _v0.b;
			var byproducts = _v0.c;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, acc, cs),
				byproducts);
		};
		return append_acc(
			A3(
				$elm$core$List$foldl,
				transform_acc,
				_Utils_Tuple3(_List_Nil, shape, _List_Nil),
				list));
	});
var $author$project$Grid$union_list_t = F2(
	function (new_poly, list) {
		var transform_acc = F2(
			function (_v3, _v4) {
				var c_outline = _v3.a;
				var c_holes = _v3.b;
				var unaffected = _v4.a;
				var acc_outline = _v4.b;
				var acc_holes = _v4.c;
				var _v1 = A2($author$project$Grid$union_polygons, c_outline, acc_outline);
				if (_v1.$ === 'Nothing') {
					return _Utils_Tuple3(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(c_outline, c_holes),
							unaffected),
						acc_outline,
						acc_holes);
				} else {
					var _v2 = _v1.a;
					var new_outline = _v2.a;
					var new_holes = _v2.b;
					return _Utils_Tuple3(
						unaffected,
						new_outline,
						_Utils_ap(new_holes, acc_holes));
				}
			});
		var clean_up = function (_v0) {
			var unaffected = _v0.a;
			var acc_outline = _v0.b;
			var acc_holes = _v0.c;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(acc_outline, acc_holes),
				unaffected);
		};
		return clean_up(
			A3(
				$elm$core$List$foldl,
				transform_acc,
				_Utils_Tuple3(_List_Nil, new_poly, _List_Nil),
				list));
	});
var $author$project$Grid$union_lists = F2(
	function (list_a, list_b) {
		var fold_func = F2(
			function (new_poly, acc) {
				return A2($author$project$Grid$union_list_t, new_poly, acc);
			});
		return A3(
			$elm$core$List$foldl,
			fold_func,
			A2(
				$elm$core$List$map,
				function (x) {
					return _Utils_Tuple2(x, _List_Nil);
				},
				list_a),
			list_b);
	});
var $toastal$either$Either$unpack = F3(
	function (f, g, e) {
		if (e.$ === 'Right') {
			var b = e.a;
			return g(b);
		} else {
			var a = e.a;
			return f(a);
		}
	});
var $author$project$Grid$remove_hole = function (hole) {
	var separate_holes = A2(
		$elm$core$List$foldl,
		F2(
			function (_v4, _v5) {
				var o = _v4.a;
				var h = _v4.b;
				var acc_o = _v5.a;
				var acc_h = _v5.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, o, acc_o),
					_Utils_ap(h, acc_h));
			}),
		_Utils_Tuple2(_List_Nil, _List_Nil));
	var handle_single_hole = F2(
		function (old_holes, _v3) {
			var new_outline = _v3.a;
			var new_holes = _v3.b;
			return function (_v2) {
				var holes = _v2.a;
				var extras = _v2.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(new_outline, holes),
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(x, _List_Nil);
						},
						extras));
			}(
				separate_holes(
					A2($author$project$Grid$union_lists, new_holes, old_holes)));
		});
	var add_contained_holes = F2(
		function (holes, outline) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (h, _v1) {
						var o = _v1.a;
						var hs = _v1.b;
						return A2($author$project$Grid$is_outer, o, h) ? _Utils_Tuple2(
							o,
							A2($author$project$Grid$union_list, h, hs).a) : _Utils_Tuple2(o, hs);
					}),
				_Utils_Tuple2(outline, _List_Nil),
				holes);
		});
	var handle_difference = function (old_holes) {
		return A2(
			$toastal$either$Either$unpack,
			$elm$core$List$map(
				add_contained_holes(old_holes)),
			handle_single_hole(old_holes));
	};
	var remove_hole_from_tuple = function (_v0) {
		var outline = _v0.a;
		var old_holes = _v0.b;
		return A2(
			$elm$core$Maybe$withDefault,
			_List_fromArray(
				[
					_Utils_Tuple2(outline, old_holes)
				]),
			A2(
				$elm$core$Maybe$map,
				handle_difference(old_holes),
				A2($author$project$Grid$difference_polygons, outline, hole)));
	};
	return $elm$core$List$concatMap(remove_hole_from_tuple);
};
var $author$project$Grid$remove_all_holes = F2(
	function (holes, outline) {
		return A3(
			$elm$core$List$foldl,
			function (h) {
				return $author$project$Grid$remove_hole(h);
			},
			outline,
			holes);
	});
var $author$project$Grid$difference = F2(
	function (a, b) {
		var outline_map_func = F2(
			function (hole, outline) {
				var _v7 = A2($author$project$Grid$difference_polygons, outline, hole);
				if ((_v7.$ === 'Just') && (_v7.a.$ === 'Left')) {
					var new_outline = _v7.a.a;
					return new_outline;
				} else {
					return _List_fromArray(
						[outline]);
				}
			});
		var outline_fold_func = F2(
			function (hole, outlines) {
				return A2(
					$elm$core$List$concatMap,
					outline_map_func(hole),
					outlines);
			});
		var make_outline = function (outline) {
			return A2(
				$elm$core$List$foldl,
				outline_fold_func,
				_List_fromArray(
					[outline]));
		};
		var handle_indents = $elm$core$List$map($author$project$Grid$Polygon);
		var handle_hole = A2($elm$core$Basics$composeL, $elm$core$List$singleton, $author$project$Grid$fromPolygonTuple);
		var make_shapes = A2($toastal$either$Either$unpack, handle_indents, handle_hole);
		var format_as_tuples = $elm$core$List$map(
			function (o) {
				return _Utils_Tuple2(o, _List_Nil);
			});
		var convert_to_same = A2($toastal$either$Either$unpack, format_as_tuples, $elm$core$List$singleton);
		var _v0 = _Utils_Tuple2(a, b);
		if (_v0.a.$ === 'Polygon') {
			if (_v0.b.$ === 'Polygon') {
				var a_poly = _v0.a.a;
				var b_poly = _v0.b.a;
				return A2(
					$elm$core$Maybe$map,
					make_shapes,
					A2($author$project$Grid$difference_polygons, a_poly, b_poly));
			} else {
				var a_poly = _v0.a.a;
				var _v3 = _v0.b;
				var b_outline = _v3.a;
				var b_holes = _v3.b;
				var shapes_from_outline = A2(
					$elm$core$Maybe$map,
					convert_to_same,
					A2($author$project$Grid$difference_polygons, a_poly, b_outline));
				var shapes_from_holes = format_as_tuples(
					$elm$core$List$concat(
						$elm_community$maybe_extra$Maybe$Extra$values(
							A2(
								$elm$core$List$map,
								$author$project$Grid$intersect_polygons(a_poly),
								b_holes))));
				var all_shapes = A2(
					$elm$core$Maybe$map,
					$elm$core$Basics$append(shapes_from_holes),
					shapes_from_outline);
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$map($author$project$Grid$fromPolygonTuple),
					all_shapes);
			}
		} else {
			if (_v0.b.$ === 'Polygon') {
				var _v1 = _v0.a;
				var a_outline = _v1.a;
				var a_holes = _v1.b;
				var b_poly = _v0.b.a;
				var _v2 = A2($author$project$Grid$union_list, b_poly, a_holes);
				var new_holes = _v2.a;
				var new_pieces = _v2.b;
				var new_main_shape = A2(
					$author$project$Grid$remove_all_holes,
					new_holes,
					_List_fromArray(
						[
							_Utils_Tuple2(a_outline, _List_Nil)
						]));
				var new_shapes = A2(
					$elm$core$List$concatMap,
					$author$project$Grid$intersect_polygons_(a_outline),
					new_pieces);
				return $elm$core$Maybe$Just(
					_Utils_ap(
						A2($elm$core$List$map, $author$project$Grid$fromPolygonTuple, new_main_shape),
						A2($elm$core$List$map, $author$project$Grid$Polygon, new_shapes)));
			} else {
				var _v4 = _v0.a;
				var a_outline = _v4.a;
				var a_holes = _v4.b;
				var _v5 = _v0.b;
				var b_outline = _v5.a;
				var b_holes = _v5.b;
				var shapes_from_holes = A2(
					$author$project$Grid$remove_all_holes,
					a_holes,
					format_as_tuples(
						$elm$core$List$concat(
							$elm_community$maybe_extra$Maybe$Extra$values(
								A2(
									$elm$core$List$map,
									$author$project$Grid$intersect_polygons(a_outline),
									b_holes)))));
				var _v6 = A2($author$project$Grid$union_list, b_outline, a_holes);
				var new_holes = _v6.a;
				var new_pieces = _v6.b;
				var shapes_from_outline = A2(
					$author$project$Grid$remove_all_holes,
					new_holes,
					_List_fromArray(
						[
							_Utils_Tuple2(a_outline, _List_Nil)
						]));
				var all_shapes = _Utils_ap(shapes_from_holes, shapes_from_outline);
				return $elm$core$Maybe$Just(
					A2($elm$core$List$map, $author$project$Grid$fromPolygonTuple, all_shapes));
			}
		}
	});
var $author$project$Main$remove_ground = F2(
	function (shape, shape_list) {
		if (!shape_list.b) {
			return _List_Nil;
		} else {
			var head = shape_list.a;
			var tail = shape_list.b;
			var _v1 = A2($author$project$Grid$difference, head.shape, shape.shape);
			if (_v1.$ === 'Nothing') {
				return A2(
					$elm$core$List$cons,
					head,
					A2($author$project$Main$remove_ground, shape, tail));
			} else {
				var d = _v1.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return A2($author$project$Main$newMS, x, head.color);
						},
						d),
					A2($author$project$Main$remove_ground, shape, tail));
			}
		}
	});
var $author$project$Main$remove_wall = F2(
	function (path, path_list) {
		return A2(
			$elm$core$List$cons,
			A2($author$project$Main$newMP, path.path, $avh4$elm_color$Color$lightGray),
			path_list);
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$requestMap = _Platform_outgoingPort('requestMap', $elm$json$Json$Encode$string);
var $author$project$Main$requestMapNames = _Platform_outgoingPort(
	'requestMapNames',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Main$sendDownload = _Platform_outgoingPort('sendDownload', $elm$json$Json$Encode$bool);
var $author$project$Main$sendEditState = _Platform_outgoingPort('sendEditState', $elm$json$Json$Encode$bool);
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $avh4$elm_color$Color$fromHsla = function (_v0) {
	var hue = _v0.hue;
	var saturation = _v0.saturation;
	var lightness = _v0.lightness;
	var alpha = _v0.alpha;
	return A4($avh4$elm_color$Color$hsla, hue, saturation, lightness, alpha);
};
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $avh4$elm_color$Color$toHsla = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var minColor = A2(
		$elm$core$Basics$min,
		r,
		A2($elm$core$Basics$min, g, b));
	var maxColor = A2(
		$elm$core$Basics$max,
		r,
		A2($elm$core$Basics$max, g, b));
	var l = (minColor + maxColor) / 2;
	var s = _Utils_eq(minColor, maxColor) ? 0 : ((l < 0.5) ? ((maxColor - minColor) / (maxColor + minColor)) : ((maxColor - minColor) / ((2 - maxColor) - minColor)));
	var h1 = _Utils_eq(maxColor, r) ? ((g - b) / (maxColor - minColor)) : (_Utils_eq(maxColor, g) ? (2 + ((b - r) / (maxColor - minColor))) : (4 + ((r - g) / (maxColor - minColor))));
	var h2 = h1 * (1 / 6);
	var h3 = $elm$core$Basics$isNaN(h2) ? 0 : ((h2 < 0) ? (h2 + 1) : h2);
	return {alpha: a, hue: h3, lightness: l, saturation: s};
};
var $simonh1000$elm_colorpicker$ColorPicker$widgetWidth = 200;
var $simonh1000$elm_colorpicker$ColorPicker$calcHue = F2(
	function (col, _v0) {
		var x = _v0.x;
		var mousePressed = _v0.mousePressed;
		var hue = x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		var saturation = hsla.saturation;
		var lightness = hsla.lightness;
		var alpha = hsla.alpha;
		var newCol = ((!saturation) && (lightness < 0.02)) ? _Utils_update(
			hsla,
			{hue: hue, lightness: 0.5, saturation: 0.5}) : _Utils_update(
			hsla,
			{hue: hue});
		return $avh4$elm_color$Color$fromHsla(newCol);
	});
var $simonh1000$elm_colorpicker$ColorPicker$calcOpacity = F3(
	function (col, _v0, _v1) {
		var x = _v1.x;
		var mousePressed = _v1.mousePressed;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		return $avh4$elm_color$Color$fromHsla(
			_Utils_update(
				hsla,
				{alpha: x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth}));
	});
var $simonh1000$elm_colorpicker$ColorPicker$widgetHeight = 150;
var $simonh1000$elm_colorpicker$ColorPicker$calcSatLight = F3(
	function (col, currHue, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var mousePressed = _v0.mousePressed;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		return $avh4$elm_color$Color$fromHsla(
			_Utils_update(
				hsla,
				{hue: currHue, lightness: 1 - (y / $simonh1000$elm_colorpicker$ColorPicker$widgetHeight), saturation: x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth}));
	});
var $simonh1000$elm_colorpicker$ColorPicker$setHue = F3(
	function (mouseTarget, mouseInfo, model) {
		switch (mouseTarget.$) {
			case 'SatLight':
				var hue = mouseTarget.a;
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(
							A2($elm$core$Maybe$withDefault, hue, model.hue))
					});
			case 'HueSlider':
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(mouseInfo.x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth)
					});
			case 'OpacitySlider':
				var hue = mouseTarget.a;
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(
							A2($elm$core$Maybe$withDefault, hue, model.hue))
					});
			default:
				return model;
		}
	});
var $simonh1000$elm_colorpicker$ColorPicker$setMouseTarget = F2(
	function (mouseTarget, model) {
		return _Utils_update(
			model,
			{mouseTarget: mouseTarget});
	});
var $simonh1000$elm_colorpicker$ColorPicker$update_ = F3(
	function (message, col, model) {
		var calcNewColour = function (mouseTarget) {
			switch (mouseTarget.$) {
				case 'SatLight':
					var hue = mouseTarget.a;
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						A2(
							$simonh1000$elm_colorpicker$ColorPicker$calcSatLight,
							col,
							A2($elm$core$Maybe$withDefault, hue, model.hue)));
				case 'HueSlider':
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						$simonh1000$elm_colorpicker$ColorPicker$calcHue(col));
				case 'OpacitySlider':
					var hue = mouseTarget.a;
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						A2(
							$simonh1000$elm_colorpicker$ColorPicker$calcOpacity,
							col,
							A2($elm$core$Maybe$withDefault, hue, model.hue)));
				default:
					return function (_v2) {
						return $elm$core$Maybe$Nothing;
					};
			}
		};
		var handleMouseMove = F2(
			function (mouseTarget, mouseInfo) {
				return (mouseInfo.mousePressed && _Utils_eq(model.mouseTarget, mouseTarget)) ? _Utils_Tuple2(
					A3($simonh1000$elm_colorpicker$ColorPicker$setHue, mouseTarget, mouseInfo, model),
					A2(calcNewColour, mouseTarget, mouseInfo)) : (((!mouseInfo.mousePressed) && _Utils_eq(model.mouseTarget, mouseTarget)) ? _Utils_Tuple2(
					A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, $simonh1000$elm_colorpicker$ColorPicker$Unpressed, model),
					$elm$core$Maybe$Nothing) : _Utils_Tuple2(model, $elm$core$Maybe$Nothing));
			});
		switch (message.$) {
			case 'OnMouseDown':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return _Utils_Tuple2(
					A3(
						$simonh1000$elm_colorpicker$ColorPicker$setHue,
						mouseTarget,
						mouseInfo,
						A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, mouseTarget, model)),
					A2(calcNewColour, mouseTarget, mouseInfo));
			case 'OnMouseMove':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return A2(handleMouseMove, mouseTarget, mouseInfo);
			case 'OnClick':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return _Utils_Tuple2(
					A3($simonh1000$elm_colorpicker$ColorPicker$setHue, mouseTarget, mouseInfo, model),
					A2(calcNewColour, mouseTarget, mouseInfo));
			case 'OnMouseUp':
				return _Utils_Tuple2(
					A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, $simonh1000$elm_colorpicker$ColorPicker$Unpressed, model),
					$elm$core$Maybe$Nothing);
			default:
				return _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
		}
	});
var $simonh1000$elm_colorpicker$ColorPicker$update = F3(
	function (message, col, _v0) {
		var model = _v0.a;
		return A2(
			$elm$core$Tuple$mapFirst,
			$simonh1000$elm_colorpicker$ColorPicker$State,
			A3($simonh1000$elm_colorpicker$ColorPicker$update_, message, col, model));
	});
var $carwow$elm_slider$SingleSlider$update = F2(
	function (value, _v0) {
		var slider = _v0.a;
		var valueAttributes = slider.valueAttributes;
		return $carwow$elm_slider$SingleSlider$SingleSlider(
			{
				commonAttributes: slider.commonAttributes,
				valueAttributes: _Utils_update(
					valueAttributes,
					{value: value})
			});
	});
var $author$project$Main$uploadMap = _Platform_outgoingPort('uploadMap', $elm$core$Basics$identity);
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NullMsg':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'MouseMove':
				var coord = msg.a;
				var toGrid = function () {
					var _v9 = model.tool;
					switch (_v9.$) {
						case 'FreeformAutofill':
							return $author$project$Main$jsToGrid(model);
						case 'FreeformPen':
							return $author$project$Main$jsToGrid(model);
						default:
							return $author$project$Main$jsToGridLocked(model);
					}
				}();
				var ml = model.mouseLocation;
				var cur_r = model.currentRect;
				var cur = model.currentDrawing;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentDrawing: function () {
								var _v1 = model.tool;
								switch (_v1.$) {
									case 'Line':
										if (model.mouseDown) {
											var _v2 = _Utils_Tuple2(
												$author$project$Grid$lineOrigin(cur.path),
												ml);
											_v2$2:
											while (true) {
												if (_v2.a.$ === 'Just') {
													if (_v2.b.$ === 'Just') {
														var o = _v2.a.a;
														var loc = _v2.b.a;
														return A2(
															$author$project$Main$newMP,
															A2(
																$author$project$Grid$makeLinePts,
																o,
																toGrid(loc)),
															model.erasing ? $avh4$elm_color$Color$lightGray : model.currentColor);
													} else {
														break _v2$2;
													}
												} else {
													if (_v2.b.$ === 'Just') {
														var _v3 = _v2.a;
														var loc = _v2.b.a;
														return A2(
															$author$project$Main$newMP,
															A2(
																$author$project$Grid$makeLinePts,
																toGrid(loc),
																toGrid(loc)),
															model.erasing ? $avh4$elm_color$Color$lightGray : model.currentColor);
													} else {
														break _v2$2;
													}
												}
											}
											return cur;
										} else {
											return cur;
										}
									case 'Rectangle':
										return cur;
									default:
										if (model.mouseDown) {
											if (ml.$ === 'Just') {
												var loc = ml.a;
												return A2(
													$author$project$Main$newMP,
													A3(
														$author$project$Grid$addPointIfBeyond,
														0.1,
														toGrid(loc),
														cur.path),
													function () {
														if (model.erasing) {
															var _v5 = model.tool;
															switch (_v5.$) {
																case 'LockedAutofill':
																	return model.currentColor;
																case 'FreeformAutofill':
																	return model.currentColor;
																default:
																	return $avh4$elm_color$Color$lightGray;
															}
														} else {
															return model.currentColor;
														}
													}());
											} else {
												return cur;
											}
										} else {
											return cur;
										}
								}
							}(),
							currentRect: function () {
								var _v6 = model.tool;
								if (_v6.$ === 'Rectangle') {
									if (model.mouseDown) {
										var _v7 = _Utils_Tuple2(
											$author$project$Grid$rectOrigin(cur_r.shape),
											ml);
										_v7$2:
										while (true) {
											if (_v7.a.$ === 'Just') {
												if (_v7.b.$ === 'Just') {
													var o = _v7.a.a;
													var loc = _v7.b.a;
													return A2(
														$author$project$Main$newMS,
														A2(
															$author$project$Grid$rach_makeRectPts,
															o,
															toGrid(loc)),
														model.currentColor);
												} else {
													break _v7$2;
												}
											} else {
												if (_v7.b.$ === 'Just') {
													var _v8 = _v7.a;
													var loc = _v7.b.a;
													return A2(
														$author$project$Main$newMS,
														A3(
															$author$project$Grid$makeRectDims,
															toGrid(loc),
															0,
															0),
														model.currentColor);
												} else {
													break _v7$2;
												}
											}
										}
										return cur_r;
									} else {
										return cur_r;
									}
								} else {
									return cur_r;
								}
							}(),
							mouseLocation: coord
						}),
					$elm$core$Platform$Cmd$none);
			case 'SwitchState':
				return model.editState ? _Utils_Tuple2(
					_Utils_update(
						model,
						{editState: false}),
					$author$project$Main$sendEditState(false)) : _Utils_Tuple2(
					_Utils_update(
						model,
						{editState: true}),
					$author$project$Main$sendEditState(true));
			case 'Download':
				return _Utils_Tuple2(
					model,
					$author$project$Main$sendDownload(true));
			case 'MouseUpDown':
				var b = msg.a;
				var rect = _Utils_update(
					model,
					{
						currentRect: A2(
							$author$project$Main$newMS,
							$author$project$Grid$Polygon(_List_Nil),
							model.currentColor),
						ground: function () {
							var _v16 = model.erasing;
							if (!_v16) {
								return A2($author$project$Main$add_ground, model.currentRect, model.ground);
							} else {
								return A2($author$project$Main$remove_ground, model.currentRect, model.ground);
							}
						}(),
						mouseDown: b,
						undoStack: A2(
							$author$project$Stack$push,
							_Utils_Tuple2(model.ground, model.walls),
							model.undoStack)
					});
				var non_autofill = _Utils_update(
					model,
					{
						currentDrawing: A2(
							$author$project$Main$newMP,
							$author$project$Grid$Path(_List_Nil),
							model.currentColor),
						mouseDown: b,
						undoStack: A2(
							$author$project$Stack$push,
							_Utils_Tuple2(model.ground, model.walls),
							model.undoStack),
						walls: function () {
							var _v15 = model.erasing;
							if (!_v15) {
								return A2($author$project$Main$add_wall, model.currentDrawing, model.walls);
							} else {
								return A2($author$project$Main$remove_wall, model.currentDrawing, model.walls);
							}
						}()
					});
				var autofill = _Utils_update(
					model,
					{
						currentDrawing: A2(
							$author$project$Main$newMP,
							$author$project$Grid$Path(_List_Nil),
							model.currentColor),
						ground: function () {
							var _v14 = model.erasing;
							if (!_v14) {
								return A2(
									$author$project$Main$add_ground,
									A2(
										$author$project$Main$newMS,
										$author$project$Grid$pathToShape(model.currentDrawing.path),
										model.currentDrawing.color),
									model.ground);
							} else {
								return A2(
									$author$project$Main$remove_ground,
									A2(
										$author$project$Main$newMS,
										$author$project$Grid$pathToShape(model.currentDrawing.path),
										model.currentDrawing.color),
									model.ground);
							}
						}(),
						mouseDown: b,
						undoStack: A2(
							$author$project$Stack$push,
							_Utils_Tuple2(model.ground, model.walls),
							model.undoStack)
					});
				var _v10 = _Utils_Tuple2(model.tool, b);
				if (!_v10.b) {
					switch (_v10.a.$) {
						case 'LockedAutofill':
							var _v11 = _v10.a;
							return _Utils_Tuple2(
								_Utils_update(
									autofill,
									{
										heightSlider: A2(
											$author$project$Main$new_h_slider,
											$author$project$Main$max_y_ground(autofill.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(autofill.heightSlider)),
										widthSlider: A2(
											$author$project$Main$new_w_slider,
											$author$project$Main$max_x_ground(autofill.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(autofill.widthSlider))
									}),
								$elm$core$Platform$Cmd$none);
						case 'FreeformAutofill':
							var _v12 = _v10.a;
							return _Utils_Tuple2(
								_Utils_update(
									autofill,
									{
										heightSlider: A2(
											$author$project$Main$new_h_slider,
											$author$project$Main$max_y_ground(autofill.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(autofill.heightSlider)),
										widthSlider: A2(
											$author$project$Main$new_w_slider,
											$author$project$Main$max_x_ground(autofill.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(autofill.widthSlider))
									}),
								$elm$core$Platform$Cmd$none);
						case 'Rectangle':
							var _v13 = _v10.a;
							return _Utils_Tuple2(
								_Utils_update(
									rect,
									{
										heightSlider: A2(
											$author$project$Main$new_h_slider,
											$author$project$Main$max_y_ground(rect.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(rect.heightSlider)),
										widthSlider: A2(
											$author$project$Main$new_w_slider,
											$author$project$Main$max_x_ground(rect.ground),
											$carwow$elm_slider$SingleSlider$fetchValue(rect.widthSlider))
									}),
								$elm$core$Platform$Cmd$none);
						default:
							return _Utils_Tuple2(
								_Utils_update(
									non_autofill,
									{
										heightSlider: A2(
											$author$project$Main$new_h_slider,
											$author$project$Main$max_y_walls(non_autofill.walls),
											$carwow$elm_slider$SingleSlider$fetchValue(non_autofill.heightSlider)),
										widthSlider: A2(
											$author$project$Main$new_w_slider,
											$author$project$Main$max_x_walls(non_autofill.walls),
											$carwow$elm_slider$SingleSlider$fetchValue(non_autofill.widthSlider))
									}),
								$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{editState: true, mouseDown: b}),
						$elm$core$Platform$Cmd$none);
				}
			case 'SwitchTool':
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{editState: true, tool: t}),
					$elm$core$Platform$Cmd$none);
			case 'ClearBoard':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							editState: true,
							ground: _List_Nil,
							heightSlider: A2(
								$author$project$Main$new_h_slider,
								1,
								$carwow$elm_slider$SingleSlider$fetchValue(model.heightSlider)),
							redoStack: $author$project$Stack$empty(5),
							undoStack: $author$project$Stack$empty(5),
							walls: _List_Nil,
							widthSlider: A2(
								$author$project$Main$new_w_slider,
								1,
								$carwow$elm_slider$SingleSlider$fetchValue(model.widthSlider))
						}),
					$elm$core$Platform$Cmd$none);
			case 'Undo':
				var _v17 = $author$project$Stack$pop(model.undoStack);
				if (_v17.$ === 'Just') {
					var _v18 = _v17.a;
					var _v19 = _v18.a;
					var prev_g = _v19.a;
					var prev_w = _v19.b;
					var rest = _v18.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								editState: true,
								ground: prev_g,
								heightSlider: A2(
									$author$project$Main$new_h_slider,
									A2(
										$elm$core$Basics$max,
										$author$project$Main$max_y_ground(prev_g),
										$author$project$Main$max_y_walls(prev_w)),
									$carwow$elm_slider$SingleSlider$fetchValue(model.heightSlider)),
								redoStack: A2(
									$author$project$Stack$push,
									_Utils_Tuple2(model.ground, model.walls),
									model.redoStack),
								undoStack: rest,
								walls: prev_w,
								widthSlider: A2(
									$author$project$Main$new_w_slider,
									A2(
										$elm$core$Basics$max,
										$author$project$Main$max_x_ground(prev_g),
										$author$project$Main$max_x_walls(prev_w)),
									$carwow$elm_slider$SingleSlider$fetchValue(model.widthSlider))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'Redo':
				var _v20 = $author$project$Stack$pop(model.redoStack);
				if (_v20.$ === 'Just') {
					var _v21 = _v20.a;
					var _v22 = _v21.a;
					var redo_g = _v22.a;
					var redo_w = _v22.b;
					var rest = _v21.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								editState: true,
								ground: redo_g,
								heightSlider: A2(
									$author$project$Main$new_h_slider,
									A2(
										$elm$core$Basics$max,
										$author$project$Main$max_y_ground(redo_g),
										$author$project$Main$max_y_walls(redo_w)),
									$carwow$elm_slider$SingleSlider$fetchValue(model.heightSlider)),
								redoStack: rest,
								undoStack: A2(
									$author$project$Stack$push,
									_Utils_Tuple2(model.ground, model.walls),
									model.undoStack),
								walls: redo_w,
								widthSlider: A2(
									$author$project$Main$new_w_slider,
									A2(
										$elm$core$Basics$max,
										$author$project$Main$max_x_ground(redo_g),
										$author$project$Main$max_x_walls(redo_w)),
									$carwow$elm_slider$SingleSlider$fetchValue(model.widthSlider))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ToggleErasing':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							erasing: function () {
								var _v23 = model.erasing;
								if (_v23) {
									return false;
								} else {
									return true;
								}
							}()
						}),
					$elm$core$Platform$Cmd$none);
			case 'WidthSliderChange':
				var str = msg.a;
				var newSlider = A2($carwow$elm_slider$SingleSlider$update, str, model.widthSlider);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							editState: true,
							mapWidth: $elm$core$Basics$round(
								$carwow$elm_slider$SingleSlider$fetchValue(model.widthSlider)),
							widthSlider: newSlider
						}),
					$elm$core$Platform$Cmd$none);
			case 'HeightSliderChange':
				var str = msg.a;
				var newSlider = A2($carwow$elm_slider$SingleSlider$update, str, model.heightSlider);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							editState: true,
							heightSlider: newSlider,
							mapHeight: $elm$core$Basics$round(
								$carwow$elm_slider$SingleSlider$fetchValue(model.heightSlider))
						}),
					$elm$core$Platform$Cmd$none);
			case 'ColorPickerMsg':
				var message = msg.a;
				var _v24 = A3($simonh1000$elm_colorpicker$ColorPicker$update, message, model.currentColor, model.colorPicker);
				var m = _v24.a;
				var color = _v24.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							colorPicker: m,
							currentColor: A2($elm$core$Maybe$withDefault, model.currentColor, color)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleSwitch':
				var isToggled = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{erasing: isToggled}),
					$elm$core$Platform$Cmd$none);
			case 'RequestMapNames':
				return _Utils_Tuple2(
					model,
					$author$project$Main$requestMapNames(_Utils_Tuple0));
			case 'RequestMap':
				var name = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$requestMap(name));
			case 'RequestGallery':
				return _Utils_Tuple2(
					model,
					$author$project$Main$requestGallery(_Utils_Tuple0));
			case 'MapNames':
				var names = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'LoadMap':
				var map = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'LoadGallery':
				var maps = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{galleryMaps: maps}),
					$elm$core$Platform$Cmd$none);
			case 'UploadMap':
				var map = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$uploadMap(map));
			case 'LoadGalleryMap':
				var map = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ground: map.ground, mapName: map.name, walls: map.walls}),
					$elm$core$Platform$Cmd$none);
			default:
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{mapName: str}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$ClearBoard = {$: 'ClearBoard'};
var $author$project$Main$ColorPickerMsg = function (a) {
	return {$: 'ColorPickerMsg', a: a};
};
var $author$project$Main$Download = {$: 'Download'};
var $author$project$Main$MapName = function (a) {
	return {$: 'MapName', a: a};
};
var $author$project$Main$Redo = {$: 'Redo'};
var $author$project$Main$SwitchState = {$: 'SwitchState'};
var $author$project$Main$SwitchTool = function (a) {
	return {$: 'SwitchTool', a: a};
};
var $author$project$Main$ToggleSwitch = function (a) {
	return {$: 'ToggleSwitch', a: a};
};
var $author$project$Main$Undo = {$: 'Undo'};
var $author$project$Main$UploadMap = function (a) {
	return {$: 'UploadMap', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 'Attribute', a: a, b: b, c: c};
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$align = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('align');
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 'Node', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$aside = $rtfeldman$elm_css$Html$Styled$node('aside');
var $rtfeldman$elm_css$Css$Structure$Compatible = {$: 'Compatible'};
var $rtfeldman$elm_css$Css$auto = {alignItemsOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, cursor: $rtfeldman$elm_css$Css$Structure$Compatible, flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible, intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, justifyContentOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible, overflow: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible, textRendering: $rtfeldman$elm_css$Css$Structure$Compatible, touchAction: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'auto'};
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 'AppendProperty', a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.value);
	});
var $rtfeldman$elm_css$Css$bottom = $rtfeldman$elm_css$Css$prop1('bottom');
var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $rtfeldman$elm_css$VirtualDom$Styled$style = F2(
	function (key, val) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$style, key, val),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$style = $rtfeldman$elm_css$VirtualDom$Styled$style;
var $author$project$Main$button_attributes = _List_fromArray(
	[
		A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin', '0 auto'),
		A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'block'),
		A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-top', '15px')
	]);
var $rtfeldman$elm_css$Html$Styled$canvas = $rtfeldman$elm_css$Html$Styled$node('canvas');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$attribute, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$height = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var $rtfeldman$elm_css$Html$Styled$Attributes$width = function (n) {
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$canvas_attributes = function (m) {
	return _List_fromArray(
		[
			A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'padding-left', '0'),
			A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'padding-right', '0'),
			A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-left', 'auto'),
			A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-right', 'auto'),
			$rtfeldman$elm_css$Html$Styled$Attributes$width(
			$elm$core$Basics$round(
				$author$project$Main$scaleGridToCol_i(m.mapWidth + 2))),
			$rtfeldman$elm_css$Html$Styled$Attributes$height(
			$elm$core$Basics$round(
				$author$project$Main$scaleGridToCol_i(m.mapHeight + 2))),
			A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'border', '1px solid red'),
			$rtfeldman$elm_css$Html$Styled$Attributes$id('myCanvas')
		]);
};
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$Skinney$murmur3$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $timjs$elm_collage$Collage$Flat = {$: 'Flat'};
var $timjs$elm_collage$Collage$Sharp = {$: 'Sharp'};
var $timjs$elm_collage$Collage$thin = 2.0;
var $timjs$elm_collage$Collage$Core$Uniform = function (a) {
	return {$: 'Uniform', a: a};
};
var $timjs$elm_collage$Collage$uniform = $timjs$elm_collage$Collage$Core$Uniform;
var $timjs$elm_collage$Collage$defaultLineStyle = {
	cap: $timjs$elm_collage$Collage$Flat,
	dashPattern: _List_Nil,
	dashPhase: 0,
	fill: $timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$black),
	join: $timjs$elm_collage$Collage$Sharp,
	thickness: $timjs$elm_collage$Collage$thin
};
var $timjs$elm_collage$Collage$broken = F3(
	function (dashes, thickness, fill) {
		return _Utils_update(
			$timjs$elm_collage$Collage$defaultLineStyle,
			{dashPattern: dashes, fill: fill, thickness: thickness});
	});
var $timjs$elm_collage$Collage$solid = $timjs$elm_collage$Collage$broken(_List_Nil);
var $timjs$elm_collage$Collage$Core$Transparent = {$: 'Transparent'};
var $timjs$elm_collage$Collage$transparent = $timjs$elm_collage$Collage$Core$Transparent;
var $timjs$elm_collage$Collage$invisible = A2($timjs$elm_collage$Collage$solid, 0, $timjs$elm_collage$Collage$transparent);
var $timjs$elm_collage$Collage$Core$Shape = F2(
	function (a, b) {
		return {$: 'Shape', a: a, b: b};
	});
var $timjs$elm_collage$Collage$Core$collage = function (basic) {
	return {
		basic: basic,
		handlers: _List_Nil,
		name: $elm$core$Maybe$Nothing,
		opacity: 1,
		rotation: 0,
		scale: _Utils_Tuple2(1, 1),
		shift: _Utils_Tuple2(0, 0)
	};
};
var $timjs$elm_collage$Collage$styled = function (style) {
	return A2(
		$elm$core$Basics$composeL,
		$timjs$elm_collage$Collage$Core$collage,
		$timjs$elm_collage$Collage$Core$Shape(style));
};
var $timjs$elm_collage$Collage$filled = function (fill) {
	return $timjs$elm_collage$Collage$styled(
		_Utils_Tuple2(fill, $timjs$elm_collage$Collage$invisible));
};
var $avh4$elm_color$Color$lightGrey = A4($avh4$elm_color$Color$RgbaSpace, 238 / 255, 238 / 255, 236 / 255, 1.0);
var $timjs$elm_collage$Collage$Core$Rectangle = F3(
	function (a, b, c) {
		return {$: 'Rectangle', a: a, b: b, c: c};
	});
var $timjs$elm_collage$Collage$roundedRectangle = $timjs$elm_collage$Collage$Core$Rectangle;
var $timjs$elm_collage$Collage$rectangle = F2(
	function (w, h) {
		return A3($timjs$elm_collage$Collage$roundedRectangle, w, h, 0);
	});
var $timjs$elm_collage$Collage$shift = F2(
	function (_v0, collage) {
		var dx = _v0.a;
		var dy = _v0.b;
		var _v1 = collage.shift;
		var x = _v1.a;
		var y = _v1.b;
		return _Utils_update(
			collage,
			{
				shift: _Utils_Tuple2(x + dx, y + dy)
			});
	});
var $author$project$Main$draw_bg = function (model) {
	var width = $author$project$Main$scaleGridToCol_i(model.mapWidth + 2);
	var height = $author$project$Main$scaleGridToCol_i(model.mapHeight + 2);
	var green = A4($avh4$elm_color$Color$rgba, 0.16, 0.49, 0.02, 0.5);
	return A2(
		$timjs$elm_collage$Collage$shift,
		_Utils_Tuple2(
			(width / 2) - $author$project$Main$scaleGridToCol(1),
			(height / 2) - $author$project$Main$scaleGridToCol(1)),
		A2(
			$timjs$elm_collage$Collage$filled,
			$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$lightGrey),
			A2($timjs$elm_collage$Collage$rectangle, width, height)));
};
var $timjs$elm_collage$Collage$Core$Group = function (a) {
	return {$: 'Group', a: a};
};
var $timjs$elm_collage$Collage$group = A2($elm$core$Basics$composeL, $timjs$elm_collage$Collage$Core$collage, $timjs$elm_collage$Collage$Core$Group);
var $timjs$elm_collage$Collage$Core$Polyline = function (a) {
	return {$: 'Polyline', a: a};
};
var $timjs$elm_collage$Collage$path = $timjs$elm_collage$Collage$Core$Polyline;
var $timjs$elm_collage$Collage$segment = F2(
	function (a, b) {
		return $timjs$elm_collage$Collage$path(
			_List_fromArray(
				[a, b]));
	});
var $timjs$elm_collage$Collage$Core$Path = F2(
	function (a, b) {
		return {$: 'Path', a: a, b: b};
	});
var $timjs$elm_collage$Collage$traced = F2(
	function (linestyle, p) {
		return $timjs$elm_collage$Collage$Core$collage(
			A2($timjs$elm_collage$Collage$Core$Path, linestyle, p));
	});
var $author$project$Main$draw_grid = function (model) {
	var scale = $author$project$Main$scaleGridToCol_i;
	var grid_style = $timjs$elm_collage$Collage$traced(
		A2(
			$timjs$elm_collage$Collage$solid,
			$timjs$elm_collage$Collage$thin,
			$timjs$elm_collage$Collage$uniform(
				A4($avh4$elm_color$Color$rgba, 0, 0, 0, 0.1))));
	var h_grid_lines = A2(
		$elm$core$List$map,
		grid_style,
		A2(
			$elm$core$List$map,
			function (y) {
				return A2(
					$timjs$elm_collage$Collage$segment,
					_Utils_Tuple2(
						0,
						scale(y)),
					_Utils_Tuple2(
						scale(model.mapWidth),
						scale(y)));
			},
			A2($elm$core$List$range, 0, model.mapHeight)));
	var v_grid_lines = A2(
		$elm$core$List$map,
		grid_style,
		A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$timjs$elm_collage$Collage$segment,
					_Utils_Tuple2(
						scale(x),
						0),
					_Utils_Tuple2(
						scale(x),
						scale(model.mapHeight)));
			},
			A2($elm$core$List$range, 0, model.mapWidth)));
	return $timjs$elm_collage$Collage$group(
		_Utils_ap(h_grid_lines, v_grid_lines));
};
var $author$project$Grid$mapSame = function (f) {
	return A2($elm$core$Tuple$mapBoth, f, f);
};
var $author$project$Main$gridToCol = $author$project$Grid$mapSame($author$project$Main$scaleGridToCol);
var $author$project$Grid$flatten = function (shape) {
	if (shape.$ === 'Polygon') {
		var poly = shape.a;
		return poly;
	} else {
		var outline = shape.a;
		var holes = shape.b;
		var make_loop = function (list) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				return _Utils_ap(
					list,
					_List_fromArray(
						[x]));
			}
		};
		var corrected_holes = A2(
			$elm$core$List$map,
			make_loop,
			A2(
				$elm$core$List$map,
				A3(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $author$project$Grid$set_direction, $author$project$Grid$opposite_dir),
					$author$project$Grid$direction,
					outline),
				holes));
		if (!outline.b) {
			return _List_Nil;
		} else {
			var v = outline.a;
			var vs = outline.b;
			return _Utils_ap(
				outline,
				_Utils_ap(
					A2(
						$elm$core$List$concatMap,
						$elm$core$List$cons(v),
						corrected_holes),
					_List_fromArray(
						[v])));
		}
	}
};
var $timjs$elm_collage$Collage$Core$Polygon = function (a) {
	return {$: 'Polygon', a: a};
};
var $timjs$elm_collage$Collage$polygon = $timjs$elm_collage$Collage$Core$Polygon;
var $timjs$elm_collage$Collage$thick = 4.0;
var $author$project$Main$shape_to_collage = F3(
	function (grid_to_collage, fill, ms) {
		var style_fill = $timjs$elm_collage$Collage$filled(fill);
		var shape = ms.shape;
		var scale_and_convert = A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map(grid_to_collage),
			$timjs$elm_collage$Collage$polygon);
		var col = ms.color;
		var line = A2(
			$timjs$elm_collage$Collage$solid,
			$timjs$elm_collage$Collage$thick,
			$timjs$elm_collage$Collage$uniform(col));
		var style_both = $timjs$elm_collage$Collage$styled(
			_Utils_Tuple2(fill, line));
		var style_outline = $timjs$elm_collage$Collage$styled(
			_Utils_Tuple2($timjs$elm_collage$Collage$transparent, line));
		if (shape.$ === 'Polygon') {
			var ps = shape.a;
			return style_both(
				scale_and_convert(ps));
		} else {
			var outline = shape.a;
			var holes = shape.b;
			var outlines = A2(
				$elm$core$List$map,
				A2($elm$core$Basics$composeL, style_outline, scale_and_convert),
				A2($elm$core$List$cons, outline, holes));
			var inside = A3(
				$elm$core$Basics$composeL,
				style_fill,
				scale_and_convert,
				$author$project$Grid$flatten(shape));
			return $timjs$elm_collage$Collage$group(
				_Utils_ap(
					outlines,
					_List_fromArray(
						[inside])));
		}
	});
var $author$project$Main$draw_ground = function (model) {
	var line_style = A2(
		$timjs$elm_collage$Collage$solid,
		$timjs$elm_collage$Collage$thick,
		$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$black));
	var fill_style = $timjs$elm_collage$Collage$uniform(
		A4($avh4$elm_color$Color$rgba, 1, 1, 1, 0.8));
	return $timjs$elm_collage$Collage$group(
		A2(
			$elm$core$List$cons,
			A3($author$project$Main$shape_to_collage, $author$project$Main$gridToCol, fill_style, model.currentRect),
			A2(
				$elm$core$List$map,
				A2($author$project$Main$shape_to_collage, $author$project$Main$gridToCol, fill_style),
				model.ground)));
};
var $timjs$elm_collage$Collage$Core$Circle = function (a) {
	return {$: 'Circle', a: a};
};
var $timjs$elm_collage$Collage$circle = $timjs$elm_collage$Collage$Core$Circle;
var $author$project$Main$draw_mouse = function (model) {
	var _v0 = model.mouseLocation;
	if (_v0.$ === 'Nothing') {
		return A2(
			$timjs$elm_collage$Collage$filled,
			$timjs$elm_collage$Collage$transparent,
			$timjs$elm_collage$Collage$circle(0));
	} else {
		var loc = _v0.a;
		return A2(
			$timjs$elm_collage$Collage$shift,
			A2($author$project$Main$jsToCol, model, loc),
			A2(
				$timjs$elm_collage$Collage$filled,
				$timjs$elm_collage$Collage$uniform(
					A4($avh4$elm_color$Color$rgba, 255, 0, 0, 0.6)),
				$timjs$elm_collage$Collage$circle(10)));
	}
};
var $avh4$elm_color$Color$darkBrown = A4($avh4$elm_color$Color$RgbaSpace, 143 / 255, 89 / 255, 2 / 255, 1.0);
var $avh4$elm_color$Color$darkGreen = A4($avh4$elm_color$Color$RgbaSpace, 78 / 255, 154 / 255, 6 / 255, 1.0);
var $timjs$elm_collage$Collage$dot = function (thickness) {
	var d = $elm$core$Basics$round(thickness);
	return A2(
		$timjs$elm_collage$Collage$broken,
		_List_fromArray(
			[
				_Utils_Tuple2(d, d)
			]),
		thickness);
};
var $author$project$Main$path_to_collage = F2(
	function (grid_to_collage, mp) {
		var path = mp.path;
		var col = mp.color;
		var line = _Utils_eq(col, $avh4$elm_color$Color$lightGray) ? A2(
			$timjs$elm_collage$Collage$solid,
			20,
			$timjs$elm_collage$Collage$uniform(col)) : A2(
			$timjs$elm_collage$Collage$solid,
			$timjs$elm_collage$Collage$thick,
			$timjs$elm_collage$Collage$uniform(col));
		var p = path.a;
		return A2(
			$timjs$elm_collage$Collage$traced,
			line,
			$timjs$elm_collage$Collage$path(
				A2($elm$core$List$map, grid_to_collage, p)));
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $timjs$elm_collage$Collage$verythick = 6.0;
var $author$project$Main$draw_paths = function (model) {
	var style = A2(
		$timjs$elm_collage$Collage$solid,
		$timjs$elm_collage$Collage$verythick,
		$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$darkBrown));
	var line_style = A2(
		$timjs$elm_collage$Collage$solid,
		$timjs$elm_collage$Collage$thick,
		$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$black));
	var ugh = _Utils_update(
		line_style,
		{thickness: 80});
	var hedge = A2(
		$timjs$elm_collage$Collage$dot,
		5,
		$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$darkGreen));
	var dotstyle = A3(
		$timjs$elm_collage$Collage$broken,
		_List_fromArray(
			[
				_Utils_Tuple2(5, 2),
				_Utils_Tuple2(15, 2)
			]),
		5,
		$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$darkBrown));
	var col = A3($avh4$elm_color$Color$rgb255, 135, 130, 124);
	var testlineStyle = function (t) {
		return A3(
			$timjs$elm_collage$Collage$broken,
			_List_fromArray(
				[
					_Utils_Tuple2(5 * t, t),
					_Utils_Tuple2(9 * t, t),
					_Utils_Tuple2(4 * t, t),
					_Utils_Tuple2(6 * t, t)
				]),
			t * 2.2,
			$timjs$elm_collage$Collage$uniform(col));
	};
	return $timjs$elm_collage$Collage$group(
		A2(
			$elm$core$List$cons,
			A2($author$project$Main$path_to_collage, $author$project$Main$gridToCol, model.currentDrawing),
			A2(
				$elm$core$List$map,
				$author$project$Main$path_to_collage($author$project$Main$gridToCol),
				model.walls)));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Grid$Json$encodePoint = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				$elm$json$Json$Encode$float(x)),
				_Utils_Tuple2(
				'y',
				$elm$json$Json$Encode$float(y))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Grid$Json$encodePath = function (path) {
	var ps = path.a;
	return A2($elm$json$Json$Encode$list, $author$project$Grid$Json$encodePoint, ps);
};
var $author$project$Grid$Json$encodePolygon = $elm$json$Json$Encode$list($author$project$Grid$Json$encodePoint);
var $author$project$Grid$Json$encodeShape = function (shape) {
	if (shape.$ === 'Polygon') {
		var poly = shape.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'outline',
					$author$project$Grid$Json$encodePolygon(poly))
				]));
	} else {
		var outline = shape.a;
		var holes = shape.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'outline',
					$author$project$Grid$Json$encodePolygon(outline)),
					_Utils_Tuple2(
					'holes',
					A2($elm$json$Json$Encode$list, $author$project$Grid$Json$encodePolygon, holes))
				]));
	}
};
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $author$project$Main$encode_color = function (c) {
	var _v0 = $avh4$elm_color$Color$toRgba(c);
	var red = _v0.red;
	var green = _v0.green;
	var blue = _v0.blue;
	var alpha = _v0.alpha;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'red',
				$elm$json$Json$Encode$float(red)),
				_Utils_Tuple2(
				'green',
				$elm$json$Json$Encode$float(green)),
				_Utils_Tuple2(
				'blue',
				$elm$json$Json$Encode$float(blue)),
				_Utils_Tuple2(
				'alpha',
				$elm$json$Json$Encode$float(alpha))
			]));
};
var $author$project$Main$encode_model = function (model) {
	var encode_walls = function (map_obj) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'path',
					$author$project$Grid$Json$encodePath(map_obj.path)),
					_Utils_Tuple2(
					'color',
					$author$project$Main$encode_color(map_obj.color))
				]));
	};
	var walls = A2($elm$json$Json$Encode$list, encode_walls, model.walls);
	var encode_ground = function (map_obj) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'shape',
					$author$project$Grid$Json$encodeShape(map_obj.shape)),
					_Utils_Tuple2(
					'color',
					$author$project$Main$encode_color(map_obj.color))
				]));
	};
	var ground = A2($elm$json$Json$Encode$list, encode_ground, model.ground);
	var map = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2('ground', ground),
				_Utils_Tuple2('walls', walls)
			]));
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(model.mapName)),
				_Utils_Tuple2('map', map)
			]));
};
var $rtfeldman$elm_css$Css$flex = $rtfeldman$elm_css$Css$prop1('flex');
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = $rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var $rtfeldman$elm_css$Html$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $rtfeldman$elm_css$Svg$Styled$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var $rtfeldman$elm_css$Css$Global$global = function (snippets) {
	return $rtfeldman$elm_css$VirtualDom$Styled$unstyledNode(
		A3(
			$elm$virtual_dom$VirtualDom$node,
			'style',
			_List_Nil,
			$elm$core$List$singleton(
				$elm$virtual_dom$VirtualDom$text(
					$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
						$elm$core$List$singleton(
							$rtfeldman$elm_css$Css$Preprocess$stylesheet(snippets)))))));
};
var $rtfeldman$elm_css$Html$Styled$h3 = $rtfeldman$elm_css$Html$Styled$node('h3');
var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
var $rtfeldman$elm_css$Css$UnitlessInteger = {$: 'UnitlessInteger'};
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
		intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessInteger,
		value: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 'KeyedNode', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 'KeyedNodeNS', a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 'NodeNS', a: a, b: b, c: c, d: d};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _v0) {
		var prop = _v0.a;
		var styles = _v0.b;
		var classname = _v0.c;
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 'Node':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$Node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'NodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'KeyedNode':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var key = _v1.a;
							var child = _v1.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 'KeyedNodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var key = _v2.a;
							var child = _v2.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
					A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var $rtfeldman$elm_css$Html$Styled$map = $rtfeldman$elm_css$VirtualDom$Styled$map;
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 'ApplyStyles', a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 'AppendProperty':
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 'ExtendSelector':
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 'NestSnippet':
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 'WithPseudoElement':
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 'WithMedia':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 'WithKeyframes':
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = {$: 'IncompatibleUnits'};
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			absoluteLength: $rtfeldman$elm_css$Css$Structure$Compatible,
			calc: $rtfeldman$elm_css$Css$Structure$Compatible,
			flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
			fontSize: $rtfeldman$elm_css$Css$Structure$Compatible,
			length: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
			numericValue: numericValue,
			textIndent: $rtfeldman$elm_css$Css$Structure$Compatible,
			unitLabel: unitLabel,
			units: units,
			value: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$Internal$IncompatibleUnits, '', 0);
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
var $rtfeldman$elm_css$Css$flexBasis = $rtfeldman$elm_css$Css$prop1('flex-basis');
var $rtfeldman$elm_css$Css$flexWrap = $rtfeldman$elm_css$Css$prop1('flex-wrap');
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Main$LoadGalleryMap = function (a) {
	return {$: 'LoadGalleryMap', a: a};
};
var $rtfeldman$elm_css$Css$absolute = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'absolute'};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.value);
};
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var $rtfeldman$elm_css$Css$color = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'color', c.value);
};
var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2(
		$elm$core$String$cons,
		_Utils_chr('#'),
		str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		alpha: 1,
		blue: 0,
		color: $rtfeldman$elm_css$Css$Structure$Compatible,
		green: 0,
		red: 0,
		value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$toLower = _String_toLower;
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((results.a.a.$ === 'Ok') && (results.a.b.$ === 'Ok')) && (results.b.a.$ === 'Ok')) && (results.b.b.$ === 'Ok')) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				alpha: alpha / 255,
				blue: blue,
				color: $rtfeldman$elm_css$Css$Structure$Compatible,
				green: green,
				red: red,
				value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2(
						_Utils_chr('f'),
						_Utils_chr('f')));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2(
									_Utils_chr('f'),
									_Utils_chr('f')));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $rtfeldman$elm_css$Css$hidden = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, overflow: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'hidden', visibility: $rtfeldman$elm_css$Css$Structure$Compatible};
var $rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(
	function (a, b) {
		return {$: 'ExtendSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function (a) {
	return {$: 'PseudoClassSelector', a: a};
};
var $rtfeldman$elm_css$Css$pseudoClass = function (_class) {
	return $rtfeldman$elm_css$Css$Preprocess$ExtendSelector(
		$rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
};
var $rtfeldman$elm_css$Css$hover = $rtfeldman$elm_css$Css$pseudoClass('hover');
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $rtfeldman$elm_css$Css$UnitlessFloat = {$: 'UnitlessFloat'};
var $rtfeldman$elm_css$Css$num = function (val) {
	return {
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessFloat,
		value: $elm$core$String$fromFloat(val)
	};
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
var $rtfeldman$elm_css$Css$pointer = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'pointer'};
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $rtfeldman$elm_css$Css$PxUnits = {$: 'PxUnits'};
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PxUnits, 'px');
var $rtfeldman$elm_css$Css$relative = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'relative'};
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $timjs$elm_collage$Collage$Render$decodeCap = function (cap) {
	switch (cap.$) {
		case 'Round':
			return 'round';
		case 'Padded':
			return 'square';
		default:
			return 'butt';
	}
};
var $timjs$elm_collage$Collage$Render$decodeDashing = function (ds) {
	var decodeOnOff = function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$core$String$join,
			',',
			_List_fromArray(
				[
					$elm$core$String$fromInt(x),
					$elm$core$String$fromInt(y)
				]));
	};
	return A2(
		$elm$core$String$join,
		' ',
		A2($elm$core$List$map, decodeOnOff, ds));
};
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $timjs$elm_collage$Collage$Render$decodeColor = function (c) {
	var _v0 = $avh4$elm_color$Color$toRgba(c);
	var red = _v0.red;
	var green = _v0.green;
	var blue = _v0.blue;
	return $avh4$elm_color$Color$toCssString(
		A3($avh4$elm_color$Color$rgb, red, green, blue));
};
var $timjs$elm_collage$Collage$Render$decodeFill = function (fs) {
	if (fs.$ === 'Uniform') {
		var c = fs.a;
		return $timjs$elm_collage$Collage$Render$decodeColor(c);
	} else {
		return 'none';
	}
};
var $timjs$elm_collage$Collage$Render$decodeOpacity = function (c) {
	var _v0 = $avh4$elm_color$Color$toRgba(c);
	var alpha = _v0.alpha;
	return $elm$core$String$fromFloat(alpha);
};
var $timjs$elm_collage$Collage$Render$decodeFillOpacity = function (fs) {
	if (fs.$ === 'Uniform') {
		var c = fs.a;
		return $timjs$elm_collage$Collage$Render$decodeOpacity(c);
	} else {
		return '0';
	}
};
var $timjs$elm_collage$Collage$Render$decodeJoin = function (join) {
	switch (join.$) {
		case 'Smooth':
			return 'round';
		case 'Sharp':
			return 'miter';
		default:
			return 'bevel';
	}
};
var $elm$core$Basics$pi = _Basics_pi;
var $timjs$elm_collage$Collage$Render$decodeTransform = function (collage) {
	var sy = $elm$core$String$fromFloat(collage.scale.b);
	var sx = $elm$core$String$fromFloat(collage.scale.a);
	var r = $elm$core$String$fromFloat((((-collage.rotation) / 2) / $elm$core$Basics$pi) * 360);
	var dy = $elm$core$String$fromFloat(-collage.shift.b);
	var dx = $elm$core$String$fromFloat(collage.shift.a);
	return $elm$core$String$concat(
		_List_fromArray(
			['translate(', dx, ',', dy, ') scale(', sx, ',', sy, ') rotate(', r, ')']));
};
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$Attributes$fontStyle = _VirtualDom_attribute('font-style');
var $elm$svg$Svg$Attributes$fontVariant = _VirtualDom_attribute('font-variant');
var $elm$svg$Svg$Attributes$fontWeight = _VirtualDom_attribute('font-weight');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $elm$svg$Svg$Attributes$strokeDashoffset = _VirtualDom_attribute('stroke-dashoffset');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeOpacity = _VirtualDom_attribute('stroke-opacity');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$Attributes$textDecoration = _VirtualDom_attribute('text-decoration');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $timjs$elm_collage$Collage$Render$attrs = function (collage) {
	var _v0 = collage.basic;
	switch (_v0.$) {
		case 'Path':
			var line = _v0.a;
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$timjs$elm_collage$Collage$Render$decodeFill(line.fill)),
					$elm$svg$Svg$Attributes$strokeOpacity(
					$timjs$elm_collage$Collage$Render$decodeFillOpacity(line.fill)),
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(line.thickness)),
					$elm$svg$Svg$Attributes$strokeLinecap(
					$timjs$elm_collage$Collage$Render$decodeCap(line.cap)),
					$elm$svg$Svg$Attributes$strokeLinejoin(
					$timjs$elm_collage$Collage$Render$decodeJoin(line.join)),
					$elm$svg$Svg$Attributes$fill('none'),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromFloat(collage.opacity)),
					$elm$svg$Svg$Attributes$transform(
					$timjs$elm_collage$Collage$Render$decodeTransform(collage)),
					$elm$svg$Svg$Attributes$strokeDashoffset(
					$elm$core$String$fromInt(line.dashPhase)),
					$elm$svg$Svg$Attributes$strokeDasharray(
					$timjs$elm_collage$Collage$Render$decodeDashing(line.dashPattern))
				]);
		case 'Shape':
			var _v1 = _v0.a;
			var fill = _v1.a;
			var line = _v1.b;
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(
					$timjs$elm_collage$Collage$Render$decodeFill(fill)),
					$elm$svg$Svg$Attributes$fillOpacity(
					$timjs$elm_collage$Collage$Render$decodeFillOpacity(fill)),
					$elm$svg$Svg$Attributes$stroke(
					$timjs$elm_collage$Collage$Render$decodeFill(line.fill)),
					$elm$svg$Svg$Attributes$strokeOpacity(
					$timjs$elm_collage$Collage$Render$decodeFillOpacity(line.fill)),
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(line.thickness)),
					$elm$svg$Svg$Attributes$strokeLinecap(
					$timjs$elm_collage$Collage$Render$decodeCap(line.cap)),
					$elm$svg$Svg$Attributes$strokeLinejoin(
					$timjs$elm_collage$Collage$Render$decodeJoin(line.join)),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromFloat(collage.opacity)),
					$elm$svg$Svg$Attributes$transform(
					$timjs$elm_collage$Collage$Render$decodeTransform(collage)),
					$elm$svg$Svg$Attributes$strokeDashoffset(
					$elm$core$String$fromInt(line.dashPhase)),
					$elm$svg$Svg$Attributes$strokeDasharray(
					$timjs$elm_collage$Collage$Render$decodeDashing(line.dashPattern))
				]);
		case 'Text':
			var _v2 = _v0.b;
			var style = _v2.a;
			var str = _v2.b;
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(
					$timjs$elm_collage$Collage$Render$decodeFill(
						$timjs$elm_collage$Collage$Core$Uniform(style.color))),
					$elm$svg$Svg$Attributes$fontFamily(
					function () {
						var _v3 = style.typeface;
						switch (_v3.$) {
							case 'Serif':
								return 'serif';
							case 'Sansserif':
								return 'sans-serif';
							case 'Monospace':
								return 'monospace';
							default:
								var name = _v3.a;
								return name;
						}
					}()),
					$elm$svg$Svg$Attributes$fontSize(
					$elm$core$String$fromInt(style.size)),
					$elm$svg$Svg$Attributes$fontWeight(
					function () {
						var _v4 = style.weight;
						switch (_v4.$) {
							case 'Thin':
								return '200';
							case 'Light':
								return '300';
							case 'Regular':
								return 'normal';
							case 'Medium':
								return '500';
							case 'SemiBold':
								return '600';
							case 'Bold':
								return 'bold';
							default:
								return '800';
						}
					}()),
					$elm$svg$Svg$Attributes$fontStyle(
					function () {
						var _v5 = style.shape;
						switch (_v5.$) {
							case 'Upright':
								return 'normal';
							case 'SmallCaps':
								return 'normal';
							case 'Slanted':
								return 'oblique';
							default:
								return 'italic';
						}
					}()),
					$elm$svg$Svg$Attributes$fontVariant(
					function () {
						var _v6 = style.shape;
						if (_v6.$ === 'SmallCaps') {
							return 'small-caps';
						} else {
							return 'normal';
						}
					}()),
					$elm$svg$Svg$Attributes$textDecoration(
					function () {
						var _v7 = style.line;
						switch (_v7.$) {
							case 'None':
								return 'none';
							case 'Under':
								return 'underline';
							case 'Over':
								return 'overline';
							default:
								return 'line-through';
						}
					}()),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$dominantBaseline('middle'),
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromFloat(collage.opacity)),
					$elm$svg$Svg$Attributes$transform(
					$timjs$elm_collage$Collage$Render$decodeTransform(collage))
				]);
		default:
			return _List_fromArray(
				[
					$elm$svg$Svg$Attributes$opacity(
					$elm$core$String$fromFloat(collage.opacity)),
					$elm$svg$Svg$Attributes$transform(
					$timjs$elm_collage$Collage$Render$decodeTransform(collage))
				]);
	}
};
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $timjs$elm_collage$Collage$Render$box = F2(
	function (w, h) {
		return _List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(w)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h)),
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat((-w) / 2)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat((-h) / 2))
			]);
	});
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $timjs$elm_collage$Collage$Render$decodePoints = function (ps) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var x = _v0.a;
				var y = _v0.b;
				return A2(
					$elm$core$String$join,
					',',
					_List_fromArray(
						[
							$elm$core$String$fromFloat(x),
							$elm$core$String$fromFloat(-y)
						]));
			},
			ps));
};
var $elm$svg$Svg$ellipse = $elm$svg$Svg$trustedNode('ellipse');
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$svg$Svg$Events$on = $elm$html$Html$Events$on;
var $elm_community$basics_extra$Basics$Extra$uncurry = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		return A2(f, a, b);
	});
var $timjs$elm_collage$Collage$Render$events = function (handlers) {
	return A2(
		$elm$core$List$map,
		$elm_community$basics_extra$Basics$Extra$uncurry($elm$svg$Svg$Events$on),
		handlers);
};
var $elm$svg$Svg$foreignObject = $elm$svg$Svg$trustedNode('foreignObject');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $timjs$elm_collage$Collage$Render$render = function (collage) {
	render:
	while (true) {
		var name = A2($elm$core$Maybe$withDefault, '_unnamed_', collage.name);
		var _v0 = collage.basic;
		switch (_v0.$) {
			case 'Path':
				var style = _v0.a;
				var path = _v0.b;
				var ps = path.a;
				return A2(
					$elm$svg$Svg$polyline,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id(name),
								$elm$svg$Svg$Attributes$points(
								$timjs$elm_collage$Collage$Render$decodePoints(ps))
							]),
						_Utils_ap(
							$timjs$elm_collage$Collage$Render$attrs(collage),
							$timjs$elm_collage$Collage$Render$events(collage.handlers))),
					_List_Nil);
			case 'Shape':
				var _v2 = _v0.a;
				var fill = _v2.a;
				var line = _v2.b;
				var shape = _v0.b;
				switch (shape.$) {
					case 'Polygon':
						var ps = shape.a;
						return A2(
							$elm$svg$Svg$polygon,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id(name),
										$elm$svg$Svg$Attributes$points(
										$timjs$elm_collage$Collage$Render$decodePoints(ps))
									]),
								_Utils_ap(
									$timjs$elm_collage$Collage$Render$attrs(collage),
									$timjs$elm_collage$Collage$Render$events(collage.handlers))),
							_List_Nil);
					case 'Circle':
						var r = shape.a;
						return A2(
							$elm$svg$Svg$circle,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id(name),
										$elm$svg$Svg$Attributes$r(
										$elm$core$String$fromFloat(r))
									]),
								_Utils_ap(
									$timjs$elm_collage$Collage$Render$attrs(collage),
									$timjs$elm_collage$Collage$Render$events(collage.handlers))),
							_List_Nil);
					case 'Ellipse':
						var rx = shape.a;
						var ry = shape.b;
						return A2(
							$elm$svg$Svg$ellipse,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id(name),
										$elm$svg$Svg$Attributes$rx(
										$elm$core$String$fromFloat(rx)),
										$elm$svg$Svg$Attributes$ry(
										$elm$core$String$fromFloat(ry))
									]),
								_Utils_ap(
									$timjs$elm_collage$Collage$Render$attrs(collage),
									$timjs$elm_collage$Collage$Render$events(collage.handlers))),
							_List_Nil);
					case 'Rectangle':
						var w = shape.a;
						var h = shape.b;
						var r = shape.c;
						return A2(
							$elm$svg$Svg$rect,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$id(name),
										$elm$svg$Svg$Attributes$rx(
										$elm$core$String$fromFloat(r)),
										$elm$svg$Svg$Attributes$ry(
										$elm$core$String$fromFloat(r))
									]),
								_Utils_ap(
									A2($timjs$elm_collage$Collage$Render$box, w, h),
									_Utils_ap(
										$timjs$elm_collage$Collage$Render$attrs(collage),
										$timjs$elm_collage$Collage$Render$events(collage.handlers)))),
							_List_Nil);
					default:
						var path = shape.a;
						var $temp$collage = _Utils_update(
							collage,
							{
								basic: A2($timjs$elm_collage$Collage$Core$Path, line, path)
							});
						collage = $temp$collage;
						continue render;
				}
			case 'Text':
				var _v4 = _v0.b;
				var style = _v4.a;
				var str = _v4.b;
				return A2(
					$elm$svg$Svg$text_,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id(name)
							]),
						_Utils_ap(
							$timjs$elm_collage$Collage$Render$attrs(collage),
							$timjs$elm_collage$Collage$Render$events(collage.handlers))),
					_List_fromArray(
						[
							$elm$svg$Svg$text(str)
						]));
			case 'Image':
				var _v5 = _v0.a;
				var w = _v5.a;
				var h = _v5.b;
				var url = _v0.b;
				return A2(
					$elm$svg$Svg$image,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id(name),
								$elm$svg$Svg$Attributes$xlinkHref(url)
							]),
						_Utils_ap(
							A2($timjs$elm_collage$Collage$Render$box, w, h),
							_Utils_ap(
								$timjs$elm_collage$Collage$Render$attrs(collage),
								$timjs$elm_collage$Collage$Render$events(collage.handlers)))),
					_List_Nil);
			case 'Html':
				var _v6 = _v0.a;
				var w = _v6.a;
				var h = _v6.b;
				var html = _v0.b;
				return A2(
					$elm$svg$Svg$foreignObject,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id(name)
							]),
						_Utils_ap(
							A2($timjs$elm_collage$Collage$Render$box, w, h),
							_Utils_ap(
								$timjs$elm_collage$Collage$Render$attrs(collage),
								$timjs$elm_collage$Collage$Render$events(collage.handlers)))),
					_List_fromArray(
						[html]));
			case 'Group':
				var collages = _v0.a;
				return A2(
					$elm$svg$Svg$g,
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$id(name),
						_Utils_ap(
							$timjs$elm_collage$Collage$Render$attrs(collage),
							$timjs$elm_collage$Collage$Render$events(collage.handlers))),
					A3(
						$elm$core$List$foldl,
						F2(
							function (col, res) {
								return A2(
									$elm$core$List$cons,
									$timjs$elm_collage$Collage$Render$render(col),
									res);
							}),
						_List_Nil,
						collages));
			default:
				var fore = _v0.a;
				var back = _v0.b;
				var $temp$collage = _Utils_update(
					collage,
					{
						basic: $timjs$elm_collage$Collage$Core$Group(
							_List_fromArray(
								[fore, back]))
					});
				collage = $temp$collage;
				continue render;
		}
	}
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$version = _VirtualDom_attribute('version');
var $timjs$elm_collage$Collage$Render$svgAbsolute = F2(
	function (_v0, collage) {
		var width = _v0.a;
		var height = _v0.b;
		var w = $elm$core$String$fromFloat(width);
		var h = $elm$core$String$fromFloat(height);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(w),
							$elm$svg$Svg$Attributes$height(h),
							$elm$svg$Svg$Attributes$version('1.1')
						]),
					_List_fromArray(
						[
							$timjs$elm_collage$Collage$Render$render(collage)
						]))
				]));
	});
var $timjs$elm_collage$Collage$Render$svgBox = F2(
	function (_v0, collage) {
		var width = _v0.a;
		var height = _v0.b;
		return A2(
			$timjs$elm_collage$Collage$Render$svgAbsolute,
			_Utils_Tuple2(width, height),
			A2(
				$timjs$elm_collage$Collage$shift,
				_Utils_Tuple2(width / 2, (-height) / 2),
				collage));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $rtfeldman$elm_css$Css$visibility = $rtfeldman$elm_css$Css$prop1('visibility');
var $author$project$Main$make_thumbnail = F2(
	function (thumbnail_size, map) {
		var shift_size = thumbnail_size / 2;
		var line_style = A2(
			$timjs$elm_collage$Collage$solid,
			$timjs$elm_collage$Collage$thick,
			$timjs$elm_collage$Collage$uniform($avh4$elm_color$Color$black));
		var fill_style = $timjs$elm_collage$Collage$uniform(
			A4($avh4$elm_color$Color$rgba, 1, 1, 1, 0.5));
		var convert_walls = $author$project$Main$path_to_collage(
			$author$project$Grid$mapSame(
				$elm$core$Basics$mul(8)));
		var convert_ground = A2(
			$author$project$Main$shape_to_collage,
			$author$project$Grid$mapSame(
				$elm$core$Basics$mul(8)),
			fill_style);
		var display = $rtfeldman$elm_css$Svg$Styled$fromUnstyled(
			A2(
				$timjs$elm_collage$Collage$Render$svgBox,
				_Utils_Tuple2(thumbnail_size, thumbnail_size),
				A2(
					$timjs$elm_collage$Collage$shift,
					_Utils_Tuple2(-shift_size, -shift_size),
					$timjs$elm_collage$Collage$group(
						_Utils_ap(
							A2($elm$core$List$map, convert_walls, map.walls),
							A2($elm$core$List$map, convert_ground, map.ground))))));
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$class('gallerymapcontainer'),
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
							$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
						])),
					$rtfeldman$elm_css$Html$Styled$Events$onClick(
					$author$project$Main$LoadGalleryMap(map))
				]),
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$hover(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$opacity(
											$rtfeldman$elm_css$Css$num(0.5))
										]))
								]))
						]),
					_List_fromArray(
						[display])),
					A2(
					$rtfeldman$elm_css$Html$Styled$span,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$class('gallerymaptag'),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
									$rtfeldman$elm_css$Css$bottom(
									$rtfeldman$elm_css$Css$px(5)),
									$rtfeldman$elm_css$Css$left(
									$rtfeldman$elm_css$Css$px(5)),
									$rtfeldman$elm_css$Css$padding(
									$rtfeldman$elm_css$Css$px(5)),
									$rtfeldman$elm_css$Css$borderRadius(
									$rtfeldman$elm_css$Css$px(6)),
									$rtfeldman$elm_css$Css$color(
									$rtfeldman$elm_css$Css$hex('#ffffff')),
									$rtfeldman$elm_css$Css$backgroundColor(
									$rtfeldman$elm_css$Css$hex('#000000')),
									$rtfeldman$elm_css$Css$opacity(
									$rtfeldman$elm_css$Css$num(0.8)),
									$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$hidden)
								]))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(map.name)
						]))
				]));
	});
var $rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.value, argB.value])));
	});
var $rtfeldman$elm_css$Css$margin2 = $rtfeldman$elm_css$Css$prop2('margin');
var $rtfeldman$elm_css$Css$padding2 = $rtfeldman$elm_css$Css$prop2('padding');
var $rtfeldman$elm_css$Css$PercentageUnits = {$: 'PercentageUnits'};
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PercentageUnits, '%');
var $rtfeldman$elm_css$Css$wrap = {flexDirectionOrWrap: $rtfeldman$elm_css$Css$Structure$Compatible, flexWrap: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'wrap'};
var $rtfeldman$elm_css$Css$zero = {length: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible, lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible, number: $rtfeldman$elm_css$Css$Structure$Compatible, numericValue: 0, outline: $rtfeldman$elm_css$Css$Structure$Compatible, unitLabel: '', units: $rtfeldman$elm_css$Css$UnitlessInteger, value: '0'};
var $author$project$Main$map_gallery = function (maps) {
	var thumbnails = A2(
		$elm$core$List$map,
		$author$project$Main$make_thumbnail(190),
		maps);
	var make_flexbox = function (content) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$flexBasis(
							$rtfeldman$elm_css$Css$pct(25)),
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$zero,
							$rtfeldman$elm_css$Css$px(8))
						])),
					$rtfeldman$elm_css$Html$Styled$Attributes$align('center')
				]),
			_List_fromArray(
				[content]));
	};
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$align('center')
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$h3,
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'color', '#F7F9F9')
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('Gallery')
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$displayFlex,
								$rtfeldman$elm_css$Css$flexWrap($rtfeldman$elm_css$Css$wrap),
								A2(
								$rtfeldman$elm_css$Css$margin2,
								$rtfeldman$elm_css$Css$zero,
								$rtfeldman$elm_css$Css$px(-8)),
								$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
								$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center)
							]))
					]),
				A2($elm$core$List$map, make_flexbox, thumbnails))
			]));
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
var $rtfeldman$elm_css$Html$Styled$select = $rtfeldman$elm_css$Html$Styled$node('select');
var $rtfeldman$elm_css$Html$Styled$sup = $rtfeldman$elm_css$Html$Styled$node('sup');
var $timjs$elm_collage$Collage$opposite = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return _Utils_Tuple2(-x, -y);
};
var $timjs$elm_collage$Collage$Layout$align = F2(
	function (anchor, col) {
		return A2(
			$timjs$elm_collage$Collage$shift,
			$timjs$elm_collage$Collage$opposite(
				anchor(col)),
			col);
	});
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sin = _Basics_sin;
var $timjs$elm_collage$Collage$Core$apply = function (_v0) {
	var shift = _v0.shift;
	var scale = _v0.scale;
	var rotation = _v0.rotation;
	var rotated = function (_v5) {
		var x = _v5.a;
		var y = _v5.b;
		var s = $elm$core$Basics$sin(rotation);
		var c = $elm$core$Basics$cos(rotation);
		return _Utils_Tuple2((c * x) - (s * y), (s * x) + (c * y));
	};
	var _v1 = scale;
	var sx = _v1.a;
	var sy = _v1.b;
	var scaled = function (_v4) {
		var x = _v4.a;
		var y = _v4.b;
		return _Utils_Tuple2(sx * x, sy * y);
	};
	var _v2 = shift;
	var dx = _v2.a;
	var dy = _v2.b;
	var shifted = function (_v3) {
		var x = _v3.a;
		var y = _v3.b;
		return _Utils_Tuple2(x + dx, y + dy);
	};
	return A2(
		$elm$core$Basics$composeL,
		A2($elm$core$Basics$composeL, shifted, scaled),
		rotated);
};
var $timjs$elm_collage$Collage$Layout$handlePoints = function (thickness) {
	var thicken = function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		var t = thickness / 2;
		return _Utils_Tuple2(
			(x < 0) ? (x - t) : (x + t),
			(y < 0) ? (y - t) : (y + t));
	};
	return $elm$core$List$map(thicken);
};
var $timjs$elm_collage$Collage$Layout$handleBox = F2(
	function (thickness, _v0) {
		var w = _v0.a;
		var h = _v0.b;
		var y = h / 2;
		var x = w / 2;
		return A2(
			$timjs$elm_collage$Collage$Layout$handlePoints,
			thickness,
			_List_fromArray(
				[
					_Utils_Tuple2(-x, -y),
					_Utils_Tuple2(x, -y),
					_Utils_Tuple2(x, y),
					_Utils_Tuple2(-x, y)
				]));
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $timjs$elm_collage$Collage$Layout$unpack = function (_v0) {
	var toTop = _v0.toTop;
	var toBottom = _v0.toBottom;
	var toRight = _v0.toRight;
	var toLeft = _v0.toLeft;
	return _List_fromArray(
		[
			_Utils_Tuple2(-toLeft, -toBottom),
			_Utils_Tuple2(toRight, -toBottom),
			_Utils_Tuple2(toRight, toTop),
			_Utils_Tuple2(-toLeft, toTop)
		]);
};
var $timjs$elm_collage$Collage$Layout$distances = function (col) {
	var points = $timjs$elm_collage$Collage$Layout$handleBasic(col.basic);
	var _v8 = $elm$core$List$unzip(
		A2(
			$elm$core$List$map,
			$timjs$elm_collage$Collage$Core$apply(col),
			points));
	var xs = _v8.a;
	var ys = _v8.b;
	return {
		toBottom: -A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(ys)),
		toLeft: -A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$minimum(xs)),
		toRight: A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(xs)),
		toTop: A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$maximum(ys))
	};
};
var $timjs$elm_collage$Collage$Layout$handleBasic = function (basic) {
	handleBasic:
	while (true) {
		switch (basic.$) {
			case 'Shape':
				switch (basic.b.$) {
					case 'Circle':
						var _v1 = basic.a;
						var thickness = _v1.b.thickness;
						var r = basic.b.a;
						var d = 2 * r;
						return A2(
							$timjs$elm_collage$Collage$Layout$handleBox,
							thickness,
							_Utils_Tuple2(d, d));
					case 'Ellipse':
						var _v2 = basic.a;
						var thickness = _v2.b.thickness;
						var _v3 = basic.b;
						var rx = _v3.a;
						var ry = _v3.b;
						return A2(
							$timjs$elm_collage$Collage$Layout$handleBox,
							thickness,
							_Utils_Tuple2(2 * rx, 2 * ry));
					case 'Rectangle':
						var _v4 = basic.a;
						var thickness = _v4.b.thickness;
						var _v5 = basic.b;
						var w = _v5.a;
						var h = _v5.b;
						return A2(
							$timjs$elm_collage$Collage$Layout$handleBox,
							thickness,
							_Utils_Tuple2(w, h));
					case 'Polygon':
						var _v6 = basic.a;
						var thickness = _v6.b.thickness;
						var ps = basic.b.a;
						return A2($timjs$elm_collage$Collage$Layout$handlePoints, thickness, ps);
					default:
						var _v7 = basic.a;
						var line = _v7.b;
						var path = basic.b.a;
						var $temp$basic = A2($timjs$elm_collage$Collage$Core$Path, line, path);
						basic = $temp$basic;
						continue handleBasic;
				}
			case 'Path':
				var thickness = basic.a.thickness;
				var cap = basic.a.cap;
				var ps = basic.b.a;
				return A2(
					$timjs$elm_collage$Collage$Layout$handlePoints,
					_Utils_eq(cap, $timjs$elm_collage$Collage$Flat) ? 0 : thickness,
					ps);
			case 'Text':
				var dims = basic.a;
				return A2($timjs$elm_collage$Collage$Layout$handleBox, 0, dims);
			case 'Image':
				var dims = basic.a;
				return A2($timjs$elm_collage$Collage$Layout$handleBox, 0, dims);
			case 'Html':
				var dims = basic.a;
				return A2($timjs$elm_collage$Collage$Layout$handleBox, 0, dims);
			case 'Group':
				var cols = basic.a;
				return A2(
					$timjs$elm_collage$Collage$Layout$handlePoints,
					0,
					$elm$core$List$concat(
						A2(
							$elm$core$List$map,
							A2($elm$core$Basics$composeR, $timjs$elm_collage$Collage$Layout$distances, $timjs$elm_collage$Collage$Layout$unpack),
							cols)));
			default:
				var back = basic.b;
				return A2(
					$timjs$elm_collage$Collage$Layout$handlePoints,
					0,
					$timjs$elm_collage$Collage$Layout$unpack(
						$timjs$elm_collage$Collage$Layout$distances(back)));
		}
	}
};
var $timjs$elm_collage$Collage$Layout$height = function (col) {
	var _v0 = $timjs$elm_collage$Collage$Layout$distances(col);
	var toTop = _v0.toTop;
	var toBottom = _v0.toBottom;
	return toTop + toBottom;
};
var $timjs$elm_collage$Collage$Layout$topLeft = function (col) {
	var _v0 = $timjs$elm_collage$Collage$Layout$distances(col);
	var toLeft = _v0.toLeft;
	var toTop = _v0.toTop;
	return _Utils_Tuple2(-toLeft, toTop);
};
var $timjs$elm_collage$Collage$Layout$width = function (col) {
	var _v0 = $timjs$elm_collage$Collage$Layout$distances(col);
	var toLeft = _v0.toLeft;
	var toRight = _v0.toRight;
	return toLeft + toRight;
};
var $timjs$elm_collage$Collage$Render$svg = function (collage) {
	return A2(
		$timjs$elm_collage$Collage$Render$svgAbsolute,
		_Utils_Tuple2(
			$timjs$elm_collage$Collage$Layout$width(collage),
			$timjs$elm_collage$Collage$Layout$height(collage)),
		A2($timjs$elm_collage$Collage$Layout$align, $timjs$elm_collage$Collage$Layout$topLeft, collage));
};
var $author$project$Tool$FreeformAutofill = {$: 'FreeformAutofill'};
var $author$project$Tool$Line = {$: 'Line'};
var $author$project$Tool$LockedAutofill = {$: 'LockedAutofill'};
var $author$project$Tool$LockedPen = {$: 'LockedPen'};
var $author$project$Tool$Rectangle = {$: 'Rectangle'};
var $author$project$Tool$toTool = function (s) {
	switch (s) {
		case 'Locked Pen':
			return $elm$core$Maybe$Just($author$project$Tool$LockedPen);
		case 'Pen':
			return $elm$core$Maybe$Just($author$project$Tool$FreeformPen);
		case 'Locked Autofill Pen':
			return $elm$core$Maybe$Just($author$project$Tool$LockedAutofill);
		case 'Autofill Pen':
			return $elm$core$Maybe$Just($author$project$Tool$FreeformAutofill);
		case 'Rectangle':
			return $elm$core$Maybe$Just($author$project$Tool$Rectangle);
		case 'Line':
			return $elm$core$Maybe$Just($author$project$Tool$Line);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Html$Styled$option = $rtfeldman$elm_css$Html$Styled$node('option');
var $author$project$Tool$toolOptions = A2(
	$elm$core$List$map,
	function (s) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$option,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(s)
				]));
	},
	_List_fromArray(
		['Pen', 'Locked Pen', 'Autofill Pen', 'Locked Autofill Pen', 'Rectangle', 'Line']));
var $rtfeldman$elm_css$Css$Structure$TypeSelector = function (a) {
	return {$: 'TypeSelector', a: a};
};
var $rtfeldman$elm_css$Css$Global$typeSelector = F2(
	function (selectorStr, styles) {
		var sequence = A2(
			$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
			$rtfeldman$elm_css$Css$Structure$TypeSelector(selectorStr),
			_List_Nil);
		var sel = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, sel, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $simonh1000$elm_colorpicker$ColorPicker$markerAttrs = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
		A2($elm$html$Html$Attributes$style, 'top', '1px'),
		A2($elm$html$Html$Attributes$style, 'bottom', '1px'),
		A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
		A2($elm$html$Html$Attributes$style, 'background-color', '#ffffff'),
		A2($elm$html$Html$Attributes$style, 'width', '6px'),
		A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
	]);
var $simonh1000$elm_colorpicker$ColorPicker$alphaMarker = function (alpha) {
	var correction = 4;
	var xVal = $elm$core$String$fromInt(
		$elm$core$Basics$round((alpha * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - correction));
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'left', xVal + 'px'),
			$simonh1000$elm_colorpicker$ColorPicker$markerAttrs),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$NoOp = {$: 'NoOp'};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $simonh1000$elm_colorpicker$ColorPicker$bubblePreventer = A2(
	$elm$html$Html$Events$stopPropagationOn,
	'click',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($simonh1000$elm_colorpicker$ColorPicker$NoOp, true)));
var $simonh1000$elm_colorpicker$ColorPicker$checkedBkgStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-size', '12px 12px'),
		A2($elm$html$Html$Attributes$style, 'background-position', '0 0, 0 6px, 6px -6px, -6px 0px'),
		A2($elm$html$Html$Attributes$style, 'background-image', 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)')
	]);
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $avh4$elm_color$Color$hsl = F3(
	function (h, s, l) {
		return A4($avh4$elm_color$Color$hsla, h, s, l, 1.0);
	});
var $simonh1000$elm_colorpicker$ColorPicker$hueMarker = function (lastHue) {
	var correction = 4;
	var xVal = $elm$core$String$fromInt(
		$elm$core$Basics$round((lastHue * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - correction));
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'left', xVal + 'px'),
			$simonh1000$elm_colorpicker$ColorPicker$markerAttrs),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$HueSlider = {$: 'HueSlider'};
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseMove = F2(
	function (a, b) {
		return {$: 'OnMouseMove', a: a, b: b};
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$linearGradient = $elm$svg$Svg$trustedNode('linearGradient');
var $elm$svg$Svg$Attributes$offset = _VirtualDom_attribute('offset');
var $elm$svg$Svg$Attributes$display = _VirtualDom_attribute('display');
var $simonh1000$elm_colorpicker$ColorPicker$sliderStyles = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$width(
		$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
		$elm$svg$Svg$Attributes$height('100%'),
		$elm$svg$Svg$Attributes$display('block')
	]);
var $elm$svg$Svg$stop = $elm$svg$Svg$trustedNode('stop');
var $elm$svg$Svg$Attributes$stopColor = _VirtualDom_attribute('stop-color');
var $elm$svg$Svg$Attributes$stopOpacity = _VirtualDom_attribute('stop-opacity');
var $simonh1000$elm_colorpicker$ColorPicker$OnClick = F2(
	function (a, b) {
		return {$: 'OnClick', a: a, b: b};
	});
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseDown = F2(
	function (a, b) {
		return {$: 'OnMouseDown', a: a, b: b};
	});
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseUp = {$: 'OnMouseUp'};
var $simonh1000$elm_colorpicker$ColorPicker$MouseInfo = F3(
	function (x, y, mousePressed) {
		return {mousePressed: mousePressed, x: x, y: y};
	});
var $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo = A4(
	$elm$json$Json$Decode$map3,
	$simonh1000$elm_colorpicker$ColorPicker$MouseInfo,
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$neq(0),
		A2($elm$json$Json$Decode$field, 'buttons', $elm$json$Json$Decode$int)));
var $simonh1000$elm_colorpicker$ColorPicker$onClickSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'click',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $simonh1000$elm_colorpicker$ColorPicker$onMouseDownSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'mousedown',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $simonh1000$elm_colorpicker$ColorPicker$onMouseMoveSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'mousemove',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $elm$svg$Svg$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs = F3(
	function (currMouseTgt, thisTgt, onMoveMsg) {
		var common = _List_fromArray(
			[
				$simonh1000$elm_colorpicker$ColorPicker$onMouseDownSvg(
				$simonh1000$elm_colorpicker$ColorPicker$OnMouseDown(thisTgt)),
				$elm$svg$Svg$Events$onMouseUp($simonh1000$elm_colorpicker$ColorPicker$OnMouseUp),
				$simonh1000$elm_colorpicker$ColorPicker$onClickSvg(
				$simonh1000$elm_colorpicker$ColorPicker$OnClick(thisTgt))
			]);
		return _Utils_eq(currMouseTgt, thisTgt) ? A2(
			$elm$core$List$cons,
			$simonh1000$elm_colorpicker$ColorPicker$onMouseMoveSvg(onMoveMsg),
			common) : common;
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $simonh1000$elm_colorpicker$ColorPicker$huePalette = function (mouseTarget) {
	var stops = _List_fromArray(
		[
			_Utils_Tuple2('0%', '#FF0000'),
			_Utils_Tuple2('17%', '#FF00FF'),
			_Utils_Tuple2('33%', '#0000FF'),
			_Utils_Tuple2('50%', '#00FFFF'),
			_Utils_Tuple2('66%', '#00FF00'),
			_Utils_Tuple2('83%', '#FFFF00'),
			_Utils_Tuple2('100%', '#FF0000')
		]);
	var mkStop = function (_v0) {
		var os = _v0.a;
		var sc = _v0.b;
		return A2(
			$elm$svg$Svg$stop,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$offset(os),
					$elm$svg$Svg$Attributes$stopColor(sc),
					$elm$svg$Svg$Attributes$stopOpacity('1')
				]),
			_List_Nil);
	};
	return A2(
		$elm$svg$Svg$svg,
		A2(
			$elm$core$List$cons,
			$elm$svg$Svg$Attributes$class('hue-picker'),
			$simonh1000$elm_colorpicker$ColorPicker$sliderStyles),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$defs,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$linearGradient,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('gradient-hsv'),
								$elm$svg$Svg$Attributes$x1('100%'),
								$elm$svg$Svg$Attributes$y1('0%'),
								$elm$svg$Svg$Attributes$x2('0%'),
								$elm$svg$Svg$Attributes$y2('0%')
							]),
						A2($elm$core$List$map, mkStop, stops))
					])),
				A2(
				$elm$svg$Svg$rect,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('0'),
							$elm$svg$Svg$Attributes$y('0'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height('100%'),
							$elm$svg$Svg$Attributes$fill('url(#gradient-hsv)')
						]),
					A3(
						$simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs,
						mouseTarget,
						$simonh1000$elm_colorpicker$ColorPicker$HueSlider,
						$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove($simonh1000$elm_colorpicker$ColorPicker$HueSlider))),
				_List_Nil)
			]));
};
var $simonh1000$elm_colorpicker$ColorPicker$OpacitySlider = function (a) {
	return {$: 'OpacitySlider', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$onClickHtml = function (msgCreator) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $simonh1000$elm_colorpicker$ColorPicker$htmlDragAttrs = F3(
	function (currMouseTgt, thisTgt, onMoveMsg) {
		var common = _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$on,
				'mousedown',
				A2(
					$elm$json$Json$Decode$map,
					$simonh1000$elm_colorpicker$ColorPicker$OnMouseDown(thisTgt),
					$simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo)),
				$elm$html$Html$Events$onMouseUp($simonh1000$elm_colorpicker$ColorPicker$OnMouseUp),
				$simonh1000$elm_colorpicker$ColorPicker$onClickHtml(
				$simonh1000$elm_colorpicker$ColorPicker$OnClick(thisTgt))
			]);
		return _Utils_eq(currMouseTgt, thisTgt) ? A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$Events$on,
				'mousemove',
				A2($elm$json$Json$Decode$map, onMoveMsg, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo)),
			common) : common;
	});
var $simonh1000$elm_colorpicker$ColorPicker$opacityPalette = F2(
	function (hsla, model) {
		var mouseTarget = $simonh1000$elm_colorpicker$ColorPicker$OpacitySlider(hsla.hue);
		var mkCol = function (op) {
			return $avh4$elm_color$Color$toCssString(
				A4($avh4$elm_color$Color$hsla, hsla.hue, hsla.saturation, hsla.lightness, op));
		};
		var grad = 'linear-gradient(0.25turn, ' + (mkCol(0) + (', ' + (mkCol(1) + ')')));
		var overlay = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', grad),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'width', '100%')
			]);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				overlay,
				A3(
					$simonh1000$elm_colorpicker$ColorPicker$htmlDragAttrs,
					model.mouseTarget,
					mouseTarget,
					$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove(mouseTarget))),
			_List_Nil);
	});
var $simonh1000$elm_colorpicker$ColorPicker$pickerIndicator = function (col) {
	var adjustment = 4;
	var _v0 = $avh4$elm_color$Color$toHsla(col);
	var saturation = _v0.saturation;
	var lightness = _v0.lightness;
	var borderColor = (lightness > 0.95) ? '#cccccc' : '#ffffff';
	var cy_ = $elm$core$String$fromInt(
		$elm$core$Basics$round(($simonh1000$elm_colorpicker$ColorPicker$widgetHeight - (lightness * $simonh1000$elm_colorpicker$ColorPicker$widgetHeight)) - adjustment));
	var cx_ = $elm$core$String$fromInt(
		$elm$core$Basics$round((saturation * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - adjustment));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'top', cy_ + 'px'),
				A2($elm$html$Html$Attributes$style, 'left', cx_ + 'px'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '100%'),
				A2($elm$html$Html$Attributes$style, 'border', '2px solid ' + borderColor),
				A2($elm$html$Html$Attributes$style, 'width', '6px'),
				A2($elm$html$Html$Attributes$style, 'height', '6px'),
				A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
			]),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$pickerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'cursor', 'crosshair'),
		A2($elm$html$Html$Attributes$style, 'position', 'relative')
	]);
var $simonh1000$elm_colorpicker$ColorPicker$SatLight = function (a) {
	return {$: 'SatLight', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$satLightPalette = F3(
	function (hue, colCss, mouseTarget) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
					$elm$svg$Svg$Attributes$class('main-picker'),
					$elm$svg$Svg$Attributes$display('block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$defs,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$linearGradient,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('pickerSaturation')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0'),
											$elm$svg$Svg$Attributes$stopColor('#808080'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('1'),
											$elm$svg$Svg$Attributes$stopColor('#808080'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil)
								])),
							A2(
							$elm$svg$Svg$linearGradient,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('pickerBrightness'),
									$elm$svg$Svg$Attributes$x1('0'),
									$elm$svg$Svg$Attributes$y1('0'),
									$elm$svg$Svg$Attributes$x2('0'),
									$elm$svg$Svg$Attributes$y2('1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0'),
											$elm$svg$Svg$Attributes$stopColor('#fff'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0.499'),
											$elm$svg$Svg$Attributes$stopColor('#fff'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0.5'),
											$elm$svg$Svg$Attributes$stopColor('#000'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('1'),
											$elm$svg$Svg$Attributes$stopColor('#000'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
							$elm$svg$Svg$Attributes$fill(colCss),
							$elm$svg$Svg$Attributes$id('picker')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
							$elm$svg$Svg$Attributes$fill('url(#pickerSaturation)')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
								$elm$svg$Svg$Attributes$fill('url(#pickerBrightness)')
							]),
						A3(
							$simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs,
							mouseTarget,
							$simonh1000$elm_colorpicker$ColorPicker$SatLight(hue),
							$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove(
								$simonh1000$elm_colorpicker$ColorPicker$SatLight(hue)))),
					_List_Nil)
				]));
	});
var $simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles = function (name) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$Attributes$style,
			'width',
			$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth) + 'px'),
			A2($elm$html$Html$Attributes$style, 'height', '12px'),
			A2($elm$html$Html$Attributes$style, 'marginTop', '8px'),
			$elm$html$Html$Attributes$class('color-picker-slider ' + name)
		]);
};
var $simonh1000$elm_colorpicker$ColorPicker$view = F2(
	function (col, _v0) {
		var model = _v0.a;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		var hue = A2($elm$core$Maybe$withDefault, hsla.hue, model.hue);
		var colCss = $avh4$elm_color$Color$toCssString(
			A3($avh4$elm_color$Color$hsl, hue, 1, 0.5));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px'),
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '5px'),
					A2($elm$html$Html$Attributes$style, 'box-shadow', 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px'),
					$elm$html$Html$Attributes$class('color-picker-container'),
					$simonh1000$elm_colorpicker$ColorPicker$bubblePreventer
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
					_List_fromArray(
						[
							A3($simonh1000$elm_colorpicker$ColorPicker$satLightPalette, hue, colCss, model.mouseTarget),
							$simonh1000$elm_colorpicker$ColorPicker$pickerIndicator(col)
						])),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
						$simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles('hue')),
					_List_fromArray(
						[
							$simonh1000$elm_colorpicker$ColorPicker$huePalette(model.mouseTarget),
							$simonh1000$elm_colorpicker$ColorPicker$hueMarker(hue)
						])),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						$simonh1000$elm_colorpicker$ColorPicker$checkedBkgStyles,
						_Utils_ap(
							$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
							$simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles('opacity'))),
					_List_fromArray(
						[
							A2($simonh1000$elm_colorpicker$ColorPicker$opacityPalette, hsla, model),
							$simonh1000$elm_colorpicker$ColorPicker$alphaMarker(hsla.alpha)
						]))
				]));
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $abradley2$form_elements$FormElements$Switch$view = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-switch-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('elm-switch', true),
								_Utils_Tuple2('elm-switch--selected', props.isOn)
							])),
						$elm$html$Html$Events$onClick(
						props.handleToggle(!props.isOn))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('elm-switch__switch-indicator', true),
										_Utils_Tuple2('elm-switch__switch-indicator--toggled', props.isOn)
									]))
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('elm-switch__label', true),
								_Utils_Tuple2('elm-switch__label--toggled', props.isOn)
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(props.label)
					]))
			]));
};
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$core$String$toFloat = _String_toFloat;
var $carwow$elm_slider$SingleSlider$inputDecoder = A2(
	$elm$json$Json$Decode$map,
	function (value) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toFloat(value));
	},
	$elm$html$Html$Events$targetValue);
var $debois$elm_dom$DOM$offsetHeight = A2($elm$json$Json$Decode$field, 'offsetHeight', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$offsetWidth = A2($elm$json$Json$Decode$field, 'offsetWidth', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$offsetLeft = A2($elm$json$Json$Decode$field, 'offsetLeft', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$offsetParent = F2(
	function (x, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'offsetParent',
					$elm$json$Json$Decode$null(x)),
					A2($elm$json$Json$Decode$field, 'offsetParent', decoder)
				]));
	});
var $debois$elm_dom$DOM$offsetTop = A2($elm$json$Json$Decode$field, 'offsetTop', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$scrollLeft = A2($elm$json$Json$Decode$field, 'scrollLeft', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$scrollTop = A2($elm$json$Json$Decode$field, 'scrollTop', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$position = F2(
	function (x, y) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var x_ = _v0.a;
				var y_ = _v0.b;
				return A2(
					$debois$elm_dom$DOM$offsetParent,
					_Utils_Tuple2(x_, y_),
					A2($debois$elm_dom$DOM$position, x_, y_));
			},
			A5(
				$elm$json$Json$Decode$map4,
				F4(
					function (scrollLeftP, scrollTopP, offsetLeftP, offsetTopP) {
						return _Utils_Tuple2((x + offsetLeftP) - scrollLeftP, (y + offsetTopP) - scrollTopP);
					}),
				$debois$elm_dom$DOM$scrollLeft,
				$debois$elm_dom$DOM$scrollTop,
				$debois$elm_dom$DOM$offsetLeft,
				$debois$elm_dom$DOM$offsetTop));
	});
var $debois$elm_dom$DOM$boundingClientRect = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (_v0, width, height) {
			var x = _v0.a;
			var y = _v0.b;
			return {height: height, left: x, top: y, width: width};
		}),
	A2($debois$elm_dom$DOM$position, 0, 0),
	$debois$elm_dom$DOM$offsetWidth,
	$debois$elm_dom$DOM$offsetHeight);
var $carwow$elm_slider$RangeSlider$snapValue = F2(
	function (value, step) {
		return $elm$core$Basics$round(value / step) * step;
	});
var $carwow$elm_slider$SingleSlider$onOutsideRangeClick = function (_v0) {
	var slider = _v0.a;
	var commonAttributes = slider.commonAttributes;
	var valueDecoder = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (rectangle, mouseX) {
				var clickedValue = (((commonAttributes.max - commonAttributes.min) / rectangle.width) * mouseX) + commonAttributes.min;
				return A2($carwow$elm_slider$RangeSlider$snapValue, clickedValue, commonAttributes.step);
			}),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['target']),
			$debois$elm_dom$DOM$boundingClientRect),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetX']),
			$elm$json$Json$Decode$float));
	return A2($elm$json$Json$Decode$map, slider.valueAttributes.change, valueDecoder);
};
var $carwow$elm_slider$RangeSlider$onClick = function (decoder) {
	return A2($elm$html$Html$Events$on, 'click', decoder);
};
var $carwow$elm_slider$SingleSlider$onInsideRangeClick = function (_v0) {
	var commonAttributes = _v0.a.commonAttributes;
	var valueAttributes = _v0.a.valueAttributes;
	var valueDecoder = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (rectangle, mouseX) {
				var adjustedValue = A3($elm$core$Basics$clamp, commonAttributes.min, commonAttributes.max, valueAttributes.value);
				var newValue = $elm$core$Basics$round((adjustedValue / rectangle.width) * mouseX);
				var adjustedNewValue = A3($elm$core$Basics$clamp, commonAttributes.min, commonAttributes.max, newValue);
				return A2($carwow$elm_slider$RangeSlider$snapValue, adjustedNewValue, commonAttributes.step);
			}),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['target']),
			$debois$elm_dom$DOM$boundingClientRect),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetX']),
			$elm$json$Json$Decode$float));
	return A2($elm$json$Json$Decode$map, valueAttributes.change, valueDecoder);
};
var $carwow$elm_slider$SingleSlider$progressView = function (_v0) {
	var slider = _v0.a;
	var commonAttributes = slider.commonAttributes;
	var valueAttributes = slider.valueAttributes;
	var value = A3($elm$core$Basics$clamp, commonAttributes.min, commonAttributes.max, valueAttributes.value);
	var progressRatio = 100 / (commonAttributes.max - commonAttributes.min);
	var progress = (commonAttributes.max - value) * progressRatio;
	var progressAttributes = _List_fromArray(
		[
			$elm$html$Html$Attributes$class('input-range__progress'),
			A2($elm$html$Html$Attributes$style, 'left', '0.0%'),
			A2(
			$elm$html$Html$Attributes$style,
			'right',
			$elm$core$String$fromFloat(progress) + '%'),
			$carwow$elm_slider$RangeSlider$onClick(
			$carwow$elm_slider$SingleSlider$onInsideRangeClick(
				$carwow$elm_slider$SingleSlider$SingleSlider(slider)))
		]);
	return A2($elm$html$Html$div, progressAttributes, _List_Nil);
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $carwow$elm_slider$RangeSlider$onChange = F2(
	function (msg, input) {
		return A2(
			$elm$html$Html$Events$on,
			'change',
			A2($elm$json$Json$Decode$map, msg, input));
	});
var $carwow$elm_slider$RangeSlider$onInput = F2(
	function (msg, input) {
		return A2(
			$elm$html$Html$Events$on,
			'input',
			A2($elm$json$Json$Decode$map, msg, input));
	});
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $carwow$elm_slider$RangeSlider$sliderInputView = F4(
	function (commonAttributes, valueAttributes, input, extraClasses) {
		return A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('range'),
					$elm$html$Html$Attributes$min(
					$elm$core$String$fromFloat(commonAttributes.min)),
					$elm$html$Html$Attributes$max(
					$elm$core$String$fromFloat(commonAttributes.max)),
					$elm$html$Html$Attributes$step(
					$elm$core$String$fromFloat(commonAttributes.step)),
					$elm$html$Html$Attributes$value(
					$elm$core$String$fromFloat(valueAttributes.value)),
					$elm$html$Html$Attributes$class('input-range'),
					$elm$html$Html$Attributes$classList(
					A2(
						$elm$core$List$map,
						function (c) {
							return _Utils_Tuple2(c, true);
						},
						extraClasses)),
					A2($carwow$elm_slider$RangeSlider$onChange, valueAttributes.change, input),
					A2($carwow$elm_slider$RangeSlider$onInput, valueAttributes.change, input)
				]),
			_List_Nil);
	});
var $carwow$elm_slider$RangeSlider$sliderTrackView = function (decoder) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('input-range__track'),
				$carwow$elm_slider$RangeSlider$onClick(decoder)
			]),
		_List_Nil);
};
var $carwow$elm_slider$SingleSlider$view = function (_v0) {
	var slider = _v0.a;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input-range-container')
					]),
				_List_fromArray(
					[
						A4($carwow$elm_slider$RangeSlider$sliderInputView, slider.commonAttributes, slider.valueAttributes, $carwow$elm_slider$SingleSlider$inputDecoder, _List_Nil),
						$carwow$elm_slider$RangeSlider$sliderTrackView(
						$carwow$elm_slider$SingleSlider$onOutsideRangeClick(
							$carwow$elm_slider$SingleSlider$SingleSlider(slider))),
						$carwow$elm_slider$SingleSlider$progressView(
						$carwow$elm_slider$SingleSlider$SingleSlider(slider))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input-range-labels-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-range-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								slider.commonAttributes.minFormatter(slider.commonAttributes.min))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-range-label input-range-label--current-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(slider.valueAttributes.formatter, slider.valueAttributes.value, slider.commonAttributes.max))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-range-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								slider.commonAttributes.maxFormatter(slider.commonAttributes.max))
							]))
					]))
			]));
};
var $rtfeldman$elm_css$Css$visible = {overflow: $rtfeldman$elm_css$Css$Structure$Compatible, pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'visible', visibility: $rtfeldman$elm_css$Css$Structure$Compatible};
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $author$project$Main$view = function (model) {
	var undo = A2(
		$rtfeldman$elm_css$Html$Styled$button,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$Undo),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-right', '15px')
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text('Undo')
			]));
	var tools = A2(
		$rtfeldman$elm_css$Html$Styled$select,
		_List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-bottom', '10px'),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-top', '5px')
			]),
		$author$project$Tool$toolOptions);
	var redo = A2(
		$rtfeldman$elm_css$Html$Styled$button,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$Redo),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-right', '10px')
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text('Redo')
			]));
	var msg = 'D\u0026D Map Designer Studio Suite Lite';
	var map = $rtfeldman$elm_css$Svg$Styled$fromUnstyled(
		$timjs$elm_collage$Collage$Render$svg(
			$timjs$elm_collage$Collage$group(
				A2(
					$elm$core$List$map,
					function (f) {
						return f(model);
					},
					_List_fromArray(
						[$author$project$Main$draw_mouse, $author$project$Main$draw_grid, $author$project$Main$draw_ground, $author$project$Main$draw_paths, $author$project$Main$draw_bg])))));
	var eraser = A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'min-width', '130px')
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$fromUnstyled(
				$abradley2$form_elements$FormElements$Switch$view(
					{
						handleToggle: $author$project$Main$ToggleSwitch,
						isOn: model.erasing,
						label: 'Eraser Mode: ' + (model.erasing ? 'On' : 'Off')
					}))
			]));
	var downloadButton = model.editState ? A2(
		$rtfeldman$elm_css$Html$Styled$button,
		A2(
			$elm$core$List$cons,
			$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$SwitchState),
			$author$project$Main$button_attributes),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text('Save as Image')
			])) : A2(
		$rtfeldman$elm_css$Html$Styled$button,
		A2(
			$elm$core$List$cons,
			$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$Download),
			$author$project$Main$button_attributes),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text('Download')
			]));
	var savebar = A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$align('center'),
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$bottom(
						$rtfeldman$elm_css$Css$px(5))
					]))
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$input,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$value(model.mapName),
						$rtfeldman$elm_css$Html$Styled$Events$onInput($author$project$Main$MapName)
					]),
				_List_Nil),
				A2(
				$rtfeldman$elm_css$Html$Styled$button,
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Html$Styled$Events$onClick(
						$author$project$Main$UploadMap(
							$author$project$Main$encode_model(model))),
					$author$project$Main$button_attributes),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text('Upload')
					])),
				downloadButton
			]));
	var colorpicker = A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin', '15px'),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-left', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$map,
				$author$project$Main$ColorPickerMsg,
				$rtfeldman$elm_css$Html$Styled$fromUnstyled(
					A2($simonh1000$elm_colorpicker$ColorPicker$view, model.currentColor, model.colorPicker)))
			]));
	var clear = A2(
		$rtfeldman$elm_css$Html$Styled$button,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Main$ClearBoard),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-left', '8px')
			]),
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$text('Clear')
			]));
	var menu_items = A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Events$onInput(
				function (s) {
					var _v0 = $author$project$Tool$toTool(s);
					if (_v0.$ === 'Just') {
						var t = _v0.a;
						return $author$project$Main$SwitchTool(t);
					} else {
						return $author$project$Main$SwitchTool($author$project$Tool$FreeformPen);
					}
				}),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'inline-block'),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'vertical-align', 'top')
			]),
		_List_fromArray(
			[tools, eraser, colorpicker, undo, redo, clear]));
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'flex')
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$aside,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$pct(20))
							])),
						A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'background', '#333333'),
						$rtfeldman$elm_css$Html$Styled$Attributes$align('center')
					]),
				_List_fromArray(
					[
						$author$project$Main$map_gallery(model.galleryMaps),
						savebar
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$flex(
								$rtfeldman$elm_css$Css$int(1)),
								$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$auto)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Html$Styled$h3,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$Attributes$align('center'),
										A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin', '15px'),
										A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'font', '25px Optima, sans-serif'),
										A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'color', '#FBFBFB')
									]),
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$text(msg),
										A2(
										$rtfeldman$elm_css$Html$Styled$sup,
										_List_Nil,
										_List_fromArray(
											[
												$rtfeldman$elm_css$Html$Styled$text('\u2122')
											]))
									])),
								A2(
								$rtfeldman$elm_css$Html$Styled$div,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$Attributes$align('center'),
										A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'margin-bottom', '10px')
									]),
								A2(
									$elm$core$List$map,
									$rtfeldman$elm_css$Html$Styled$fromUnstyled,
									_List_fromArray(
										[
											$carwow$elm_slider$SingleSlider$view(model.widthSlider),
											$carwow$elm_slider$SingleSlider$view(model.heightSlider)
										]))),
								A2(
								$rtfeldman$elm_css$Html$Styled$div,
								_List_fromArray(
									[
										$rtfeldman$elm_css$Html$Styled$Attributes$id('map_canvas_container'),
										A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'block'),
										$rtfeldman$elm_css$Html$Styled$Attributes$align('center')
									]),
								_List_fromArray(
									[
										A2(
										$rtfeldman$elm_css$Html$Styled$div,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'inline-block')
											]),
										_List_fromArray(
											[map])),
										menu_items
									])),
								A2(
								$rtfeldman$elm_css$Html$Styled$canvas,
								_Utils_ap(
									_List_fromArray(
										[
											A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'display', 'none')
										]),
									$author$project$Main$canvas_attributes(model)),
								_List_Nil)
							]))
					])),
				$rtfeldman$elm_css$Css$Global$global(
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Css$Global$typeSelector,
						'.gallerymapcontainer:hover .gallerymaptag',
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$visibility($rtfeldman$elm_css$Css$visible)
							]))
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: $author$project$Main$init,
		subscriptions: $author$project$Main$subscriptions,
		update: $author$project$Main$update,
		view: A2($elm$core$Basics$composeR, $author$project$Main$view, $rtfeldman$elm_css$Html$Styled$toUnstyled)
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));