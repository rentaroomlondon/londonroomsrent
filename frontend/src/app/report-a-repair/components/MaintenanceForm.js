'use client';

import { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { toast } from 'react-toastify';

export default function MaintenanceForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    priority: 'Routine',
    description: '',
    issueStarted: '',
    firstName: 'James',
    lastName: 'Carter',
    email: 'james@email.com',
    phone: '07700 900 000',
    address: 'Room A, Rosemary Court, Fortune Green Road, NW6',
    contactTime: 'Anytime',
    access: 'Yes — someone is always home',
    photos: []
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, title: 'Select Problem', description: 'What needs fixing?' },
    { id: 2, title: 'Add Details', description: 'Description & photos' },
    { id: 3, title: 'Confirm & Submit', description: 'Review details' },
  ];

  // SUBMIT API
  const submitMaintenance = async () => {
    try {
      setLoading(true);

      const cleanedPhotos = (formData.photos || []).map((p) =>
        typeof p === "string" ? p : p.url
      );

      const payload = {
        ...formData,
        photos: cleanedPhotos,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      toast.success("Maintenance request submitted successfully");

      // reset form
      setFormData({
        category: '',
        priority: 'Routine',
        description: '',
        issueStarted: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        contactTime: '',
        access: '',
        photos: []
      });

      setStep(1);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Emergency Alert Banner */}
        <div className="relative overflow-hidden bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="relative flex h-3 w-3 mt-1 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div className="text-xs sm:text-sm text-[#0F253B] leading-relaxed">
              <span className="font-bold uppercase tracking-wider text-amber-700 block sm:inline mr-2">
                Emergency Contact
              </span>
              If you smell gas, call National Grid on{' '}
              <a href="tel:0800111999" className="font-bold underline hover:text-amber-700">
                0800 111 999
              </a>
              . For immediate life danger or fire, call{' '}
              <a href="tel:999" className="font-bold underline hover:text-amber-700">
                999
              </a>
              . Urgent property issues:{' '}
              <a href="tel:02045703191" className="font-bold text-[#F27438] underline">
                020 4570 3191
              </a>
            </div>
          </div>
        </div>

        {/* Stepper Card Header */}
        <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 sm:p-8 shadow-sm space-y-6">
          
          {/* Progress Bar Header */}
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#E8E4DF] -z-0 hidden sm:block" />
            
            {/* Dynamic Progress Line */}
            <div
              className="absolute top-5 left-8 h-0.5 bg-[#18B26A] transition-all duration-500 ease-in-out -z-0 hidden sm:block"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : 'calc(100% - 4rem)',
              }}
            />

            {/* Steps Container */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 relative z-10">
              {steps.map((s) => {
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;

                return (
                  <div
                    key={s.id}
                    className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center"
                  >
                    {/* Circle Indicator */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shrink-0 ${
                        isCompleted
                          ? 'bg-[#18B26A] text-white ring-4 ring-[#18B26A]/20'
                          : isCurrent
                          ? 'bg-[#F27438] text-white ring-4 ring-[#F27438]/20 shadow-md shadow-[#F27438]/30'
                          : 'bg-[#FAF8F5] text-[#9CA3AF] border border-[#E8E4DF]'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.id
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="flex flex-col">
                      <span
                        className={`text-xs sm:text-sm font-semibold transition-colors ${
                          isCurrent
                            ? 'text-[#F27438]'
                            : isCompleted
                            ? 'text-[#18B26A]'
                            : 'text-[#9CA3AF]'
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="text-[11px] text-[#6B7280] hidden sm:block">
                        {s.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Interactive Form Step Content */}
        <main className="bg-white rounded-2xl border border-[#E8E4DF] p-6 sm:p-10 shadow-sm transition-all duration-300">
          {step === 1 && (
            <StepOne
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <StepTwo
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {step === 3 && (
            <StepThree
              formData={formData}
              setFormData={setFormData}
              onBack={prevStep}
              onSubmit={submitMaintenance}
              loading={loading}
            />
          )}
        </main>

      </div>
    </div>
  );
}