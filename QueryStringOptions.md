# Introduction #

Some of Parchment's options are set with a query string. The most important is of course the story option, which specifices which story to load! Use these options after the query string marker `?`, and separate them with `&` or `;`.

Example:
```
http://iplayif.com/?story=http://ifarchive.org/if-archive/games/glulx/advent.ulx;vm=quixe
```


# Details #

Parchment allows the following options to be specified by query string:

| **Name** | **Default** | **Description** | **Example** |
|:---------|:------------|:----------------|:------------|
| options  | -           | override [parchment\_options](ParchmentOptions.md) with a [JSON object](http://json.org/) | `options={"width":35}` |
| story    | whatever is specified in [parchment\_options](ParchmentOptions.md) | the URL of a story to load | `story=game.z5` |
| vm       | -           | force the use of a particular VM | `vm=quixe`  |