# fixed-length-parser README

Apply color with setting.json to recognize data

## Features



## Requirements

vs code

## Extension Settings

add config to setting.json like below format

it apply color with setting.json like below format

```
"fixed-length-parser": {
        "header": {
            "h_a": {
                "size": 4,
            },
            "h_b": {
                "size": 6,
            },
            "h_c": {
                "size": 12,
            }
        },
        "body": {
            "b_a": {
                "size": 2,
            },
            "b_b": {
                "size": 4,
            },
            "b_c": {
                "size": 8,
            },
            "b_d": {
                "size": 10,
            },
            "b_e": {
                "size": 2,
            },
        },
        "tail": {
            "t_a": {
                "size": 6,
            },
            "t_b": {
                "size": 6,
            },
            "t_c": {
                "size": 6,
            },
            "t_d": {
                "size": 6,
            },
        },
    }
```

header is first line and tail is last line
other line is applied color, line by line
(size / 2) is length
when hover data, show key as data name(e.g t_a)

## Known Issues

this is proto type extension

## Release Notes

### 1.0.0 (12/20)

Initial release of fixed length parser
