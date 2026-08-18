import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PenSquare, Award, ShieldCheck, Zap, HeartHandshake, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const AboutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const values = [
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: 'Depth Over Clickbait',
      description:
        'We value thoughtful analysis, clear system architectures, and verifiable real-world experience over sensationalized headlines.',
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: 'Frictionless Publishing',
      description:
        'Writing should feel effortless. Our intuitive studio lets engineers and designers focus entirely on articulating their craft.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: 'Editorial Integrity',
      description:
        'No pop-up ads, no paywall tricks, no distracting banners. A serene, high-readability environment designed for deep reading.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-indigo-600" />,
      title: 'Collaborative Community',
      description:
        'Constructive feedback loops and meaningful technical discussions connecting junior learners with veteran staff engineers.',
    },
  ];

  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Our Mission & Story</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading leading-tight">
          Where Thoughtful Minds Publish <br />
          <span className="text-indigo-600">The Future of Tech & Ideas</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          BlogSpace was founded on a simple conviction: high-signal knowledge deserves an elegant, distraction-free home. We empower software architects, researchers, and creators to share actionable knowledge.
        </p>
      </section>

      {/* Story & Philosophy Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Built for Writers Who Value Substance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In an internet flooded with AI-generated noise and bloated ad-heavy websites, BlogSpace is intentionally designed as an oasis for authentic editorial quality.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you are documenting a complex distributed database outage, sharing lessons from scaling an engineering organization, or detailing product design micro-interactions, your stories find their most engaged audience here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-3xl font-black text-indigo-600 font-heading">10,000+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Monthly Readers</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-3xl font-black text-indigo-600 font-heading">500+</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Active Authors</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-3xl font-black text-indigo-600 font-heading">98%</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Satisfaction Rate</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-3xl font-black text-indigo-600 font-heading">0 Ads</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Clean Reading</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Our Core Principles
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            The foundation of everything we design, curate, and engineer on BlogSpace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-linear-to-tr from-indigo-600 to-violet-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Ready to Share Your Perspective?
          </h2>
          <p className="text-sm text-indigo-100 max-w-md mx-auto">
            Create an author account in seconds and publish your first article today.
          </p>
          <div className="pt-2">
            <Link to={isAuthenticated ? '/create-blog' : '/register'}>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<PenSquare className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold text-indigo-700 bg-white hover:bg-slate-50 shadow-md"
              >
                Start Writing on BlogSpace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
