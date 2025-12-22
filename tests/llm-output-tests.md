# LLM Output Quality Tests

This document contains test cases and validation criteria for all four "Lead from the front" tools to ensure LLM outputs are 50X better - specific, actionable, and demonstrating expert-level understanding.

## Test Philosophy

Each test validates that outputs are:
- **Specific to input** (not generic templates)
- **Actionable immediately** (can be used today)
- **Demonstrating deep expertise** (shows pattern recognition)
- **Personal and thoughtful** (feels like expert counsel)
- **Clear about business impact** (explains why it matters)

---

## 1. Builder Profile Quiz Tests

### Test Case 1.1: Early-Stage Explorer
**Input:**
- Approach: "I'm exploring but haven't built systems yet"
- Frustration: "Too many tools, unclear where to start"
- Goal: "Clear understanding of AI for my role"

**Expected Quality:**
- Profile type should reference their exploration stage specifically
- Description should acknowledge their overwhelm and provide clarity
- Strengths should be specific (e.g., "Open mindset" is too generic - should reference their willingness to explore despite overwhelm)
- Next steps should be concrete and time-bound
- Should reference their actual answers, not generic advice

**Validation:**
- [ ] Profile type is creative and specific (not "Curious Explorer")
- [ ] Description references their specific answers
- [ ] Strengths show pattern recognition (what their answers reveal)
- [ ] Next steps are actionable within 30 days
- [ ] Framework used is explained, not just named

### Test Case 1.2: Experienced Experimenter
**Input:**
- Approach: "I'm actively building AI workflows"
- Frustration: "Built pilots but struggling to scale"
- Goal: "Team-wide AI transformation underway"

**Expected Quality:**
- Should recognize they're past basics, need scaling strategy
- Should identify the "pilot to production" gap
- Should provide team-level recommendations, not individual
- Should reference their experience level appropriately

**Validation:**
- [ ] Profile acknowledges their experience level
- [ ] Identifies specific scaling challenges
- [ ] Recommendations are team-focused, not individual
- [ ] Shows understanding of transformation vs. personal use

### Test Case 1.3: Strategic Builder
**Input:**
- Approach: "I'm experimenting with a few tools"
- Frustration: "I know what's possible but can't implement"
- Goal: "3-5 working AI systems I use daily"

**Expected Quality:**
- Should identify the "knowing vs. doing" gap
- Should provide implementation-focused next steps
- Should reference specific tools they might be using
- Should focus on systematization, not exploration

**Validation:**
- [ ] Identifies the implementation gap specifically
- [ ] Next steps are hands-on, not theoretical
- [ ] References their experimentation experience
- [ ] Focuses on building systems, not learning tools

---

## 2. AI Decision Helper Tests

### Test Case 2.1: Build vs Buy Decision
**Input:**
"Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months. Our customer support team is overwhelmed with repetitive questions."

**Expected Quality:**
- Should reframe the question (not just answer it)
- Should identify hidden assumptions (e.g., "chatbot" might not be the right solution)
- Should provide counter-arguments
- Should include implementation timeline
- Should reference their specific constraints (3 months, limited engineering)

**Validation:**
- [ ] Challenges the framing of the question
- [ ] Identifies at least one hidden assumption
- [ ] Provides counter-perspective
- [ ] Includes specific next step with timeline
- [ ] References their constraints (3 months, limited resources)
- [ ] Demonstrates pattern recognition (has seen this before)

### Test Case 2.2: Overwhelmed by Options
**Input:**
"I'm a CEO and I'm completely overwhelmed by all the AI tools. There are hundreds of them. I don't know where to start. My team is asking me for direction but I'm stuck."

**Expected Quality:**
- Should identify that overwhelm = no clear starting point
- Should reframe from "too many tools" to "no defined problem"
- Should provide specific starting methodology
- Should acknowledge the leadership pressure they're feeling

**Validation:**
- [ ] Reframes the problem (not about tools, about starting point)
- [ ] Provides specific methodology to start
- [ ] Acknowledges their leadership context
- [ ] Gives actionable first step (not "explore tools")
- [ ] Shows understanding of CEO decision-making pressure

### Test Case 2.3: Team Resistance
**Input:**
"I want to implement AI across my team but they're resistant. They think it's going to replace them or add more work. How do I get buy-in?"

**Expected Quality:**
- Should identify the real concern (not stated resistance)
- Should apply dialectical reasoning (FOR efficiency, AGAINST change fatigue)
- Should provide synthesis approach
- Should focus on quick wins that build buy-in

**Validation:**
- [ ] Identifies underlying concern (fear, not just resistance)
- [ ] Applies framework (dialectical reasoning)
- [ ] Provides synthesis approach
- [ ] Focuses on removing disliked tasks, not adding new ones
- [ ] Includes specific implementation strategy

### Test Case 2.4: Strategic AI Investment
**Input:**
"I'm a COO at a 200-person company. We're considering a $500K AI transformation initiative. Should we do it? What's the ROI? How do we know it will work?"

**Expected Quality:**
- Should challenge the "transformation initiative" framing
- Should apply first-principles (what problem are we solving?)
- Should provide risk analysis
- Should suggest validation approach before full investment
- Should reference their role (COO = operational focus)

**Validation:**
- [ ] Challenges the "big initiative" approach
- [ ] Applies first-principles thinking
- [ ] Provides risk analysis
- [ ] Suggests validation before full investment
- [ ] Tailored to COO role (operational, not strategic)

---

## 3. Friction Map Builder Tests

### Test Case 3.1: Weekly Reporting Challenge
**Input:**
"Weekly reports take 5 hours to compile. I gather data from 5 different systems, format it, add commentary, and send it to the board. It's tedious and I hate doing it."

**Expected Quality:**
- Current state should reference their specific workflow (5 systems, formatting, commentary)
- AI-enabled state should show how AI handles each step
- Time savings should be calculated with reasoning (not just "5 hours saved")
- Tool recommendations should match their specific workflow
- Prompts should be ready-to-use with their actual data sources

**Validation:**
- [ ] Current state references 5 systems, formatting, commentary specifically
- [ ] AI-enabled state shows transformation of each step
- [ ] Time savings calculation includes reasoning (e.g., "3 hours saved on data gathering, 1.5 hours on formatting, 0.5 hours on review")
- [ ] Tools match their workflow (integration with their systems)
- [ ] Prompts reference their actual data sources
- [ ] Prompts have NO placeholders

### Test Case 3.2: Meeting Management
**Input:**
"I spend 10 hours per week in meetings, and another 5 hours writing summaries and action items. I can't keep track of everything and things fall through the cracks."

**Expected Quality:**
- Should identify the real problem (not just "meetings take time")
- Should calculate realistic savings (not all 15 hours)
- Should provide tools that integrate with their meeting platform
- Should create prompts for meeting prep, capture, and follow-up

**Validation:**
- [ ] Identifies the real problem (tracking, follow-through, not just time)
- [ ] Time savings are realistic (maybe 3-4 hours, not 15)
- [ ] Tools integrate with common platforms (Zoom, Teams, etc.)
- [ ] Prompts cover meeting lifecycle (prep, capture, follow-up)
- [ ] Prompts are specific to meeting context

### Test Case 3.3: Strategic Planning
**Input:**
"Strategic planning takes me 20 hours per quarter. I research competitors, analyze market trends, synthesize team input, and create the strategic plan. It's mentally exhausting."

**Expected Quality:**
- Should break down the 20 hours into components
- Should identify which parts AI can accelerate vs. which require human judgment
- Should provide tools for research, analysis, and synthesis
- Should create prompts that maintain strategic thinking quality

**Validation:**
- [ ] Breaks down 20 hours into research, analysis, synthesis, writing
- [ ] Identifies what AI accelerates vs. what requires judgment
- [ ] Tools match strategic planning workflow
- [ ] Prompts maintain quality (not just speed)
- [ ] Time savings are realistic (maybe 8-10 hours, not 20)

---

## 4. Portfolio Builder Tests

### Test Case 4.1: CEO Strategic Portfolio
**Input Tasks:**
- Strategic Planning & Analysis: 8h/week
- Weekly Reporting & Metrics: 5h/week
- Market Research & Competitive Analysis: 4h/week

**Expected Quality:**
- Should recognize CEO role from task patterns
- Should identify synergies (reporting feeds planning, research informs strategy)
- Should create interconnected prompts (output from one feeds another)
- Should provide implementation sequence (which to build first)
- Should explain business impact for each prompt

**Validation:**
- [ ] Recognizes CEO role from task patterns
- [ ] Shows task interconnections
- [ ] Prompts are interconnected (not isolated)
- [ ] Implementation sequence is provided
- [ ] Business impact explained for each
- [ ] Prompts reference their specific tasks and hours

### Test Case 4.2: COO Operational Portfolio
**Input Tasks:**
- Weekly Reporting & Metrics: 8h/week
- Team Communication & Updates: 6h/week
- Decision Documentation: 4h/week

**Expected Quality:**
- Should recognize COO role (operational focus)
- Should identify operational workflow patterns
- Should create prompts that streamline operations
- Should focus on efficiency and team coordination

**Validation:**
- [ ] Recognizes COO role
- [ ] Focuses on operational efficiency
- [ ] Prompts support team coordination
- [ ] Shows workflow connections
- [ ] Tailored to operational context

### Test Case 4.3: Mixed Portfolio
**Input Tasks:**
- Strategic Planning: 4h/week
- Team Communication: 6h/week
- Decision Documentation: 3h/week

**Expected Quality:**
- Should identify role ambiguity or multi-role
- Should create prompts that work across different contexts
- Should show how strategic and operational tasks connect
- Should provide balanced approach

**Validation:**
- [ ] Recognizes multi-role or role ambiguity
- [ ] Prompts work across contexts
- [ ] Shows strategic-operational connections
- [ ] Balanced approach provided

---

## Validation Checklist (Apply to All Tests)

For each test case, verify:

### Specificity
- [ ] Output references specific details from input
- [ ] No generic templates or placeholders
- [ ] Tailored to user's exact situation

### Actionability
- [ ] Can be used immediately (today)
- [ ] Clear next steps with timelines
- [ ] No vague recommendations

### Expertise Demonstration
- [ ] Shows pattern recognition
- [ ] References similar situations
- [ ] Provides insights not obvious from input
- [ ] Demonstrates deep understanding

### Personalization
- [ ] Feels like it was written for this specific person
- [ ] Acknowledges their context, role, constraints
- [ ] Not one-size-fits-all advice

### Business Impact
- [ ] Explains why recommendations matter
- [ ] Quantifies benefits where possible
- [ ] Connects to business outcomes

---

## Testing Process

1. Run each test case through the respective tool
2. Evaluate output against validation criteria
3. Document any failures or generic responses
4. Iterate on prompts if outputs don't meet quality standards
5. Re-test until all criteria are met

## Success Metrics

- **Specificity Score**: % of outputs that reference specific input details (target: 100%)
- **Actionability Score**: % of outputs with clear, immediate next steps (target: 100%)
- **Expertise Score**: % of outputs showing pattern recognition (target: 90%+)
- **Personalization Score**: % of outputs that feel tailored (target: 100%)
- **Business Impact Score**: % of outputs explaining why it matters (target: 100%)

Overall target: All outputs should score 90%+ on all metrics.


