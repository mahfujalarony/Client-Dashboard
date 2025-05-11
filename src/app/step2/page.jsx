"use client";
import { useSignUp } from "@/app/Context/SignUpContext";
import Link from "next/link";

export default function Step2() {
    const { signUpData, setSignUpData } = useSignUp();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Step 2</h3>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Tell us about <br className="sm:hidden" /> your company
                    </h1>
                </div>
                
                <div className="p-6 sm:p-8 rounded-xl  w-full space-y-6">
                    <div className="space-y-7">
                        <div>
                            <input 
                                id="companyName"
                                type="text"
                                placeholder="Company name"
                                value={signUpData.CompanyName}
                                onChange={(e) => setSignUpData({...signUpData, CompanyName: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <input 
                                id="website"
                                type="url"
                                placeholder="Website (optional)"
                                value={signUpData.WebSite}
                                onChange={(e) => setSignUpData({...signUpData, WebSite: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={!signUpData.CompanyName.trim()}>
                        <Link href='/step3' className="block w-full">
                            Continue
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}