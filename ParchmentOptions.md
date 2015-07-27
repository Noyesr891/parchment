# Introduction #

If you have your own copy of Parchment you will probably want to customise the options. Do so by adding some simple Javascript to your HTML, as this example shows:

```
<script>
parchment_options = {
    default_story: [ 'stories/mygame.z5', 'stories/mygame.z5.js' ],
    lib_path: 'parchment/'
};
</script>
```

If you don't have your own copy of Parchment you can also specify these options via the [query string](QueryStringOptions.md), however that is not recommended and not all copies of Parchment will allow it.

# Details #

Parchment allows the following options to be customised:

| **Name** | **Default** | **Description** | **Example** |
|:---------|:------------|:----------------|:------------|
| container| `#parchment` | A selector for the top HTML element which we will have complete control over | `container: '#gamediv'` |
| default\_story | none        | The default story to load. If unspecified, will show the default panel instead. This can either be a single URL, or it can be an array of two URLs, where the second is a backup Javascript encoded story file | `default_story: 'stories/mygame.z5'` <br> or <br> <code>default_story: [ 'stories/mygame.z5', 'stories/mygame.z5.js' ]</code> <br>
<tr><td> lib_path </td><td> <code>lib/</code> </td><td> Where to find the Javascript libraries Parchment needs </td><td> <code>lib_path: 'parchment/'</code> </td></tr>
<tr><td> lock_options </td><td> <code>0</code> </td><td> If set to 1 will stop people from specifying additional options in the <a href='QueryStringOptions.md'>query string</a> </td><td> <code>lock_options: 1</code> </td></tr>
<tr><td> lock_story </td><td> <code>0</code> </td><td> If set to 1 will stop people from specifying another story in the <a href='QueryStringOptions.md'>query string</a> </td><td> <code>lock_story: 1</code> </td></tr>
<tr><td> page_title </td><td> <code>1</code> </td><td> Set to 0 if you don't want Parchment to overwrite your <code>&lt;title&gt;</code> </td><td> <code>page_title: 0</code> </td></tr>
<tr><td> panels   </td><td> <code>[ 'search', 'url', 'about' ]</code> </td><td> An array of front page panels to display if there is no default story </td><td> <code>panels: [ 'about', 'search', 'url' ]</code> </td></tr>
<tr><td> proxy_url </td><td> <code>http://zcode.appspot.com/proxy/</code> </td><td> The URL of the <a href='https://github.com/curiousdannii/parchment-proxy'>proxy server</a> </td><td> <code>proxy_url: 'http://yourdomain.com/proxy/'</code> </td></tr>
<tr><td> width    </td><td> <code>80</code> </td><td> The width of the screen in characters. You might want to set this to a smaller value if you're putting it in an <code>&lt;iframe&gt;</code> for example. </td><td> <code>width: 32</code> </td></tr>