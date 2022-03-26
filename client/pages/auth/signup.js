import {useState} from "react";
import {useRouter} from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const {doRequest, errors} = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            email,
            password
        },
        onSuccess: () => {
            router.push("/")
        }
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign up</h1>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>

            {errors}

            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}