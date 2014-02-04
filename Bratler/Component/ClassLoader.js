/*

The MIT License (MIT)

Copyright (c) 2014 Thomas Klose

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/**
 * @version 1.0.0 
 * 
 * @returns {Bratler_Component_ClassLoader}
 */
function Bratler_Component_ClassLoader() {
    var self, prefixes, suffixes, data, instances;

    self = this;
    prefixes = {};
    suffixes = {};
    data = {};
    instances = {};

    /**
     * crate a new instance of className
     * 
     * @param {string} className
     * @param {mixed} any further parameter will be passed to className's constructor
     * @returns {object|null}
     */
    this.create = function (className) {
        var object, instanceArgs;
        if (self.load(className)) {
            instanceArgs = Array.prototype.slice.call(arguments, 1);
            object = new Function('args', 'return new ' + className + '(args)')(instanceArgs);

            return object;
        }

        return null;
    };

    /**
     * returns allways the same object for className
     * 
     * @param {string} className
     * @param {mixed} any further parameter will be passed to className's constructor
     * @returns {object|null}
     */
    this.createSingleton = function (className) {
        var object;

        if (!instances.hasOwnProperty(className)) {
            object = self.create.apply(this, arguments);
            if (object !== null) {
                instances[className] = object;
            }
        }

        return instances[className];
    };

    /**
     * load className
     * 
     * @param {string} className
     * @return {boolean} true if class could be loaded
     */
    this.load = function (className) {
        if (!self.isClassLoaded(className)) {
            self.loadClass(className);
        }

        return self.isClassLoaded(className);
    };


    /**
     * 
     * @param {string} prefix
     * @param {string} path
     * @returns {Bratler_Component_ClassLoader}
     */
    this.addPrefix = function (prefix, path) {
        path = (path.substr(-1) !== '/') ? path + '/' : path;
        prefixes[prefix] = path;

        return self;
    };

    this.getPrefixes = function () {
        return prefixes;
    };

    /**
     * set a filename suffix for a namespace. Default is '.js'.
     * 
     * @param {string} namespace
     * @param {string} suffix
     * @returns {Bratler_Component_ClassLoader}
     */
    this.addSuffix = function (namespace, suffix) {
        suffixes[namespace] = suffix;

        return self;
    };

    this.getSuffixes = function () {
        return suffixes;
    };

    this.loadClass = function (className) {
        var filename;

        filename = self.findFile(className);
        if (filename !== false) {
            self.require(filename, className);
        }
    };

    /**
     * get Javascript Filename for className
     * 
     * @param {string} className
     * @returns {Boolean|string}
     */
    this.findFile = function (className) {
        var fileName, prefix;

        fileName = self.getFileName(className);
        for (prefix in prefixes) {
            if (className.indexOf(prefix) === 0) {
                url = prefixes[prefix] + fileName;
                if (self.getContent(url, className)) {
                    return url;
                }
            }
        }

        return false;
    };

    this.getSuffixForClassname = function (className) {
        var namespace;

        for (namespace in suffixes) {
            if (className.indexOf(namespace) === 0) {
                return suffixes[namespace];
            }
        }

        return '.js';
    };

    /**
     * transforms undescroes to slashes
     * @example vendor_foo_bar_myclass => vendor/foo/bar/myclass.js
     * 
     * @param {string} className
     * @returns {string}
     */
    this.getFileName = function (className) {
        return className.replace(/_/g, '/') + self.getSuffixForClassname(className);
    };

    /**
     * 
     * @returns {ActiveXObject|XMLHttpRequest|Boolean}
     */
    this.getRequest = function () {
        var obj;

        if (window.XMLHttpRequest) {
            obj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                obj = new ActiveXObject('MSXML2.XMLHTTP.3.0');
            } catch (e1) {
                try {
                    obj = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e2) {
                    obj = false;
                }
            }
        }
        return obj;
    };

    /**
     * 
     * @param {string} url
     * @returns {Boolean}
     */
    this.getContent = function (url, className) {
        var req;

        req = self.getRequest();
        try {
            req.open("GET", url, false);
            req.send(null);
            if (req.status === 200) {
                data[className] = req.responseText;

                return true;
            }
        } catch (er) {
            console.log(er);
        }
        return false;
    };

    /**
     * 
     * @param {string} url
     * @param {string} className
     */
    this.require = function (url, className) {
        var body, script;

        body = document.getElementsByTagName('BODY').item(0);
        script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = data[className];
        script.setAttribute("data-Bratler_Component_ClassLoader-classname", className);
        script.setAttribute("data-Bratler_Component_ClassLoader-src", url);
        body.appendChild(script);
    };

    /**
     * @param {string} className
     * @returns {Boolean}
     */
    this.isClassLoaded = function (className) {
        return (typeof window[className] === "function");
    };

}
