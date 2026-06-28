import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export const AboutPage = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <div className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Us</h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded" />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Arain Iron Store Vehova</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Arain Iron Store Vehova was established in 1998. Since then, we have been providing quality construction materials and hardware products with trust and reliability.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our mission is to provide customers with durable products at competitive prices. With over 25 years of experience, we have become the most trusted name for construction materials in the region.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[['25+', 'Years Experience'], ['500+', 'Products'], ['1000+', 'Customers'], ['1998', 'Established']].map(([num, label]) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-blue-600">{num}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Our Values</h3>
          {[
            { icon: '✅', title: 'Quality First', desc: 'Only the best construction materials from trusted brands.' },
            { icon: '💰', title: 'Competitive Prices', desc: 'Best prices without compromising on quality.' },
            { icon: '🤝', title: 'Trust & Reliability', desc: '25+ years of building trust with customers.' },
            { icon: '🚀', title: 'Fast Service', desc: 'Quick delivery and responsive customer support.' },
          ].map(v => (
            <div key={v.title} className="flex gap-4 mb-5">
              <div className="text-2xl">{v.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{v.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export const ContactPage = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <div className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500">Arain Brothers & Sons — We're here to help</p>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded mt-4" />
      </div>

      {/* CEO Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          { name: 'Malik Kabeer', role: 'CEO & Founder', phone: '+92 334 7135272', whatsapp: '923347135272' },
          { name: 'Malik Zameer', role: 'CEO & Co-Founder', phone: '+92 333 2530723', whatsapp: '923323884785' },
        ].map(ceo => (
          <div key={ceo.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {ceo.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{ceo.name}</h3>
                <p className="text-blue-600 text-sm">{ceo.role}</p>
                <p className="text-gray-500 text-xs font-medium">Arain Iron Store Vehova</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a href={`tel:${ceo.phone}`} className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg py-2.5 text-sm font-medium transition-colors">
                📞 Call
              </a>
              <a href={`https://wa.me/${ceo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg py-2.5 text-sm font-medium transition-colors">
                💬 WhatsApp
              </a>
              <a href="mailto:info@arainiron.com"
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg py-2.5 text-sm font-medium transition-colors">
                ✉️ Email
              </a>
              <a href="https://maps.app.goo.gl/njyq7zCvB83ayTiT6" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg py-2.5 text-sm font-medium transition-colors">
                📍 Location
              </a>
            </div>
            <p className="text-gray-500 text-xs text-center mt-3">{ceo.phone}</p>
          </div>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '📍', title: 'Location', lines: ['Opposite National Bank of Pakistan', 'Vehova, DG Khan, Punjab'] },
          { icon: '🕐', title: 'Working Hours', lines: ['Mon–Sat: 8AM – 8PM', 'Sun: 9AM – 5PM'] },
          { icon: '✉️', title: 'Email', lines: ['info@arainiron.com', 'sales@arainiron.com'] },
        ].map(info => (
          <div key={info.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">{info.icon}</div>
            <h4 className="font-semibold text-gray-800 mb-2">{info.title}</h4>
            {info.lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
          </div>
        ))}
      </div>

      {/* Shop Location Map */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">📍 Shop Location</h3>
            <p className="text-xs text-gray-400 mt-0.5">Opposite National Bank of Pakistan, Vehova</p>
          </div>
          <a
            href="https://maps.app.goo.gl/njyq7zCvB83ayTiT6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
            🗺️ Open in Maps
          </a>
        </div>
        <iframe
          title="Arain Iron Store Vehova Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.9!2d70.50860!3d31.12830!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39258b2646589481%3A0x69be4a42bf03bc5d!2sArain%20Iron%20%26%20Building%20Materials%20Store%20Vehova!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
          width="100%"
          height="420"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="px-5 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500">📌 Opposite National Bank of Pakistan, Vehova</p>
          <a href="https://maps.app.goo.gl/njyq7zCvB83ayTiT6" target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Get Directions →
          </a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default AboutPage;
