import clientPromise from '../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { studentId, hash } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db('academic-transcript-system');

    // Log the studentId and hash for debugging
    console.log('Received studentId:', studentId);
    console.log('Received hash:', hash);

    // Update the transcript document where studentId matches
    const result = await db.collection('transcripts').updateOne(
      { studentId: studentId }, // Match by studentId
      { $set: { transcriptHash: hash } } // Update transcriptHash
    );

    // Log the result of the update operation
    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Transcript not found for the given studentId' });
    }

    res.status(200).json({ message: 'Transcript hash updated successfully' });
  } catch (error) {
    console.error('Error updating transcript hash:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}