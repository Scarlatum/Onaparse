# Onaparse
Minimalistic markdown parser with clean output

### Input: 

```markdown

  ### Something

  Und folgt wieder und lispelnd...

  ![Description](./image.avif)

```

### Output: 

```json
  [
    {
      "type": "h3",
      "value": "Something"
    },
    {
      "type": "p",
      "value": "Und folgt wieder und lispelnd..."
    },
    {
      "type": "img",
      "value": {
        "url": "./image.avif",
        "alt": "Description"
      }
    }
  ]
```