"use client";
import { useSignUp } from "@/app/Context/SignUpContext";
import Link from "next/link";
import { FiCamera } from "react-icons/fi";

export default function Step3() {
    const { signUpData, setSignUpData } = useSignUp();

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSignUpData({
                    ...signUpData,
                    profileImage: event.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Step 3</h3>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Set up Your Profile
                    </h1>
                </div>
                
                <div className=" p-6 sm:p-8 rounded-xl w-full space-y-6">
                   
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {signUpData.profileImage ? (
                                    <img 
                                        src={signUpData.profileImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-gray-400">👤</span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
                                <FiCamera className="text-lg" />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Upload profile picture</p>
                    </div>

                   
                    <div className="space-y-7">
                        <div>
                            <input 
                                id="fullName"
                                type="text"
                                placeholder="Full name"
                                value={signUpData.FullName2}
                                onChange={(e) => setSignUpData({...signUpData, FullName2: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>

                        <div>
                            <input 
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={signUpData.Email}
                                onChange={(e) => setSignUpData({...signUpData, Email: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>

                   
                    <button 
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={!signUpData.FullName2?.trim() || !signUpData.Email?.trim()}
                    >
                        <Link href='/dashboard' className="block w-full">
                            Continue
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}