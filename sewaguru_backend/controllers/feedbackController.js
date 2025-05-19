import feedback from '../models/feedback.js';


export const submitFeedback = async (req, res) => {
  try {
    const formData = req.body;
    const newFeedback = new feedback(formData);
    const savedFeedback = await newFeedback.save();
    console.log('Feedback data saved:', savedFeedback);
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error saving feedback data:', error);
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const allFeedback = await feedback.find().sort({ submittedAt: -1 }); 
    res.status(200).json(allFeedback);
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback.' });
  }
};