export default async function (req, res) {
  // Map source query parameter to the corresponding RSS feed URL
  const feeds = {
    dawn: 'https://www.dawn.com/rss',
    bbc: 'http://feeds.bbci.co.uk/news/rss.xml',
    reuters: 'http://feeds.reuters.com/reuters/topNews',
  };

  const { source } = req.query;
  const feedUrl = feeds[source];

  // Handle invalid source parameter
  if (!feedUrl) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(400).send('Invalid source parameter. Must be dawn, bbc, or reuters.');
    return;
  }

  try {
    // Fetch the RSS feed
    const response = await fetch(feedUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const xmlText = await response.text();

    // Set CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Set content type to XML
    res.setHeader('Content-Type', 'application/xml');

    // Return the XML content
    res.status(200).send(xmlText);

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).send('Error fetching RSS feed.');
  }
}
