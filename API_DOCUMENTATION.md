# The Takeaway API Documentation

## Overview

The Takeaway API allows you to automatically process podcast transcripts and extract actionable ideas using Claude AI. The API analyzes transcripts, identifies key insights, and saves them directly to your Supabase database.

## Setup

### 1. Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key

### 2. Configure Environment Variables

Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Start the API Server

```bash
npm run server
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check

**GET** `/api/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "The Takeaway API is running"
}
```

### Process Transcript

**POST** `/api/process-transcript`

Process a podcast transcript and extract actionable ideas.

**Request Body:**
```json
{
  "transcript": "Full podcast transcript text here...",
  "podcastName": "The Tim Ferriss Show",
  "podcastHost": "Tim Ferriss",
  "digestId": "uuid-of-existing-digest-or-null"
}
```

**Parameters:**
- `transcript` (required): The full podcast transcript as a string
- `podcastName` (optional): Name of the podcast (will be created if it doesn't exist)
- `podcastHost` (optional): Name of the podcast host
- `digestId` (optional): UUID of an existing digest to associate the ideas with

**Response:**
```json
{
  "success": true,
  "ideasCount": 5,
  "ideas": [
    {
      "id": "uuid",
      "title": "The 80/20 Rule for Decision Making",
      "summary": "Markdown formatted summary...",
      "actionable_takeaway": "Specific steps...",
      "clarity_score": 9,
      "category_id": "uuid",
      "podcast_id": "uuid",
      "digest_id": "uuid"
    }
  ],
  "podcast": {
    "id": "uuid",
    "name": "The Tim Ferriss Show",
    "host": "Tim Ferriss"
  }
}
```

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:3001/api/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Your full podcast transcript here...",
    "podcastName": "My First Million",
    "podcastHost": "Sam Parr & Shaan Puri"
  }'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3001/api/process-transcript', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transcript: 'Your full podcast transcript here...',
    podcastName: 'How I Built This',
    podcastHost: 'Guy Raz',
    digestId: 'your-digest-uuid' // Optional
  }),
});

const result = await response.json();
console.log(`Extracted ${result.ideasCount} ideas!`);
```

### Using Python

```python
import requests

response = requests.post('http://localhost:3001/api/process-transcript', json={
    'transcript': 'Your full podcast transcript here...',
    'podcastName': 'The Diary of a CEO',
    'podcastHost': 'Steven Bartlett'
})

data = response.json()
print(f"Extracted {data['ideasCount']} ideas!")
```

## How It Works

1. **Submit Transcript**: Send a POST request with the transcript
2. **Claude Analysis**: The API uses Claude 3.5 Sonnet to analyze the transcript
3. **Extract Ideas**: Claude identifies 3-7 high-value insights with:
   - Compelling titles
   - Clear summaries (markdown formatted)
   - Actionable takeaways
   - Clarity scores (1-10)
   - Categories (Productivity, Marketing, Leadership, Strategy, Mindset, Innovation)
4. **Save to Database**: Ideas are automatically saved to your Supabase database
5. **Return Results**: API returns the extracted ideas and metadata

## What Claude Extracts

For each idea, Claude provides:

- **Title**: Concise, compelling (5-10 words)
- **Summary**: 2-4 paragraphs explaining the concept
  - Uses **bold** for key terms
  - Includes bullet lists where appropriate
  - Properly formatted markdown with line breaks
- **Actionable Takeaway**: Specific steps to apply the insight
  - Can include numbered lists
  - 1-2 paragraphs of concrete actions
- **Clarity Score**: 1-10 rating (10 = crystal clear and immediately actionable)
- **Category**: Auto-categorized into existing categories

## Tips for Best Results

### Transcript Quality
- Provide clean, readable transcripts
- Remove excessive filler words if possible
- Include speaker labels if available

### Transcript Length
- Works best with 5,000 - 30,000 words
- Longer transcripts may hit token limits
- Consider splitting very long transcripts

### Associating with Digests
- Create a digest first in the admin panel
- Copy the digest ID from the URL
- Include it in the `digestId` parameter

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing transcript, no ideas extracted)
- `500`: Server error (Claude API error, database error)

**Error Response:**
```json
{
  "error": "Failed to process transcript",
  "details": "Error message here"
}
```

## Workflow Recommendation

1. **Get Transcript**: Use a service like [AssemblyAI](https://www.assemblyai.com/) or [Deepgram](https://deepgram.com/) to transcribe audio
2. **Create Digest**: Go to `/admin` and create a new digest
3. **Process Transcript**: POST the transcript to the API with the digest ID
4. **Review**: Check the digest detail page to see the extracted ideas
5. **Edit if Needed**: Use the admin panel to refine any ideas

## Next Steps

Consider integrating:
- **Automated workflows**: Use Zapier or n8n to trigger on new podcasts
- **Audio processing**: Add AssemblyAI or Deepgram to process audio files directly
- **Batch processing**: Process multiple episodes at once
- **Quality review**: Add a review step before publishing ideas

## Rate Limits

- Claude API has rate limits based on your plan
- The default model is `claude-3-5-sonnet-20241022`
- Each request costs approximately $0.03-0.15 depending on transcript length

## Security Notes

- Keep your `ANTHROPIC_API_KEY` secret
- Don't commit `.env.local` to version control
- Consider adding authentication to the API endpoint
- Run the server behind a proxy in production
