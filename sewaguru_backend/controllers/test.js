

export const test = async (req,res) => {
  try{
 const data = await sendEmail({
    to: 'it21021534@my.sliit.lk',
    subject: 'Welcome!',
    text: 'Thank you for registering.',
    html: '<h1>Thank you for registering.</h1>',
  });

  return res.json(data)
}catch (e){
  console.log(e)
  return res.json({err: e})
}
}