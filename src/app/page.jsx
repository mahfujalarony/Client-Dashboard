"use client";
import { useSignUp } from "@/app/Context/SignUpContext";
import Link from "next/link";

export default function Step1() {
    const { signUpData, setSignUpData } = useSignUp();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Step 1</h3>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        What Should <br className="sm:hidden" /> We Call You?
                    </h1>
                </div>
                
                <div className=" p-6 sm:p-8 rounded-xl  w-full">
                    <div className="space-y-6">
                        <div>
                            <input 
                                type="text"
                                placeholder="Full Name"
                                value={signUpData.FullName}
                                onChange={(e) => setSignUpData({...signUpData, FullName: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-lg">
                            <Link href='/step2' className="block w-full">
                                Continue
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}