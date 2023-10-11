import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { Firestore, Timestamp, addDoc, collection, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { logoutUser } from "@/features/userSlice";
import { useMaterialTailwindController } from "@/context/Materialindex";


export function SignUp() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [controller, dispatch] = useMaterialTailwindController();
  
  
  const navigate = useNavigate();


  const signoutUser=()=>{
    dispatch(logoutUser());
    signOut(auth);
   window
   }

  const handleSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        // signInWithEmailAndPassword(auth, email, password).then(
        //   updateProfile(auth.currentUser, {
        //     displayName: username,

        //   })
        // );

        signInWithEmailAndPassword(auth, email, password).then(
          updateProfile(auth.currentUser, {
            displayName: username,

          }),
          addDoc(collection(db, "EUsers"), {
            displayName: username,
            createdAt:serverTimestamp(),
            email:email,
            transactions:[{}],
            goals:[{}],

          }),

        
          
        );

        setTimeout(navigate('/auth/sign-in'),2000)
      })
      
      .catch((err) => {
        alert(err);
      });

      // navigate('/auth/sign-in')
      
  };

  return (
    <>
      <img
        src="https://www.fujifilm.com/fbhk/-/media/fbhk/7,-d-,-insights/1027683138_1920x1080.jpg?h=1080&w=1920&la=en&hash=63112B36D84204CA15B5B99BA0781C02"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Name" size="lg"  value={username} onChange={e=>setUsername(e.target.value)}/>
            <Input type="email" label="Email" size="lg" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input type="password" label="Password" size="lg" value={password} onChange={e=>setPassword(e.target.value)} />
            <div className="-ml-2.5">
              <Checkbox label="I agree the Terms and Conditions" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={handleSignUp}>
              Sign Up
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
