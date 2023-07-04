import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate()
    const buttonRef = useRef(null);
    useEffect(() => {
        buttonRef.current.focus();
    }, []);

    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6" style={{ height: '88vh' }}>
                <div className="mx-auto max-w-screen-sm text-center  my-20">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4x">
                        Something's missing.
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500">
                        Sorry, we can't find that page. You'll find lots to explore on the
                        home page.{" "}
                    </p>
                    <button onClick={() => navigate('/')} ref={buttonRef} tabIndex={0}
                        className="inline-flex text-white hover:text-black hover:bg-gray-200 bg-black font-semibold rounded-md text-sm px-5 py-2.5 text-center mt-8"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        </section>
    );
}

export default NotFound;