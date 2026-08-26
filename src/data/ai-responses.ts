export const aiResponses: Record<string, string> = {
  'exoskeleton': 'An exoskeleton is a wearable robotic device that provides external support to the body. In human augmentation, exoskeletons can help restore movement, reduce physical strain, and assist with rehabilitation. They range from full-body industrial exoskeletons to lightweight orthotic devices for specific joints.',
  'exosuit': 'An exosuit is a soft, flexible alternative to rigid exoskeletons. Made from textiles, cables, and soft actuators, exosuits provide support while allowing natural movement. They\'re often more comfortable for all-day wear and are used in both workplace and rehabilitation settings.',
  'mobility': 'For mobility enhancement, several technologies may be relevant: SmartStride for gait analysis and coaching, FlexStep Assist for powered ankle support, and BalanceSense for fall prevention. The best choice depends on your specific mobility challenges and goals.',
  'choose': 'When choosing augmentation technology, consider: (1) Your specific functional goals, (2) The evidence level supporting the technology, (3) How it fits your daily activities, (4) Comfort and wearability, (5) Cost and insurance coverage, and (6) Professional guidance from a qualified clinician.',
  'track': 'Key metrics to track include: functional improvement (walking speed, grip strength, balance scores), usage consistency, subjective comfort ratings, activity participation levels, and any adverse effects. Regular measurement helps optimize your augmentation plan.',
  'rehabilitation': 'Rehabilitation technologies range from robotic training systems like the NeuroStep Trainer for clinical settings to wearable sensors like BalanceSense and SmartStride for ongoing home-based rehabilitation. Many combine technology with professional therapy for best outcomes.',
  'sports': 'Sports performance technologies focus on biomechanical monitoring, injury prevention, and performance optimization. RunSense Pro, for example, provides real-time form feedback and injury risk prediction. These technologies work best as part of a structured training program.',
  'safety': 'AugmentX technologies are designed with safety as a priority. Key safety considerations include: proper fitting by a qualified professional, regular maintenance checks, understanding device limitations, following usage guidelines, and reporting any discomfort immediately. Always consult with a healthcare provider before starting.',
  'cost': 'Technology costs vary widely depending on complexity and type. Many rehabilitation technologies may be partially covered by insurance or healthcare programs. AugmentX can help you understand your options and connect with providers who offer financing or rental programs.',
  'ai': 'AugmentAI is an educational demonstration tool. It provides general information about human augmentation technologies but does not provide medical advice. Always consult qualified professionals for health-related decisions.',
};

export function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('exoskeleton') && !lower.includes('exosuit')) {
    return aiResponses['exoskeleton'];
  }
  if (lower.includes('exosuit')) {
    return aiResponses['exosuit'];
  }
  if (lower.includes('mobility') || lower.includes('walking') || lower.includes('move')) {
    return aiResponses['mobility'];
  }
  if (lower.includes('choos') || lower.includes('select') || lower.includes('which') || lower.includes('recommend')) {
    return aiResponses['choose'];
  }
  if (lower.includes('track') || lower.includes('measure') || lower.includes('monitor') || lower.includes('progress')) {
    return aiResponses['track'];
  }
  if (lower.includes('rehab') || lower.includes('recover') || lower.includes('therapy')) {
    return aiResponses['rehabilitation'];
  }
  if (lower.includes('sport') || lower.includes('athlet') || lower.includes('performance') || lower.includes('running')) {
    return aiResponses['sports'];
  }
  if (lower.includes('safe') || lower.includes('risk') || lower.includes('harm')) {
    return aiResponses['safety'];
  }
  if (lower.includes('cost') || lower.includes('price') || lower.includes('afford') || lower.includes('insurance')) {
    return aiResponses['cost'];
  }

  return 'I\'m AugmentAI, an educational demo assistant. I can help you understand human augmentation technologies, including exoskeletons, wearables, robotic rehabilitation devices, and assistive technologies. Try asking me about specific technology types, how to choose the right technology, what to track during rehabilitation, or safety considerations. Remember, I provide general educational information — always consult a qualified professional for personalized advice.';
}
