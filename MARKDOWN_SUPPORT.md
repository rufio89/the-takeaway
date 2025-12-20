# Markdown Support

The Takeaway supports **full Markdown formatting** in all content fields, making it easy to paste content directly from Notion!

## Supported Fields

All of these fields support Markdown:
- **Digest Description**
- **Idea Summary**
- **Idea Actionable Takeaway**

## Supported Markdown Features

### Text Formatting
```markdown
**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
`inline code`
```

### Lists
```markdown
Unordered lists:
- Item 1
- Item 2
  - Nested item
  - Another nested item

Ordered lists:
1. First item
2. Second item
3. Third item
```

### Links
```markdown
[Link text](https://example.com)
```

### Headings
```markdown
## Heading 2
### Heading 3
#### Heading 4
```

### Blockquotes
```markdown
> This is a quote
> - Author Name
```

### Tables (GitHub Flavored Markdown)
```markdown
| Feature | Supported |
|---------|-----------|
| Bold    | ✅        |
| Italic  | ✅        |
| Lists   | ✅        |
```

## Copying from Notion

When you copy content from Notion:

1. **Select and copy** the text in Notion (Cmd/Ctrl + C)
2. **Paste directly** into The Takeaway's admin forms (Cmd/Ctrl + V)
3. The formatting will be preserved! ✨

### What Gets Preserved from Notion

✅ **Bold** text
✅ *Italic* text
✅ Bulleted lists
✅ Numbered lists
✅ Links
✅ Headings
✅ Line breaks

### Example

**Notion content:**
```
The 80/20 Principle

Focus on high-impact activities:
• 20% of efforts drive 80% of results
• Identify your leverage points
• Say no to low-value work

Learn more at example.com
```

**Paste into The Takeaway and it renders beautifully!**

## Tips for Great Content

1. **Use bold** for key concepts and important terms
2. **Use lists** to break down complex ideas into digestible points
3. **Add links** to reference materials or related resources
4. **Keep it concise** - aim for clarity over length
5. **Use headings** to organize longer summaries

## Technical Details

- Powered by `react-markdown` with GitHub Flavored Markdown (GFM)
- Styled with Tailwind's typography plugin
- Automatically sanitized for security
- Responsive and mobile-friendly
