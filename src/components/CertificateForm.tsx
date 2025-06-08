import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const prefixes = ['นาย', 'นางสาว', 'คุณ'];
type Step = 'form' | 'preview';

const CertificateForm: React.FC = () => {
  const [step, setStep] = useState<Step>('form');
  const [prefix, setPrefix] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const certRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date().toLocaleDateString('th-TH', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const handleNext = () => {
    if (!prefix || !firstName.trim() || !lastName.trim()) {
      alert('กรุณากรอกคำนำหน้า ชื่อ และนามสกุลให้ครบ');
      return;
    }
    setStep('preview');
  };

  const handleGenerateAndDownload = async (type: 'pdf' | 'jpeg') => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const id = `${crypto.randomUUID()}_${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
    const filename = `certificate_${id}`;

    if (type === 'jpeg') {
      const blob = await (await fetch(imgData)).blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.jpeg`;
      link.click();
    } else {
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const props = pdf.getImageProperties(imgData);
      const width = pdf.internal.pageSize.getWidth();
      const height = (props.height * width) / props.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save(`${filename}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md">
        {step === 'form' ? (
          <>
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">ข้อมูลสำหรับ Certificate</h1>
            <div className="space-y-4">
              <select
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">-- เลือกคำนำหน้า --</option>
                {prefixes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                type="text"
                placeholder="ชื่อ"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                placeholder="นามสกุล"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={handleNext}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition"
              >
                ไปยัง Preview
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep('form')}
              className="mb-3 text-sm text-indigo-500 hover:underline"
            >&larr; แก้ไขข้อมูล</button>

            <div className="mx-auto w-full max-w-sm">
              <div
                ref={certRef}
                className="relative bg-white rounded-xl overflow-hidden shadow-xl"
                style={{ aspectRatio: '210 / 297' }}
              >
                {/* ขอบนอก */}
                <div className="absolute inset-0 border-8 border-yellow-400 rounded-xl" />
                {/* ขอบใน */}
                <div className="absolute inset-4 border-2 border-yellow-300 rounded-lg" />

                <div className="relative h-full flex flex-col items-center px-6 pt-8 pb-6 text-center">
                  {/* หัวข้อ */}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 uppercase mb-2">Certificate of Achievement</h1>
                  <hr className="w-2/3 border-gray-300 mb-4" />

                  {/* เนื้อหาขอบคุณ */}
                  <p className="text-gray-700 mb-4 text-lg">
                    ขอขอบคุณ {prefix} {firstName} {lastName}<br />
                    ที่มาร่วมทดสอบระบบของเรา
                  </p>

                  {/* วันที่ */}
                  <div className="mt-auto text-sm text-gray-600">
                    วันที่ออกใบประกาศ: {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* ปุ่มดาวน์โหลด */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => handleGenerateAndDownload('jpeg')}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition text-sm"
              >Download JPEG</button>
              <button
                onClick={() => handleGenerateAndDownload('pdf')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition text-sm"
              >Download PDF</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CertificateForm;
