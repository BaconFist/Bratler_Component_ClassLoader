Bratler_Component_ClassLoader
=============================

Javascript Classloader

Dynamically load Javascript to current Page.


Usage
-----
Create the ClassLoader:
    
    window.classLoader = new Bratler_Component_ClassLoader();

Add a Prefix:
    
    classLoader.addPrefix('Vendor_namespace_foo', 'http://vendor.com/jslibs/');
    
Create an Instance of Vendor_namespace_foo_bar_baz()
    
    var theBaz = classLoader.create('Vendor_namespace_foo_bar_baz', someArg, someOtherArg);
This will try to include the contetns of file 'http://vendor.com/jslibs/Vendor/namespace/foo/bar/baz.js'


You can also use `new` as usual, just load the Class before:
    
    classLoader.load('Vendor_namespace_foo_bar_baz');
    var theBaz = new Vendor_namespace_foo_bar_baz(someArg, someOtherArg);

Create or get a singleton instance:
    
    var theBaz = classLoader.createSingleton('Vendor_namespace_foo_bar_baz', someArg, someOtherArg);

Use a minified Javascript Version:
    
    classLoader.addSuffix('Vendor_namespace_foo', '.minified.js');
Now the ClassLoader tries to get the contents from '...baz.minified.js' instead of '...baz.js'
