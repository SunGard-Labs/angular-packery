# angular-packery #

Angular module for the popular Packery library.

[![Continuous Integration Status](https://api.travis-ci.org/SunGard-Labs/angular-packery.svg?branch=master)](http://travis-ci.org/SunGard-Labs/angular-packery)
[![Dependency Status](https://david-dm.org/SunGard-Labs/angular-packery.svg)](https://david-dm.org/SunGard-Labs/angular-packery)
[![devDependency Status](https://david-dm.org/SunGard-Labs/angular-packery/dev-status.svg)](https://david-dm.org/SunGard-Labs/angular-packery#info=devDependencies)


#### Requirements ####

* [Packery](http://packery.metafizzy.co/)

#### Optional ###

* [Draggabilly](http://draggabilly.desandro.com/)

---

## Example Usage ##

### Simple ###

By default, this module listens for an element or attribute call and instantiates with the options described in [Packery's API](http://packery.metafizzy.co/options.html). It looks to a self-created object, `div.packery-sizer`, to control the grid dimensions.

##### HTML #####

```
<packery ng-init="objects = [{id:'1'},{id:'2'},{id:'3'}]">

  <packery-object>
    <header>
      <h3>Sample object</h3>
    </header>
    <div ng-include="'/resources/partials/some-partial.html'"></div>
  </packery-object>

  <packery-object>
    <div>Mmmm pizza</div>
  </packery-object>

  <packery-object>asdasd</packery-object>

  <packery-object ng-repeat="obj in objects">
     <h3>Dynamic object #{{obj.id}}</h3>
  </packery-object>

  <packery-object>
    <h3>One more</h3>
    <p>...for the road</p>
  </packery-object>

</packery>
```

#### CSS ####

```
.packery-sizer, .packery-object {
  width: 360px;
  height: 500px;
}
```

### Custom ###

This module supports almost all of the Packery options in their intended form. As such, custom options can be set via attributes on the main packery element. Please refer to [Packery's website](http://packery.metafizzy.co/options.html) for available options.

##### HTML #####

```
<packery row-height=".card.single" column-width=".card.single" handle=".card-header" is-origin-top="false" gutter="20">

  <packery-object class="card single">
    <header class="card-header">
      <h3>Uno</h3>
    </header>
    <div>One</div>
  </packery-object>

  <packery-object class="card double">
    <header class="card-header">
      <h3>Dos</h3>
    </header>
    <div>Two</div>
  </packery-object>

  <packery-object class="card single">
    <header class="card-header">
      <h3>Tres</h3>
    </header>
    <div>Three</div>
  </packery-object>

  <packery-object class="card single">
    <header class="card-header">
      <h3>Fourso</h3>
    </header>
    <div>Four</div>
  </packery-object>

</packery>
```

##### CSS #####
```
.card.single {
  width: 300px;
  height: 400px;
}

.card.double {
  width: 620px;
  height: 400px;
}

.card-header {
  cursor: move;
}
```

---

## CSS Classes / Animating ##

Two CSS classes are applied to the objects to show depth during dragging events, `hovered` and `lifted`. The classes are triggered by both mouse events and touch events.

Animation can be applied easily with CSS:

```
.card {
  -webkit-transition: box-shadow 0.2s;
  -moz-transition: box-shadow 0.2s;
  transition: box-shadow 0.2s;
}

.card.hovered {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.card.lifted {
  box-shadow: 0 13px 33px rgba(100,100,100,0.30), 0 8px 12px rgba(100,100,100,0.22);
  z-index: 5;
}
```

---

## Events ##

`packeryInstantiated` - Emits Packery obj. Fired when a new Packery container is created.

`packeryObjectPacked` - Emits element. Fired when an object is packed.

---

## A note on ng-include and draggability ##

Due to how Angular builds `ng-include` templates, this module does not support using `ng-include` on your `packery-object` or custom handle elements. Doing so will cause draggability issues.

To ensure that your dynamic content packs and drags properly, please ensure that the objects and handles are built outside of any `ng-include`'d content.

**Good:**

```
<packery-object>
  <div ng-include="'template.html'"></div>
</packery-object>
```

**Bad:**

```
<packery-object ng-include="'template.html'"></packery-object>
```

**Good:**

```
<packery handle=".card-header">
  <packery-object class="card">
    <header class="card-header"><h3>Drag handle</h3></header>
    <div ng-include="'template.html'"></div>
  </packery-object>
</packery>
```

**Bad:**

```
<packery-object handle=".handle-in-template">
  <div ng-include="'template.html'"></div>
</packery-object>
```

---

## License

This repository is open source and distributed under the MIT License:

```
The MIT License

Copyright (c) 2014 Sungard http://www.sungard.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
Packery is a product of Metafizzy LLC and is distributed under a separate license. Please refer to [their website](http://packery.metafizzy.co/license.html) for information on Packery's license.
