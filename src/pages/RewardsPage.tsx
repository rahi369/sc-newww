import React, { useState, useEffect } from 'react';
import { Gift, HelpCircle, Sparkles, CheckCircle2, XCircle, AlertCircle, Lock, Trophy, Wallet, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rewardsService, getCurrentWeekIdentifier, getTodayDateString } from '../services/rewardsService';
import { QuizQuestion, Voucher, RewardProfile } from '../types';
import confetti from 'canvas-confetti';

interface RewardsPageProps {
  navigate: (route: string) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({ navigate }) => {
  const { user, openAuthModal } = useAuth();

  // Tab: 'quiz' | 'mystery-box' | 'wallet' | 'streak'
  const [activeTab, setActiveTab] = useState<'quiz' | 'mystery-box' | 'wallet' | 'streak'>('quiz');

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAttemptedToday, setHasAttemptedToday] = useState(false);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; rewardAmount: number; voucherId?: string } | null>(null);
  const [quizError, setQuizError] = useState('');

  // Mystery Box State
  const [boxCanClaim, setBoxCanClaim] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekIdentifier());
  const [boxOpening, setBoxOpening] = useState(false);
  const [boxResult, setBoxResult] = useState<{ wonAmount: number; voucherId: string } | null>(null);
  const [boxError, setBoxError] = useState('');

  // Wallet & Streak State
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [rewardProfile, setRewardProfile] = useState<RewardProfile | null>(null);

  // Load Quiz & Mystery Box status for customer
  useEffect(() => {
    if (!user) {
      setQuizLoading(false);
      return;
    }

    let isMounted = true;

    async function loadQuizData() {
      setQuizLoading(true);
      try {
        const attempted = await rewardsService.hasAttemptedToday(user!.uid);
        if (isMounted) setHasAttemptedToday(attempted);

        if (!attempted) {
          const nextQ = await rewardsService.getNextQuestionForCustomer(user!.uid);
          if (isMounted) setCurrentQuestion(nextQ);
        }
      } catch (e) {
        console.warn('Error loading quiz question:', e);
      } finally {
        if (isMounted) setQuizLoading(false);
      }
    }

    async function loadBoxData() {
      try {
        const boxStatus = await rewardsService.canClaimMysteryBox(user!.uid);
        if (isMounted) {
          setBoxCanClaim(boxStatus.canClaim);
          setCurrentWeek(boxStatus.currentWeek);
        }
      } catch (e) {
        console.warn('Error loading box status:', e);
      }
    }

    loadQuizData();
    loadBoxData();

    const unsubVouchers = rewardsService.subscribeToCustomerVouchers(user.uid, (v) => {
      if (isMounted) setVouchers(v);
    });

    const unsubProfile = rewardsService.subscribeToRewardProfile(user.uid, (p) => {
      if (isMounted) setRewardProfile(p);
    });

    return () => {
      isMounted = false;
      unsubVouchers();
      unsubProfile();
    };
  }, [user]);

  // Handle Quiz Submission
  const handleAnswerSubmit = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (selectedOption === null || !currentQuestion) return;

    setQuizSubmitting(true);
    setQuizError('');

    try {
      const res = await rewardsService.submitQuizAnswer(
        user.uid,
        currentQuestion,
        selectedOption
      );

      setQuizResult(res);
      setHasAttemptedToday(true);

      if (res.isCorrect) {
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
    } catch (err: any) {
      setQuizError(err.message || 'Quiz submission failed. Please try again.');
    } finally {
      setQuizSubmitting(false);
    }
  };

  // Handle Mystery Box Open
  const handleOpenMysteryBox = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setBoxOpening(true);
    setBoxError('');

    try {
      const res = await rewardsService.claimMysteryBox(user.uid);
      setBoxResult(res);
      setBoxCanClaim(false);

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch {}
    } catch (err: any) {
      setBoxError(err.message || 'Could not claim Mystery Box.');
    } finally {
      setBoxOpening(false);
    }
  };

  const streakCount = rewardProfile?.streak || 0;
  const purchasesCount = rewardProfile?.totalPurchases || 0;
  const isWinner = streakCount >= 20 && purchasesCount >= 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
          Interactive Customer Club
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl font-bold text-gray-900">
          Rewards, Daily Quiz &amp; Vouchers
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Win authentic shopping vouchers redeemable at checkout for SAMIA’S CLOSET.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#F4EFE6] border border-[#E8E2D9] max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#0E7490]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Daily Business Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mystery-box')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mystery-box'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#0E7490]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span>Weekly Mystery Box</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('streak')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'streak'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#0E7490]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Streak &amp; Gifts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#0E7490]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Voucher Wallet ({vouchers.filter((v) => v.status === 'active').length})</span>
          </button>
        </div>
      </div>

      {/* Guest warning banner if not authenticated */}
      {!user && (
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#92400E] shrink-0" />
            <p className="text-xs text-[#92400E] font-medium leading-relaxed">
              <strong>Account Required:</strong> Sign in with Google or Email to participate in the Daily Quiz, earn ৳2 vouchers, and unlock your weekly Mystery Box.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-5 py-2.5 rounded-xl bg-[#92400E] hover:bg-[#78350F] text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-xs"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* 1. DAILY BUSINESS QUIZ SECTION */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
                Knowledge Challenge
              </span>
              <h2 className="font-brand text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Daily Fashion &amp; Business Quiz
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Reward: ৳2 Voucher
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Rule: 1 quiz attempt per calendar day. Questions are strictly non-repeating across your lifetime history. Correct answer deposits a real ৳2 voucher into your Firestore wallet!
          </p>

          {quizError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{quizError}</span>
            </div>
          )}

          {quizLoading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-7 h-7 border-3 border-[#0E7490] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-500">Checking lifetime question history...</p>
            </div>
          ) : quizResult ? (
            <div className={`p-6 rounded-2xl border text-center space-y-4 animate-in fade-in ${
              quizResult.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="text-4xl">
                {quizResult.isCorrect ? '🎉' : '❌'}
              </div>
              <h3 className={`font-brand text-xl font-bold ${
                quizResult.isCorrect ? 'text-emerald-900' : 'text-rose-900'
              }`}>
                {quizResult.isCorrect ? 'Outstanding! Correct Answer!' : 'Incorrect Answer'}
              </h3>
              <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed">
                {quizResult.isCorrect
                  ? `Congratulations! ৳${quizResult.rewardAmount} voucher has been deposited directly into your Firestore Voucher Wallet! You can apply it on your next fashion order.`
                  : 'Better luck tomorrow! Refresh your fashion and retail knowledge and come back tomorrow for a new question.'}
              </p>

              {currentQuestion?.explanation && (
                <div className="p-3 bg-white/70 rounded-xl text-xs text-gray-600 text-left max-w-lg mx-auto border border-gray-200/50">
                  <strong className="block text-gray-900 mb-0.5">Explanation:</strong>
                  {currentQuestion.explanation}
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className="px-6 py-2.5 rounded-xl bg-[#0E7490] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#0891B2]"
              >
                View Voucher Wallet
              </button>
            </div>
          ) : hasAttemptedToday ? (
            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E8E2D9] text-center space-y-3">
              <Clock className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="font-brand text-lg font-bold text-gray-800">
                You Have Completed Today’s Quiz!
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                You have already taken your quiz for today ({getTodayDateString()}). Return tomorrow for a completely fresh question from Md. Humaun Husen Rahi!
              </p>
            </div>
          ) : !currentQuestion ? (
            <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E8E2D9] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-brand text-lg font-bold text-gray-800">
                Mastery Achieved!
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                You have answered every single question in our current question pool. Stay tuned as new business questions are added by admin!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9]">
                <span className="text-[11px] font-bold text-[#0E7490] uppercase tracking-wider block mb-1">
                  Question:
                </span>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${
                      selectedOption === idx
                        ? 'border-[#0E7490] bg-[#0E7490]/10 text-gray-900 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      selectedOption === idx
                        ? 'border-[#0E7490] bg-[#0E7490] text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null || quizSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {quizSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    <span>Submit Answer &amp; Claim ৳2</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. WEEKLY MYSTERY BOX SECTION */}
      {activeTab === 'mystery-box' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
              Weekly Surprise
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-gray-900">
              The Mystery Fashion Box
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Every customer gets to open one Mystery Box per calendar week ({currentWeek}). Win instant discounts from ৳1 up to ৳80!
            </p>
          </div>

          {/* Reward Pool Description (as required by prompt) */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] text-xs text-gray-600 space-y-2">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
              🎁 Mystery Box Official Reward Pool:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-[#0E7490]">৳80 &amp; ৳70:</span> 1-use voucher
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-[#0E7490]">৳40 &amp; ৳20:</span> 1-use voucher
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800">৳10–৳15:</span> Up to 3 uses
              </div>
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800">৳1–৳9:</span> Up to 3 uses
              </div>
            </div>
          </div>

          {boxError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{boxError}</span>
            </div>
          )}

          {boxResult ? (
            <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/50 border border-amber-200 text-center space-y-4 animate-in fade-in">
              <div className="text-5xl animate-bounce">🎁</div>
              <h3 className="font-brand text-2xl font-bold text-amber-900">
                You Won a ৳{boxResult.wonAmount} Voucher!
              </h3>
              <p className="text-xs text-amber-800 max-w-sm mx-auto leading-relaxed">
                Your Mystery Box reward has been generated and securely saved into Firestore. It is now active in your Voucher Wallet!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('wallet')}
                  className="px-6 py-2.5 rounded-xl bg-[#0E7490] text-white font-bold text-xs uppercase tracking-wider"
                >
                  View in Wallet
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-6 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ) : !boxCanClaim && user ? (
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] text-center space-y-3">
              <div className="text-4xl">⏳</div>
              <h3 className="font-brand text-lg font-bold text-gray-800">
                Box Already Claimed for Week {currentWeek}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                You have already enjoyed your Mystery Box for this week! Your next box unlocks next Monday.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center space-y-6">
              <div className="w-28 h-28 bg-gradient-to-tr from-[#F59E0B] to-[#FDE047] rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-xl border-4 border-white cursor-pointer hover:scale-105 transition-transform"
                   onClick={handleOpenMysteryBox}>
                🎁
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleOpenMysteryBox}
                  disabled={boxOpening}
                  className="px-8 py-4 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {boxOpening ? 'Unlocking Mystery Box...' : 'TAP TO OPEN MYSTERY BOX'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. STREAK & SPECIAL GIFTS */}
      {activeTab === 'streak' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
                Loyalty Program
              </span>
              <h2 className="font-brand text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Purchase Streak &amp; Special Gift
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#0E7490] bg-[#E0F2FE] px-3 py-1 rounded-full">
                Target: 20 Streak
              </span>
            </div>
          </div>

          {/* Rules info */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D9] text-xs text-gray-600 space-y-1.5">
            <p className="font-bold text-gray-800">Streak Program Rules:</p>
            <p>&bull; Streak increments with each qualifying confirmed order.</p>
            <p>&bull; Maximum tracking period: 3 months.</p>
            <p>&bull; At 20 streak: <strong>SPECIAL GIFT</strong> from SAMIA’S CLOSET.</p>
            <p>&bull; A customer must have at least 1 verified purchase to qualify for a gift.</p>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-6 rounded-2xl bg-white border-2 border-[#0E7490]/20 shadow-xs">
              <span className="text-xs font-bold uppercase text-gray-500">Current Streak</span>
              <p className="text-4xl font-extrabold text-[#0E7490] mt-1">{streakCount}</p>
              <span className="text-[11px] text-gray-500">{20 - Math.min(20, streakCount)} orders to gift</span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-gray-500">Total Purchases</span>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">{purchasesCount}</p>
              <span className="text-[11px] text-gray-500">
                {purchasesCount >= 1 ? '✅ Qualified for gifts' : 'Zero purchases (need 1)'}
              </span>
            </div>
          </div>

          {/* Winner announcement if eligible */}
          {isWinner ? (
            <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-4">
              <div className="text-4xl">👑</div>
              <h3 className="font-brand text-2xl font-bold text-amber-900">
                Congratulations! You Qualified for the Special Gift!
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                You reached the coveted 20-order streak. Please connect directly with owner Md. Humaun Husen Rahi on WhatsApp to claim your physical gift.
              </p>
              <a
                href="https://wa.me/8801834012069?text=Hello%20Rahi,%20I%20have%20reached%2020%20streak%20on%20SAMIA'S%20CLOSET%20and%20qualified%20for%20the%20Special%20Gift!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E7490] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#0891B2]"
              >
                <span>Contact with us (WhatsApp)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-gray-500">
              Continue ordering from our fashion catalog to build your streak towards the 20-order Special Gift!
            </div>
          )}
        </div>
      )}

      {/* 4. VOUCHER WALLET */}
      {activeTab === 'wallet' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
                Customer Balance
              </span>
              <h2 className="font-brand text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Voucher Wallet
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="text-xs font-bold text-[#0E7490] hover:underline uppercase tracking-wider"
            >
              Use in Checkout &rarr;
            </button>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs text-gray-600">
            <strong>Inactivity Expiry Policy:</strong> If a customer makes no purchase for one month, accumulated vouchers expire. Active vouchers can be applied during checkout (up to 3 vouchers per order).
          </div>

          {vouchers.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-3xl">🎫</div>
              <p className="text-xs text-gray-500">Your voucher wallet is empty.</p>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className="px-5 py-2 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider"
              >
                Play Daily Quiz to Earn ৳2
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    v.status === 'active'
                      ? 'bg-white border-[#CBD5E1] shadow-2xs'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">৳{v.amount} Discount</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        v.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'used'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">
                      Source: {v.source.replace('_', ' ')} &bull; Uses: {v.usageCount} of {v.maxUsage}
                    </p>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    <span>Issued: {new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
