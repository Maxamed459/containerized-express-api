import User from "../model/user.js";

export const registerUser = async (req, res) => {
  try {
    // success

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const isUserExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (isUserExists) {
      return res.send("This user or email already exists");
    }
    const userinfo = new User({
      email: email,
      username: username,
      password: password,
    });

    await userinfo.save();
    userinfo.password = undefined;
    return res.status(201).send(userinfo);
  } catch (error) {
    res.send("something went wrong: ", error);
    console.log(`Error: ${error}`);
  }
};
