export interface BotPromptCategory {
  category: string;
  questions: string[];
}

export const botPrompts: BotPromptCategory[] = [
  {
    category: "app_type",
    questions: [
      "What type of app do you want to build? (e.g., social media, e-commerce, productivity, game, fitness, education, etc.)",
      "Is this a business app, personal project, or something else?",
      "Who is the target audience for your app?",
      "What platform will this app be for? Mobile, web, or both?",
      "What's the main purpose of your app in one sentence?",
      "What problem does your app solve for users?",
      "Is this app similar to any existing apps? Which ones?",
      "Will this be a free app, paid app, or have in-app purchases?",
      "What age group is your app targeting?",
      "Is this for consumers, businesses, or both?",
      "What industry is your app in?",
      "Who are your main competitors?",
      "What makes your app different from competitors?",
      "Is this app for personal use or will you publish it?",
      "Do you have a business model in mind?",
    ]
  },
  {
    category: "social_media_features",
    questions: [
      "For your social media app, should users be able to create posts with photos and text?",
      "Should users have profiles they can customize?",
      "Do you want a feed showing posts from people they follow?",
      "Should users be able to like, comment, and share posts?",
      "Do you need direct messaging between users?",
      "Should there be stories or temporary posts that disappear?",
      "Do you want group features or communities?",
      "Should users be able to follow/unfollow each other?",
      "Do you need hashtags or trending topics?",
      "Should there be a discovery or explore page?",
      "Do you want video content support?",
      "Should users be able to go live or stream?",
      "Do you need moderation tools for content?",
      "Should there be a reporting system for inappropriate content?",
      "Do you want verification badges for certain users?",
      "Should users be able to save or bookmark posts?",
      "Do you need a notification system for interactions?",
      "Should there be privacy settings for posts and profiles?",
      "Do you want analytics for users to see their engagement?",
      "Should there be recommended users or content?",
    ]
  },
  {
    category: "ecommerce_features",
    questions: [
      "For your e-commerce app, will you sell physical products, digital products, or both?",
      "Do you need a shopping cart and checkout system?",
      "Should there be product categories and search filters?",
      "Do you want product reviews and ratings?",
      "Should users be able to save items to a wishlist?",
      "Do you need inventory management?",
      "Should there be order tracking for customers?",
      "Do you want to support multiple payment methods?",
      "Should there be discount codes or coupons?",
      "Do you need a seller dashboard if multiple vendors?",
      "Should there be size charts or product variations?",
      "Do you want a recommendation engine for products?",
      "Should there be customer support chat?",
      "Do you need shipping calculator integration?",
      "Should there be a return/refund system?",
      "Do you want email notifications for orders?",
      "Should customers be able to create accounts and save addresses?",
      "Do you need analytics for sales and revenue?",
      "Should there be featured or trending products?",
      "Do you want flash sales or limited-time offers?",
      "Should there be a loyalty or rewards program?",
      "Do you need tax calculation based on location?",
      "Should there be product comparison features?",
      "Do you want social sharing for products?",
      "Should there be abandoned cart recovery?",
    ]
  },
  {
    category: "fitness_features",
    questions: [
      "For your fitness app, do you want to track workouts, steps, calories, or all of them?",
      "Should users be able to set goals and see progress over time?",
      "Do you need workout plans or exercise libraries?",
      "Should there be video demonstrations for exercises?",
      "Do you want to track nutrition and meals?",
      "Should there be a water intake tracker?",
      "Do you need integration with wearables like Apple Watch or Fitbit?",
      "Should users be able to log their weight and body measurements?",
      "Do you want social features like challenges with friends?",
      "Should there be personal trainer or coach features?",
      "Do you need a calendar view for workout scheduling?",
      "Should there be rest day reminders?",
      "Do you want achievement badges or milestones?",
      "Should there be progress photos tracking?",
      "Do you need a community forum or groups?",
      "Should there be workout streaks and consistency tracking?",
      "Do you want AI-generated workout recommendations?",
      "Should there be music integration for workouts?",
      "Do you need timer features for intervals or rest?",
      "Should there be different fitness levels (beginner, intermediate, advanced)?",
    ]
  },
  {
    category: "food_recipe_features",
    questions: [
      "For your food app, will it be for recipes, restaurant delivery, or meal planning?",
      "Should users be able to save favorite recipes or dishes?",
      "Do you need ingredient lists and cooking instructions?",
      "Should there be step-by-step cooking timers?",
      "Do you want nutritional information for recipes?",
      "Should users be able to upload their own recipes?",
      "Do you need a grocery list feature?",
      "Should there be meal planning for the week?",
      "Do you want dietary filter options (vegan, gluten-free, etc.)?",
      "Should there be cooking videos?",
      "Do you need a recipe rating and review system?",
      "Should there be a social aspect where users can share recipes?",
      "Do you want barcode scanning for ingredients?",
      "Should there be portion size calculators?",
      "Do you need restaurant menus and ordering?",
      "Should there be delivery tracking if it's a delivery app?",
      "Do you want table reservation features?",
      "Should there be chef profiles or cooking classes?",
      "Do you need allergy warnings and substitutions?",
      "Should there be a cookbook or collection feature?",
    ]
  },
  {
    category: "game_features",
    questions: [
      "What type of game do you want? (puzzle, action, adventure, arcade, strategy, racing, etc.)",
      "Will it be 2D or 3D?",
      "Do you need scoring and leaderboards?",
      "Should there be multiple levels or stages?",
      "Do you want single-player, multiplayer, or both?",
      "Should there be character customization?",
      "Do you need power-ups or special items?",
      "Should there be achievements or trophies?",
      "Do you want in-game currency or rewards?",
      "Should there be daily challenges or missions?",
      "Do you need save/load game functionality?",
      "Should there be different difficulty levels?",
      "Do you want sound effects and background music?",
      "Should there be a tutorial or how-to-play section?",
      "Do you need social features like friends or clans?",
      "Should there be in-app purchases for items or upgrades?",
      "Do you want ads or will it be ad-free?",
      "Should there be tournaments or competitions?",
      "Do you need offline play capability?",
      "Should there be animated cutscenes or story mode?",
    ]
  },
  {
    category: "productivity_features",
    questions: [
      "For your productivity app, will it focus on tasks, notes, reminders, or all of them?",
      "Should tasks have due dates and priorities?",
      "Do you need categories or projects to organize things?",
      "Should there be recurring tasks or reminders?",
      "Do you want collaboration features for teams?",
      "Should there be a calendar view?",
      "Do you need file attachments for tasks or notes?",
      "Should there be tagging and labels?",
      "Do you want search and filter capabilities?",
      "Should there be progress tracking for projects?",
      "Do you need time tracking features?",
      "Should there be notifications and alerts?",
      "Do you want cloud sync across devices?",
      "Should there be dark mode for late-night use?",
      "Do you need widgets for quick access?",
      "Should there be templates for common tasks?",
      "Do you want voice input for notes?",
      "Should there be a focus or pomodoro timer?",
      "Do you need analytics on productivity?",
      "Should there be integration with other apps like Google Calendar?",
    ]
  },
  {
    category: "education_features",
    questions: [
      "For your education app, what subjects or topics will it cover?",
      "Will there be video lessons or just text content?",
      "Should there be quizzes and tests?",
      "Do you need progress tracking for students?",
      "Should there be certificates upon completion?",
      "Do you want live classes or pre-recorded content?",
      "Should there be discussion forums or Q&A?",
      "Do you need homework or assignment submission?",
      "Should there be a gradebook or scoring system?",
      "Do you want gamification like points and badges?",
      "Should there be different learning paths or courses?",
      "Do you need parent or teacher dashboards?",
      "Should there be flashcards or study tools?",
      "Do you want peer-to-peer learning features?",
      "Should there be downloadable content for offline learning?",
      "Do you need scheduling for classes?",
      "Should there be one-on-one tutoring options?",
      "Do you want resource libraries (PDFs, videos, etc.)?",
      "Should there be language learning features?",
      "Do you need accessibility features for different learners?",
    ]
  },
  {
    category: "messaging_chat_features",
    questions: [
      "For your messaging app, should it support one-on-one chats, group chats, or both?",
      "Do you want features like photo sharing, voice messages, or video calls?",
      "Should there be read receipts and typing indicators?",
      "Do you need end-to-end encryption for privacy?",
      "Should users be able to share their location?",
      "Do you want emoji and sticker support?",
      "Should there be message deletion or editing?",
      "Do you need file sharing capabilities?",
      "Should there be status updates or stories?",
      "Do you want voice and video calling?",
      "Should there be chat backups to cloud?",
      "Do you need contact syncing?",
      "Should there be group admin controls?",
      "Do you want disappearing messages?",
      "Should there be channels or broadcast lists?",
      "Do you need notification customization?",
      "Should there be chat themes and customization?",
      "Do you want search within conversations?",
      "Should there be message reactions?",
      "Do you need two-factor authentication?",
    ]
  },
  {
    category: "music_media_features",
    questions: [
      "For your music app, will it be for streaming, downloads, or both?",
      "Should users be able to create playlists?",
      "Do you need a music library organization system?",
      "Should there be recommendations based on listening history?",
      "Do you want social features like sharing songs?",
      "Should there be lyrics display?",
      "Do you need podcast support?",
      "Should there be offline listening mode?",
      "Do you want artist pages and bios?",
      "Should there be a search function for songs and artists?",
      "Do you need equalizer or audio settings?",
      "Should there be radio or curated stations?",
      "Do you want collaborative playlists?",
      "Should there be concert or event information?",
      "Do you need music discovery features?",
      "Should there be sleep timer functionality?",
      "Do you want crossfade between tracks?",
      "Should there be queue management?",
      "Do you need integration with other music services?",
      "Should there be subscription tiers?",
    ]
  },
  {
    category: "travel_features",
    questions: [
      "For your travel app, will it focus on flight booking, hotel booking, or both?",
      "Should there be itinerary planning features?",
      "Do you need map and navigation integration?",
      "Should users be able to save favorite destinations?",
      "Do you want travel guides and recommendations?",
      "Should there be reviews and ratings for places?",
      "Do you need currency converter?",
      "Should there be weather information?",
      "Do you want activity and tour booking?",
      "Should there be a trip sharing feature?",
      "Do you need flight tracking and alerts?",
      "Should there be offline map access?",
      "Do you want budget tracking for trips?",
      "Should there be photo journals or travel blogs?",
      "Do you need translation features?",
      "Should there be packing lists?",
      "Do you want local event information?",
      "Should there be restaurant recommendations?",
      "Do you need travel insurance options?",
      "Should there be group trip planning?",
    ]
  },
  {
    category: "dating_features",
    questions: [
      "For your dating app, should users swipe on profiles or browse differently?",
      "Do you need matching algorithms?",
      "Should there be profile verification?",
      "Do you want video chat capabilities?",
      "Should there be icebreaker questions or prompts?",
      "Do you need safety features and reporting?",
      "Should there be filters for preferences?",
      "Do you want premium subscription features?",
      "Should there be event or group meetup options?",
      "Do you need location-based matching?",
      "Should there be conversation starters?",
      "Do you want photo verification to prevent catfishing?",
      "Should there be like limits or unlimited likes?",
      "Do you need blocking and unmatching?",
      "Should there be profile badges or interests?",
      "Do you want voice notes in messaging?",
      "Should there be relationship goals indicators?",
      "Do you need age and distance filters?",
      "Should there be success story features?",
      "Do you want incognito or private mode?",
    ]
  },
  {
    category: "news_reading_features",
    questions: [
      "For your news app, will content be curated or user-generated?",
      "Should there be different news categories?",
      "Do you need personalized news feed based on interests?",
      "Should users be able to save articles for later?",
      "Do you want push notifications for breaking news?",
      "Should there be comments or discussion sections?",
      "Do you need dark mode for reading?",
      "Should there be text-to-speech for articles?",
      "Do you want video news content?",
      "Should there be different news sources?",
      "Do you need offline reading mode?",
      "Should there be sharing to social media?",
      "Do you want bookmarking and favorites?",
      "Should there be trending topics?",
      "Do you need search functionality?",
      "Should there be newsletter subscriptions?",
      "Do you want reader mode for clean reading?",
      "Should there be font size adjustments?",
      "Do you need fact-checking indicators?",
      "Should there be local news based on location?",
    ]
  },
  {
    category: "health_medical_features",
    questions: [
      "For your health app, what will be the main focus? (tracking, telemedicine, records, etc.)",
      "Should users be able to track symptoms?",
      "Do you need appointment scheduling with doctors?",
      "Should there be medication reminders?",
      "Do you want health records storage?",
      "Should there be video consultations?",
      "Do you need prescription management?",
      "Should there be health metrics tracking (blood pressure, glucose, etc.)?",
      "Do you want emergency contact features?",
      "Should there be doctor search and reviews?",
      "Do you need insurance information integration?",
      "Should there be lab results access?",
      "Do you want health tips and articles?",
      "Should there be mental health tracking?",
      "Do you need privacy and HIPAA compliance?",
      "Should there be family health profiles?",
      "Do you want wearable device integration?",
      "Should there be health goals and reminders?",
      "Do you need second opinion features?",
      "Should there be vaccination records?",
    ]
  },
  {
    category: "finance_banking_features",
    questions: [
      "For your finance app, will it be for budgeting, investing, banking, or all?",
      "Should users be able to link bank accounts?",
      "Do you need expense tracking and categorization?",
      "Should there be bill reminders?",
      "Do you want budget creation and monitoring?",
      "Should there be investment portfolio tracking?",
      "Do you need financial goal setting?",
      "Should there be credit score monitoring?",
      "Do you want spending insights and analytics?",
      "Should there be receipt scanning?",
      "Do you need split bill features?",
      "Should there be cryptocurrency tracking?",
      "Do you want loan calculators?",
      "Should there be tax preparation help?",
      "Do you need security features like PIN or biometric?",
      "Should there be automatic savings features?",
      "Do you want investment recommendations?",
      "Should there be peer-to-peer payment?",
      "Do you need multi-currency support?",
      "Should there be financial advisor chat?",
    ]
  },
  {
    category: "real_estate_features",
    questions: [
      "For your real estate app, is it for buying, renting, or both?",
      "Should there be property listings with photos?",
      "Do you need map view for properties?",
      "Should users be able to save favorite properties?",
      "Do you want virtual tours or 3D views?",
      "Should there be filters for price, location, size?",
      "Do you need mortgage calculator?",
      "Should there be agent profiles and contact?",
      "Do you want neighborhood information?",
      "Should there be price history and trends?",
      "Do you need scheduling for property viewings?",
      "Should there be document upload for applications?",
      "Do you want property comparison features?",
      "Should there be alerts for new listings?",
      "Do you need rating system for properties?",
      "Should there be lease agreement features?",
      "Do you want rent payment integration?",
      "Should there be maintenance request system?",
      "Do you need tenant screening?",
      "Should there be open house scheduling?",
    ]
  },
  {
    category: "photography_features",
    questions: [
      "For your photography app, is it for editing, sharing, or both?",
      "Should there be filters and effects?",
      "Do you need professional editing tools?",
      "Should users be able to create albums?",
      "Do you want social sharing capabilities?",
      "Should there be cloud storage for photos?",
      "Do you need photo printing services?",
      "Should there be AI enhancement features?",
      "Do you want collage and layout tools?",
      "Should there be watermark options?",
      "Do you need RAW file support?",
      "Should there be batch editing?",
      "Do you want tutorials for photography?",
      "Should there be community features and contests?",
      "Do you need copyright protection?",
      "Should there be selling photos marketplace?",
      "Do you want geotagging for photos?",
      "Should there be face recognition and tagging?",
      "Do you need video editing as well?",
      "Should there be photo backup automation?",
    ]
  },
  {
    category: "event_planning_features",
    questions: [
      "For your event planning app, what types of events? (weddings, parties, conferences, etc.)",
      "Should there be guest list management?",
      "Do you need RSVP tracking?",
      "Should there be invitation creation and sending?",
      "Do you want vendor directory and booking?",
      "Should there be budget tracking?",
      "Do you need timeline and checklist features?",
      "Should there be seating chart tools?",
      "Do you want event countdown?",
      "Should there be registry integration for weddings?",
      "Do you need venue search and booking?",
      "Should there be photo sharing for attendees?",
      "Do you want schedule and agenda features?",
      "Should there be ticket selling for events?",
      "Do you need QR code check-in?",
      "Should there be event feedback and surveys?",
      "Do you want live streaming options?",
      "Should there be event analytics?",
      "Do you need team collaboration tools?",
      "Should there be weather forecasts for outdoor events?",
    ]
  },
  {
    category: "job_career_features",
    questions: [
      "For your job app, is it for job searching, networking, or career development?",
      "Should there be job listings and applications?",
      "Do you need resume builder?",
      "Should there be company reviews and ratings?",
      "Do you want salary information and negotiation tips?",
      "Should there be networking features?",
      "Do you need interview preparation resources?",
      "Should there be job alerts based on preferences?",
      "Do you want skill assessment tests?",
      "Should there be career counseling?",
      "Do you need portfolio showcase?",
      "Should there be recruiter messaging?",
      "Do you want job application tracking?",
      "Should there be professional profile creation?",
      "Do you need industry news and trends?",
      "Should there be certification courses?",
      "Do you want mentorship matching?",
      "Should there be freelance job options?",
      "Do you need remote work filters?",
      "Should there be career path recommendations?",
    ]
  },
  {
    category: "pet_care_features",
    questions: [
      "For your pet care app, what will be the main focus?",
      "Should there be pet profile creation?",
      "Do you need vaccination and vet appointment tracking?",
      "Should there be feeding and medication reminders?",
      "Do you want pet health records?",
      "Should there be grooming appointment booking?",
      "Do you need pet walking or sitting services?",
      "Should there be training tips and videos?",
      "Do you want pet social networking?",
      "Should there be lost pet reporting?",
      "Do you need pet adoption features?",
      "Should there be pet supply shopping?",
      "Do you want vet consultation chat?",
      "Should there be pet activity tracking?",
      "Do you need pet insurance information?",
      "Should there be breed information database?",
      "Do you want photo gallery for pets?",
      "Should there be pet community forums?",
      "Do you need emergency contact features?",
      "Should there be pet-friendly place finder?",
    ]
  },
  {
    category: "features",
    questions: [
      "What are the main features you want in your app?",
      "Can you list 3-5 core functionalities your app must have?",
      "Do you need user authentication (login/signup)?",
      "Will users need to save or manage data?",
      "Do you need push notifications or real-time updates?",
      "Should users be able to upload photos or files?",
      "Do you need payment integration (like Stripe or PayPal)?",
      "Will there be a chat or messaging feature?",
      "Should users be able to create posts, articles, or content?",
      "Do you want a feed or timeline feature?",
      "Should users have profiles they can customize?",
      "Do you need a search or filter feature?",
      "Will there be categories or tags for organizing things?",
      "Should users be able to bookmark or favorite items?",
      "Do you need location-based features or maps?",
      "Should there be sharing to social media?",
      "Do you need offline functionality?",
      "Should there be dark mode?",
      "Do you want multi-language support?",
      "Should there be accessibility features?",
      "Do you need data export options?",
      "Should there be tutorial or onboarding?",
      "Do you want analytics dashboard?",
      "Should there be settings customization?",
      "Do you need API integrations?",
    ]
  },
  {
    category: "design",
    questions: [
      "What design style do you prefer? (modern, minimal, colorful, professional, playful, futuristic)",
      "Do you have a color scheme in mind? (or any specific brand colors)",
      "Can you describe the overall look and feel you want?",
      "Do you have any apps that inspire your design? (like Instagram, Twitter, Netflix, etc.)",
      "Should it be dark mode, light mode, or both?",
      "Do you want animations and smooth transitions?",
      "Should the design be simple and clean, or feature-rich?",
      "What should be the primary brand color?",
      "Do you want rounded corners or sharp edges?",
      "Should the app feel playful or serious?",
      "Do you want large buttons or compact interface?",
      "Should there be gradients or flat colors?",
      "Do you want card-based layouts or list views?",
      "Should icons be outlined or filled?",
      "Do you want a bottom navigation bar or hamburger menu?",
      "Should the app have a unique visual identity?",
      "Do you want illustrations or photos?",
      "Should there be background patterns or solid colors?",
      "Do you want bold typography or subtle fonts?",
      "Should the design prioritize aesthetics or functionality?",
      "Do you want frosted glass effects or solid backgrounds?",
      "Should there be shadows and depth?",
      "Do you want a minimalist or maximalist approach?",
      "Should the design follow Material Design or iOS guidelines?",
      "Do you want custom icons or standard ones?",
    ]
  },
  {
    category: "user_flow",
    questions: [
      "Describe the main user journey - what happens when someone opens your app?",
      "What's the first screen users should see after logging in?",
      "How do users navigate through the app? (tabs, menu, swipe, etc.)",
      "What actions can users take on the main screen?",
      "Describe a typical user session from start to finish.",
      "What should happen when a user clicks the main button?",
      "How do users discover new content in your app?",
      "What's the path to complete the main task?",
      "Should there be a search-first approach or browse-first?",
      "How many steps should signup take?",
      "What happens after a user completes an action?",
      "Should there be quick actions or shortcuts?",
      "How do users get back to the home screen?",
      "What should the onboarding flow look like?",
      "How do users access their profile or settings?",
      "What's the navigation hierarchy?",
      "Should there be breadcrumbs or back buttons?",
      "How do users switch between different sections?",
      "What triggers notifications or alerts?",
      "How do users update their information?",
    ]
  },
  {
    category: "technical",
    questions: [
      "Do you need the app to work offline?",
      "Will you integrate with any third-party services? (Google, Facebook, APIs, etc.)",
      "Do you need admin controls or a dashboard?",
      "Should the app have different user roles? (admin, user, moderator, etc.)",
      "Do you need analytics or user tracking?",
      "Should data sync across multiple devices?",
      "Do you need cloud storage for user data?",
      "Should there be automatic backups?",
      "Do you need real-time synchronization?",
      "Should there be two-factor authentication?",
      "Do you need biometric login (fingerprint, face ID)?",
      "Should the app support multiple languages?",
      "Do you need right-to-left language support?",
      "Should there be API rate limiting?",
      "Do you need data encryption?",
      "Should there be user session management?",
      "Do you need crash reporting?",
      "Should there be A/B testing capabilities?",
      "Do you need push notification system?",
      "Should there be email verification?",
    ]
  },
  {
    category: "content",
    questions: [
      "What kind of content will be displayed in your app?",
      "Will users create content or is it pre-loaded?",
      "Do you need categories or filters for organizing content?",
      "Should users be able to search for content?",
      "Do you want social features like likes, comments, or shares?",
      "Can users follow other users or topics?",
      "Should there be trending or recommended content?",
      "How will content be moderated?",
      "Should there be content reporting features?",
      "Do you need content expiration or archiving?",
      "Should content be public or private?",
      "Do you want featured or highlighted content?",
      "Should there be content curation?",
      "Do you need content versioning?",
      "Should users be able to edit or delete content?",
      "Do you want content scheduling?",
      "Should there be content analytics?",
      "Do you need content backup?",
      "Should there be content templates?",
      "Do you want user-generated vs. admin content separation?",
    ]
  },
  {
    category: "monetization",
    questions: [
      "How do you plan to monetize this app?",
      "Will it be a free app with ads?",
      "Do you want a premium subscription model?",
      "Should there be in-app purchases?",
      "Do you need a freemium model (free basic, paid premium)?",
      "Will there be different subscription tiers?",
      "Do you want one-time purchase options?",
      "Should there be a trial period?",
      "Do you need referral or affiliate programs?",
      "Should there be sponsor or partner features?",
      "Do you want transaction fees for marketplace features?",
      "Should there be tip or donation options?",
      "Do you need payment gateway integration?",
      "Should there be invoice generation?",
      "Do you want subscription management for users?",
      "Should there be family or group plans?",
      "Do you need refund handling?",
      "Should there be promotional pricing?",
      "Do you want loyalty rewards?",
      "Should there be lifetime access options?",
    ]
  },
  {
    category: "security_privacy",
    questions: [
      "What level of security do you need for user data?",
      "Should there be privacy settings for user profiles?",
      "Do you need data encryption at rest and in transit?",
      "Should there be account deletion features?",
      "Do you need data export for GDPR compliance?",
      "Should there be permission controls for features?",
      "Do you want audit logs for admin actions?",
      "Should there be content visibility controls?",
      "Do you need user blocking and reporting?",
      "Should there be secure password requirements?",
      "Do you want OAuth integration?",
      "Should there be device management?",
      "Do you need IP-based restrictions?",
      "Should there be suspicious activity detection?",
      "Do you want session timeout features?",
      "Should there be email/SMS verification?",
      "Do you need security questions for recovery?",
      "Should there be privacy policy and terms display?",
      "Do you want cookie consent management?",
      "Should there be data anonymization options?",
    ]
  },
  {
    category: "notifications",
    questions: [
      "What types of notifications should users receive?",
      "Should there be push notifications?",
      "Do you need email notifications?",
      "Should there be SMS notifications?",
      "Do you want in-app notifications?",
      "Should users be able to customize notification preferences?",
      "Do you need real-time alerts?",
      "Should there be scheduled notifications?",
      "Do you want notification grouping?",
      "Should there be notification sounds and vibrations?",
      "Do you need quiet hours or do-not-disturb?",
      "Should there be notification badges on app icon?",
      "Do you want rich notifications with images?",
      "Should there be action buttons in notifications?",
      "Do you need notification history?",
      "Should there be priority levels for notifications?",
      "Do you want notification templates?",
      "Should there be geofence-based notifications?",
      "Do you need notification analytics?",
      "Should there be notification scheduling?",
    ]
  },
  {
    category: "performance",
    questions: [
      "How important is app loading speed to you?",
      "Should the app work on slow internet connections?",
      "Do you need image optimization and compression?",
      "Should there be lazy loading for content?",
      "Do you want caching strategies?",
      "Should the app support low-end devices?",
      "Do you need bandwidth optimization?",
      "Should there be progressive loading?",
      "Do you want app size optimization?",
      "Should there be performance monitoring?",
      "Do you need error tracking?",
      "Should there be loading indicators?",
      "Do you want skeleton screens while loading?",
      "Should there be retry mechanisms for failed requests?",
      "Do you need graceful degradation?",
      "Should there be connection status indicators?",
      "Do you want offline queueing for actions?",
      "Should there be data prefetching?",
      "Do you need memory optimization?",
      "Should there be battery optimization?",
    ]
  },
  {
    category: "admin_features",
    questions: [
      "What admin controls do you need?",
      "Should admins be able to manage users?",
      "Do you need content moderation tools?",
      "Should there be an admin dashboard?",
      "Do you want user analytics and insights?",
      "Should admins be able to send announcements?",
      "Do you need role-based access control?",
      "Should there be audit trails?",
      "Do you want bulk action capabilities?",
      "Should admins be able to view user activity?",
      "Do you need reporting and export tools?",
      "Should there be system health monitoring?",
      "Do you want configuration management?",
      "Should admins be able to feature content?",
      "Do you need user verification tools?",
      "Should there be ban/suspend capabilities?",
      "Do you want customer support tools?",
      "Should there be content scheduling for admins?",
      "Do you need A/B testing controls?",
      "Should there be revenue tracking?",
    ]
  },
  {
    category: "accessibility",
    questions: [
      "How important is accessibility for your app?",
      "Should there be screen reader support?",
      "Do you need adjustable font sizes?",
      "Should there be high contrast mode?",
      "Do you want voice control features?",
      "Should there be closed captions for videos?",
      "Do you need keyboard navigation support?",
      "Should there be color blind friendly modes?",
      "Do you want haptic feedback?",
      "Should there be audio descriptions?",
      "Do you need focus indicators?",
      "Should there be simple language mode?",
      "Do you want gesture alternatives?",
      "Should there be magnification support?",
      "Do you need dyslexia-friendly fonts?",
      "Should there be reading assistance?",
      "Do you want ARIA labels for web?",
      "Should there be alternative text for images?",
      "Do you need accessibility audit reports?",
      "Should there be WCAG compliance?",
    ]
  },
  {
    category: "localization",
    questions: [
      "What languages should your app support?",
      "Should there be automatic language detection?",
      "Do you need right-to-left text support?",
      "Should there be regional content variations?",
      "Do you want currency localization?",
      "Should there be date/time format localization?",
      "Do you need number format localization?",
      "Should there be translated content?",
      "Do you want cultural customization?",
      "Should there be local payment methods?",
      "Do you need local regulations compliance?",
      "Should there be time zone handling?",
      "Do you want regional app store optimization?",
      "Should there be local customer support?",
      "Do you need measurement unit conversion?",
      "Should there be local holiday recognition?",
      "Do you want address format localization?",
      "Should there be phone number format localization?",
      "Do you need local tax calculation?",
      "Should there be language-specific features?",
    ]
  },
  {
    category: "onboarding",
    questions: [
      "How should new users be introduced to your app?",
      "Should there be a tutorial or walkthrough?",
      "Do you want interactive onboarding?",
      "Should there be skip option for onboarding?",
      "Do you need to collect user preferences during setup?",
      "Should there be sample data to explore?",
      "Do you want progress indicators for setup?",
      "Should there be welcome messages?",
      "Do you need account verification during onboarding?",
      "Should there be profile setup wizard?",
      "Do you want feature highlights?",
      "Should there be video introductions?",
      "Do you need permission requests explained?",
      "Should there be quick start guides?",
      "Do you want tooltips for first-time use?",
      "Should there be checklist for getting started?",
      "Do you need onboarding customization per user type?",
      "Should there be help center access during onboarding?",
      "Do you want social proof during onboarding?",
      "Should there be gamified onboarding?",
    ]
  },
  {
    category: "analytics_tracking",
    questions: [
      "What user behavior do you want to track?",
      "Should there be event tracking?",
      "Do you need conversion tracking?",
      "Should there be user journey mapping?",
      "Do you want funnel analysis?",
      "Should there be retention metrics?",
      "Do you need engagement metrics?",
      "Should there be revenue tracking?",
      "Do you want custom event tracking?",
      "Should there be cohort analysis?",
      "Do you need A/B test results tracking?",
      "Should there be crash analytics?",
      "Do you want performance metrics?",
      "Should there be user demographics tracking?",
      "Do you need session recording?",
      "Should there be heatmaps?",
      "Do you want error tracking?",
      "Should there be custom dashboards?",
      "Do you need data export for analysis?",
      "Should there be real-time analytics?",
    ]
  },
  {
    category: "integration",
    questions: [
      "What third-party services need integration?",
      "Should there be Google login?",
      "Do you need Facebook integration?",
      "Should there be Apple Sign-In?",
      "Do you want Twitter integration?",
      "Should there be payment gateway (Stripe/PayPal)?",
      "Do you need email service integration?",
      "Should there be SMS gateway?",
      "Do you want cloud storage integration?",
      "Should there be calendar sync?",
      "Do you need map services integration?",
      "Should there be analytics tools integration?",
      "Do you want CRM integration?",
      "Should there be marketing automation?",
      "Do you need customer support tools?",
      "Should there be social media APIs?",
      "Do you want shipping provider integration?",
      "Should there be accounting software integration?",
      "Do you need video conferencing integration?",
      "Should there be weather API integration?",
    ]
  },
  {
    category: "specific_app_followup",
    questions: [
      "Great! Can you tell me more about the specific features of this type of app?",
      "How will users interact with the main feature?",
      "Tell me more about how that should work step by step.",
      "What happens after a user completes that action?",
      "Should that feature be on the home screen or in a separate section?",
      "How often will users use this feature?",
      "What's the most important aspect of this feature?",
      "Are there any similar apps that do this well?",
      "What would make this feature stand out?",
      "How should errors or issues be handled in this feature?",
    ]
  },
  {
    category: "details",
    questions: [
      "Tell me more about the specific features you mentioned.",
      "Can you elaborate on how that would work?",
      "What happens after a user does that action?",
      "Are there any unique or special features that make your app different?",
      "What problems does your app solve for users?",
      "Any other important details I should know?",
      "How should edge cases be handled?",
      "What's the expected user behavior?",
      "Are there any constraints or limitations?",
      "What's the priority order of features?",
      "How should the app handle errors?",
      "What's the expected data volume?",
      "Are there any compliance requirements?",
      "What's the launch timeline?",
      "Who are the stakeholders?",
      "What's the success criteria?",
      "Are there any integration dependencies?",
      "What's the maintenance plan?",
      "Are there any scalability considerations?",
      "What's the budget constraint?",
    ]
  },
  {
    category: "encouragement",
    questions: [
      "Great! Can you tell me more about the features you want?",
      "That's helpful! What kind of design style do you prefer?",
      "Good progress! Can you describe the main user flow?",
      "Nice! What colors or theme would you like?",
      "Tell me more about who will use this app and how.",
      "Excellent! Any other important features I should know about?",
      "Perfect! Can you describe the visual design in more detail?",
      "Wonderful! What should happen when users first open the app?",
      "Love it! How should users navigate between different sections?",
      "That sounds interesting! What makes your app unique?",
      "Awesome! Tell me more about that feature.",
      "Fantastic idea! How do you envision users interacting with it?",
      "I'm getting a clear picture! What else is important?",
      "This is coming together nicely! Any other key features?",
      "Great detail! What about the user experience?",
      "You're doing great! Keep going with more details.",
      "This sounds amazing! Tell me more.",
      "Perfect explanation! What else should I know?",
      "I love the direction! What's next?",
      "Excellent thinking! Continue describing your vision.",
      "That's very clear! What other aspects are important?",
      "Wonderful detail! Keep sharing your ideas.",
      "I'm understanding this well! What else?",
      "Great vision! Tell me about other features.",
      "You're being very thorough! Continue please.",
    ]
  },
  {
    category: "completion",
    questions: [
      "Perfect! I have all the information I need. Click 'Build Now' to start building your app!",
      "Excellent! I have a complete picture of your app. Ready to build when you are!",
      "Amazing! Your app description is complete. Click 'Build Now' to get started!",
      "Great job! You've provided all the details needed. Hit 'Build Now' to begin!",
      "Wonderful! I have everything I need to build your app. Click 'Build Now' to proceed!",
      "Fantastic! Your app vision is crystal clear. Ready to start building!",
      "Perfect timing! We have all the details. Click 'Build Now' to bring your app to life!",
      "Excellent work describing your app! Click 'Build Now' to start the development!",
      "You've covered everything! Let's build this amazing app. Click 'Build Now'!",
      "All set! Your app details are complete. Click 'Build Now' to begin!",
    ]
  },
  {
    category: "need_more_details",
    questions: [
      "I need more information to build a great app. Can you tell me more about what you want?",
      "That's not enough detail. Please describe your app idea more clearly - what should it do?",
      "I don't understand. Can you explain your app idea in a complete sentence?",
      "Please provide real information about your app. What is the main purpose of your app?",
      "Help me understand - what exactly do you want your app to do? Be specific.",
      "Can you elaborate on that? I need more details to help you.",
      "That's a bit vague. Can you describe your app in more detail?",
      "I need clearer information. What features do you want in your app?",
      "Please give me more context. What kind of app are you building?",
      "Can you expand on that idea? I need more specifics.",
      "That's too brief. Please tell me more about your app concept.",
      "I need a better understanding. Can you describe your app's main functionality?",
      "Please provide more details. What should users be able to do?",
      "Can you be more specific about what you want?",
      "I'm not getting enough information. Tell me about your app's purpose.",
    ]
  },
  {
    category: "clarification_needed",
    questions: [
      "I'm not sure I understand. Can you rephrase that and tell me more about your app?",
      "That doesn't make sense to me. Please describe what your app should actually do.",
      "I need clearer information. What is your app about? What features does it need?",
      "Please give me meaningful details about your app idea, not random words.",
      "I can only help if you describe a real app idea. What do you want to build?",
      "That's confusing. Can you explain your app concept more clearly?",
      "I don't follow. Can you describe your app in a different way?",
      "Please clarify - what type of app are you trying to create?",
      "I need you to be more specific. What should your app do?",
      "That's unclear to me. Can you provide actual details about your app?",
      "I'm having trouble understanding. Can you describe your app idea step by step?",
      "Please use complete sentences to describe your app.",
      "Can you give me real information about what you want to build?",
      "I need actual app details, not just random text.",
      "Please describe a genuine app idea with real features.",
    ]
  },
  {
    category: "welcome",
    questions: [
      "Hey! I'm your app builder 👋",
      "Welcome! I'm here to help you build your dream app 🚀",
      "Hi there! Let's create something amazing together ✨",
      "Hello! Ready to build an awesome app? Let's get started! 🎉",
      "Welcome to Pro Builder! I'm excited to help you create your app! 💡",
      "Hi! I'm your personal app builder assistant. Let's make magic happen! ⚡",
      "Hey there! Let's bring your app idea to life! 🌟",
      "Welcome! I'm here to turn your vision into reality! 🚀",
      "Hello! Let's build something incredible together! 💪",
      "Hi! Ready to create an amazing app? I'm here to help! 🎯",
    ]
  },
  {
    category: "start",
    questions: [
      "Please describe your app idea clearly. What do you want to build?",
      "Tell me about the app you want to build. What's the main idea?",
      "What app would you like to create? Describe it in detail.",
      "Let's start! What's your app about?",
      "Tell me your app vision. What should it do?",
      "Describe your app idea - I'm all ears!",
      "What kind of app are you thinking of building?",
      "Share your app concept with me. What's the big idea?",
      "Let's begin! What app do you have in mind?",
      "Tell me everything about your app idea!",
    ]
  },
  {
    category: "platform_specific",
    questions: [
      "Will this be an iOS app, Android app, or both?",
      "Should it work on tablets as well as phones?",
      "Do you need a web version too?",
      "What's the minimum device version you want to support?",
      "Should it work on desktop browsers?",
      "Do you need a progressive web app (PWA)?",
      "Should it be responsive across all screen sizes?",
      "Do you want native app or hybrid app?",
      "Should it support both portrait and landscape modes?",
      "Do you need specific platform features (like Apple Pay, Google Pay)?",
    ]
  },
  {
    category: "timeline_budget",
    questions: [
      "When do you need this app to be ready?",
      "Do you have a deadline in mind?",
      "Is this urgent or can we take time to perfect it?",
      "What's your timeline for launch?",
      "When would you like to start using this app?",
      "Are there any important dates we should aim for?",
      "How soon do you need the MVP (minimum viable product)?",
      "What's your ideal launch date?",
      "Do you have milestones or phases in mind?",
      "When do you want to start beta testing?",
    ]
  },
  {
    category: "target_market",
    questions: [
      "Who is your primary target user?",
      "What age group will use this app most?",
      "Is this for a specific geographic region?",
      "What's the demographic of your users?",
      "Are you targeting businesses or consumers?",
      "What's the education level of your typical user?",
      "What devices do your users typically use?",
      "What's the tech-savviness of your audience?",
      "Are there any accessibility requirements for your users?",
      "What languages do your target users speak?",
    ]
  },
  {
    category: "competition",
    questions: [
      "Do you have competitors? Who are they?",
      "What apps are similar to yours?",
      "What do you like about competitor apps?",
      "What don't you like about existing solutions?",
      "How will your app be better than alternatives?",
      "What's missing in current market solutions?",
      "Which features from competitors do you want?",
      "How can we differentiate your app?",
      "What unique value will your app provide?",
      "Why would users choose your app over others?",
    ]
  },
  {
    category: "business_model",
    questions: [
      "How will this app make money?",
      "Is this a commercial or personal project?",
      "Do you have a business plan?",
      "What's your revenue model?",
      "Will you have paying customers?",
      "Do you need invoice or billing features?",
      "Will there be multiple pricing tiers?",
      "Do you need a marketplace model?",
      "Will you take commissions on transactions?",
      "What's your customer acquisition strategy?",
    ]
  },
  {
    category: "support_maintenance",
    questions: [
      "Do you need customer support features?",
      "Should there be in-app help or FAQ?",
      "Do you want live chat support?",
      "Should there be a contact form?",
      "Do you need a ticketing system?",
      "Should there be help documentation?",
      "Do you want tutorial videos?",
      "Should there be community forums?",
      "Do you need email support integration?",
      "Should there be feedback collection?",
    ]
  }
];

// Validation functions (same as before)
const isValidMessage = (message: string): boolean => {
  const trimmed = message.trim();
  if (trimmed.length < 5) return false;
  if (/^[0-9!@#$%^&*()_+=\-{}\[\]:;"'<>,.?\/\\|`~]+$/.test(trimmed)) return false;
  const words = trimmed.toLowerCase().split(/\s+/);
  if (words.length > 1 && words.every(w => w === words[0])) return false;
  const hasVowels = /[aeiou]/i.test(trimmed);
  if (!hasVowels && trimmed.length > 5) return false;
  const meaningfulWords = /\b(app|application|game|website|tool|feature|user|need|want|help|build|create|make|design|page|screen|button|login|signup|chat|message|payment|store|shop|social|media|photo|video|music|food|fitness|health|education|learn|teach|work|business|money|sell|buy)\b/i;
  if (!meaningfulWords.test(trimmed)) {
    const wordCount = words.filter(w => w.length > 2).length;
    if (wordCount < 2) return false;
  }
  return true;
};

const detectAppType = (message: string): string | null => {
  const msg = message.toLowerCase();
  if (/\b(social|instagram|facebook|twitter|tiktok|snapchat|feed|post|follow|like|comment|share)\b/i.test(msg)) return "social_media";
  if (/\b(shop|store|ecommerce|e-commerce|buy|sell|product|cart|checkout|payment|stripe)\b/i.test(msg)) return "ecommerce";
  if (/\b(fitness|workout|exercise|gym|health|calories|steps|tracking|running)\b/i.test(msg)) return "fitness";
  if (/\b(food|recipe|cook|meal|restaurant|delivery|menu|dish)\b/i.test(msg)) return "food";
  if (/\b(game|play|player|score|level|3d|2d|arcade|puzzle)\b/i.test(msg)) return "game";
  if (/\b(learn|education|course|lesson|quiz|study|student|teacher|school)\b/i.test(msg)) return "education";
  if (/\b(todo|task|note|reminder|calendar|schedule|planner|organize)\b/i.test(msg)) return "productivity";
  if (/\b(music|song|playlist|spotify|audio|podcast|video|stream)\b/i.test(msg)) return "media";
  if (/\b(chat|message|messaging|whatsapp|telegram|dm|conversation)\b/i.test(msg)) return "chat";
  if (/\b(news|article|blog|read|rss|headline)\b/i.test(msg)) return "news";
  if (/\b(travel|trip|flight|hotel|booking|vacation|destination)\b/i.test(msg)) return "travel";
  if (/\b(dating|match|swipe|tinder|bumble|profile|meet)\b/i.test(msg)) return "dating";
  if (/\b(photo|camera|picture|gallery|edit|filter)\b/i.test(msg)) return "photography";
  if (/\b(event|party|wedding|conference|rsvp|guest)\b/i.test(msg)) return "event";
  if (/\b(job|career|resume|hire|recruit|interview)\b/i.test(msg)) return "job";
  if (/\b(pet|dog|cat|vet|animal)\b/i.test(msg)) return "pet";
  if (/\b(money|bank|budget|invest|finance|stock)\b/i.test(msg)) return "finance";
  if (/\b(house|property|rent|buy|real estate)\b/i.test(msg)) return "realestate";
  if (/\b(doctor|medical|health|appointment|symptom)\b/i.test(msg)) return "health";
  return null;
};

const extractFeatures = (message: string): string[] => {
  const msg = message.toLowerCase();
  const features: string[] = [];
  if (/\b(login|signup|auth|register|account)\b/i.test(msg)) features.push("authentication");
  if (/\b(chat|message|dm|messaging)\b/i.test(msg)) features.push("chat");
  if (/\b(payment|pay|stripe|paypal|checkout)\b/i.test(msg)) features.push("payment");
  if (/\b(upload|photo|image|video|file)\b/i.test(msg)) features.push("upload");
  if (/\b(notification|push|alert)\b/i.test(msg)) features.push("notifications");
  if (/\b(search|filter|find)\b/i.test(msg)) features.push("search");
  if (/\b(like|favorite|bookmark|save)\b/i.test(msg)) features.push("likes");
  if (/\b(comment|reply|discuss)\b/i.test(msg)) features.push("comments");
  if (/\b(share|send|forward)\b/i.test(msg)) features.push("sharing");
  if (/\b(profile|user|account|bio)\b/i.test(msg)) features.push("profiles");
  if (/\b(feed|timeline|stream)\b/i.test(msg)) features.push("feed");
  if (/\b(map|location|gps|nearby)\b/i.test(msg)) features.push("location");
  if (/\b(follow|follower|subscribe)\b/i.test(msg)) features.push("following");
  if (/\b(admin|dashboard|control|manage)\b/i.test(msg)) features.push("admin");
  if (/\b(dark mode|theme|color)\b/i.test(msg)) features.push("theming");
  return features;
};

const extractDesignPrefs = (message: string): string[] => {
  const msg = message.toLowerCase();
  const prefs: string[] = [];
  if (/\b(modern|clean|sleek|contemporary)\b/i.test(msg)) prefs.push("modern");
  if (/\b(minimal|minimalist|simple|basic)\b/i.test(msg)) prefs.push("minimal");
  if (/\b(colorful|vibrant|bright|bold)\b/i.test(msg)) prefs.push("colorful");
  if (/\b(dark|dark mode|black|night)\b/i.test(msg)) prefs.push("dark");
  if (/\b(light|light mode|white|bright)\b/i.test(msg)) prefs.push("light");
  if (/\b(professional|corporate|business)\b/i.test(msg)) prefs.push("professional");
  if (/\b(playful|fun|casual|friendly)\b/i.test(msg)) prefs.push("playful");
  if (/\b(neon|glow|futuristic|cyber)\b/i.test(msg)) prefs.push("neon");
  return prefs;
};

// SUPER SMART prompt selector with validation
export const getSmartBotPrompt = (
  userMessage: string,
  completionPercentage: number,
  previousMessages: Array<{ content: string; sender_type: string }>
): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // FIRST: Validate if message makes sense
  if (!isValidMessage(userMessage)) {
    const clarificationPrompts = botPrompts.find(p => p.category === 'clarification_needed');
    return clarificationPrompts?.questions[Math.floor(Math.random() * clarificationPrompts.questions.length)] || "Please describe your app idea clearly and in detail.";
  }
  
  // Detect what user is talking about
  const appType = detectAppType(userMessage);
  const mentionedFeatures = extractFeatures(userMessage);
  const designPrefs = extractDesignPrefs(userMessage);
  
  // Get previously asked questions
  const askedQuestions = previousMessages
    .filter(m => m.sender_type === 'bot')
    .map(m => m.content);
  
  const getUnaskedQuestion = (category: string): string => {
    const categoryPrompts = botPrompts.find(p => p.category === category);
    if (!categoryPrompts) return getRandomEncouragement();
    const unasked = categoryPrompts.questions.filter(q => !askedQuestions.includes(q));
    if (unasked.length === 0) return getRandomEncouragement();
    return unasked[Math.floor(Math.random() * unasked.length)];
  };
  
  const getRandomEncouragement = (): string => {
    const encouragement = botPrompts.find(p => p.category === 'encouragement');
    if (!encouragement) return "Tell me more!";
    return encouragement.questions[Math.floor(Math.random() * encouragement.questions.length)];
  };
  
  // App-type specific follow-ups
  if (appType && completionPercentage < 50) {
    const appTypeCategory = `${appType}_features`;
    const categoryExists = botPrompts.find(p => p.category === appTypeCategory);
    if (categoryExists) {
      const unasked = categoryExists.questions.filter(q => !askedQuestions.includes(q));
      if (unasked.length > 0) {
        return unasked[0];
      }
    }
  }
  
  // Stage-based questioning
  if (completionPercentage < 20) {
    if (!askedQuestions.some(q => q.toLowerCase().includes('type of app'))) {
      return getUnaskedQuestion('app_type');
    }
    return getUnaskedQuestion('features');
  } else if (completionPercentage < 40) {
    if (mentionedFeatures.length > 0) {
      return getUnaskedQuestion('features');
    }
    return getUnaskedQuestion('user_flow');
  } else if (completionPercentage < 60) {
    if (designPrefs.length > 0 || !askedQuestions.some(q => q.toLowerCase().includes('design'))) {
      return getUnaskedQuestion('design');
    }
    return getUnaskedQuestion('content');
  } else if (completionPercentage < 80) {
    return getUnaskedQuestion('technical');
  } else {
    return getUnaskedQuestion('details');
  }
};
