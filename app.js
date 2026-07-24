/* ============================================================
   Quantum Experience — SCIUS BUU
   Interactive quantum-science learning platform
   lab.js extends with the Quantum Lab redesign.
   ============================================================ */

'use strict';

/* ============================================================
   1. TRANSLATIONS (Thai default, English full support)
   ============================================================ */
const I18N = {
  brand:            { th: "Quantum Experience", en: "Quantum Experience" },
  nav_back:         { th: "กลับหน้าหลัก", en: "Back to menu" },

  home_eyebrow:     { th: "ห้องทดลองควอนตัมเสมือนจริง", en: "A Virtual Quantum Laboratory" },
  home_title:       { th: "Quantum Experience", en: "Quantum Experience" },
  home_subtitle:    { th: "สัมผัสโลกของอนุภาคที่เล็กที่สุด ทดลองด้วยตัวเอง แล้วค้นพบว่าทำไมควอนตัมถึงพลิกทุกอย่างที่เรารู้จัก", en: "Step into the world of the tiniest particles. Run the experiments yourself and discover why the quantum world breaks all the rules." },
  home_hint:        { th: "เลือกหัวข้อไหนก่อนก็ได้ ไม่ต้องเรียงลำดับ", en: "Explore any topic in any order — it is all up to you" },
  home_topics_label:{ th: "หกการทดลองควอนตัม", en: "Six Quantum Experiments" },
  home_topics_label7:{ th: "เจ็ดสถานีควอนตัม", en: "Seven Quantum Stations" },
  badge_recommended:{ th: "แนะนำให้เริ่มที่นี่", en: "Best place to start" },
  progress_summary: { th: "ทำสำเร็จแล้ว", en: "Completed" },

  challenge_chip:   { th: "ภารกิจ", en: "Challenge" },
  howto_title:      { th: "วิธีเล่น", en: "HOW TO PLAY" },

  // How-to steps (3 per station, short & action-first)
  t1_how1: { th: "กด “ยิงรัว” แล้วดูจุดตกค่อย ๆ รวมเป็นลายแถบ", en: "Press Rapid fire — watch dots build into stripes" },
  t1_how2: { th: "เลื่อน “ระยะห่างช่อง” และ “พลังงาน” ให้ลายเปลี่ยน", en: "Slide Slit separation & Energy to reshape the stripes" },
  t1_how3: { th: "ทำ MATCH ให้ถึง 80% → สถานีซ่อมสำเร็จ!", en: "Reach MATCH 80% → station repaired!" },
  t2_how1: { th: "เอียงลูกศรให้นอนราบ (นอนราบ = โอกาส 50:50)", en: "Tilt the arrow until it lies flat (flat = 50:50 odds)" },
  t2_how2: { th: "กด “วัดผล” — ผลจะสุ่มออก 0 หรือ 1", en: "Press Measure — you randomly get 0 or 1" },
  t2_how3: { th: "วัดครบ 10 ครั้งตอนลูกศรนอนราบ → ซ่อมเสร็จ!", en: "Take 10 measurements with the arrow flat → fixed!" },
  t3_how1: { th: "ลากแถบความกว้างไปซ้ายสุด ให้ตำแหน่งผอมเรียว", en: "Slide the width slider way left to make the position skinny" },
  t3_how2: { th: "ดูความมั่วตำแหน่งกับผลคูณข้างล่างขยับตาม", en: "Watch the position-blur and the product react below" },
  t3_how3: { th: "บีบตำแหน่งให้ชัด แล้วจะรู้สึกว่ามันชนกำแพงธรรมชาติ → ซ่อมเสร็จ!", en: "Get the position sharp — you'll feel it hit nature's wall → fixed!" },
  t4_how1: { th: "ใช้ ↑ ↓ เปลี่ยนเลน หลบกำแพง", en: "Use ↑ ↓ to switch lanes and dodge walls" },
  t4_how2: { th: "กด SPACE ค้างเพื่อแยกร่างทะลุกำแพง", en: "Hold SPACE to split and phase through walls" },
  t4_how3: { th: "ทำคะแนนให้ถึง 100 → ซ่อมสำเร็จ!", en: "Score 100+ → repaired!" },
  t5_how1: { th: "ตั้งมุม A และ B ให้เท่ากัน (เช่น 0° กับ 0°)", en: "Set angles A and B the same (e.g. 0° and 0°)" },
  t5_how2: { th: "กด “วัดรวด 40 ครั้ง”", en: "Press Run 40 trials" },
  t5_how3: { th: "ผลตรงกันเกิน 80% → ซ่อมสำเร็จ!", en: "Match above 80% → repaired!" },
  t6_how1: { th: "กด “เริ่มการทดลอง” เพื่อปิดกล่อง", en: "Press Set up experiment to seal the box" },
  t6_how2: { th: "กด “เปิดกล่อง!” — ลุ้นแมวเป็นหรือตาย", en: "Press Open the box! — alive or dead?" },
  t6_how3: { th: "เปิดครบ 5 ครั้ง → ซ่อมสำเร็จ!", en: "Open it 5 times → repaired!" },
  c7_how1: { th: "ลากเกต H ไปวางบนสาย Q0, Q1 และ Q2", en: "Drag an H gate onto wires Q0, Q1 and Q2" },
  c7_how2: { th: "วาง Oracle ต่อด้วย Diffusion บนสายไหนก็ได้", en: "Add Oracle, then Diffusion, on any wire" },
  c7_how3: { th: "กดรัน — ดันกล่อง #2 ให้เกิน 75%!", en: "Press Run — push box #2 above 75%!" },
  predict_tag:      { th: "ทายก่อนทดลอง", en: "Predict before you test" },
  correct_label:    { th: "ถูกต้อง! เยี่ยมมาก", en: "Correct! Nice work" },
  incorrect_label:  { th: "ยังไม่ใช่ ลองคิดใหม่นะ", en: "Not quite — here is why" },

  // Buttons
  btn_fire:         { th: "ยิงอนุภาค", en: "Fire particle" },
  btn_continuous:   { th: "ยิงรัว", en: "Rapid fire" },
  btn_continuous_stop:{ th: "หยุดยิง", en: "Stop firing" },
  btn_reset:        { th: "เริ่มใหม่", en: "Reset" },
  btn_prepare:      { th: "เตรียมสถานะ", en: "Prepare state" },
  btn_measure:      { th: "วัดผล", en: "Measure" },
  btn_play:         { th: "เล่น", en: "Play" },
  btn_pause:        { th: "หยุดชั่วคราว", en: "Pause" },
  btn_fire_wave:    { th: "ยิงกลุ่มคลื่น", en: "Fire wave packet" },
  btn_create_pair:  { th: "สร้างคู่พัวพัน", en: "Create entangled pair" },
  btn_run_many:     { th: "วัดรวด 40 ครั้ง", en: "Run 40 trials" },
  btn_open_box:     { th: "เปิดกล่อง!", en: "Open the box!" },
  btn_prepare_exp:  { th: "เริ่มการทดลอง", en: "Set up experiment" },
  btn_wave_view:    { th: "แสดงคลื่น", en: "Show wave view" },
  btn_wave_view_off:{ th: "ซ่อนคลื่น", en: "Hide wave view" },

  // Topic 1
  t1_title:   { th: "ความเป็นคู่ของคลื่นและอนุภาค", en: "Wave–Particle Duality" },
  t1_desc:    { th: "แสงและอิเล็กตรอนเป็นได้ทั้งอนุภาคและคลื่นในเวลาเดียวกัน", en: "Light and electrons act as both particles and waves at once." },
  t1_intro:   { th: "ยิงอนุภาคทีละตัวผ่านช่องคู่ แต่ละจุดตกดูสุ่มไปหมด แล้วทำไมพอสะสมมากพอถึงเกิดลายเส้นสว่าง–มืดได้? นั่นคือหลักฐานว่าอนุภาคเดินทางแบบคลื่น", en: "Fire particles one at a time through two slits. Each landing looks random — so why does a striped pattern appear once enough of them pile up? That is the signature of a wave." },
  t1_challenge:{ th: "ยิงให้ครบ 60 อนุภาค แล้วสังเกตว่าแถบสว่าง–มืดโผล่มาตรงไหนบ้าง", en: "Fire 60 particles and watch where the bright and dark bands appear." },
  t1_q:       { th: "ทายดู: ยิงอนุภาคไปเรื่อย ๆ จุดตกจะไปรวมกันแบบไหน?", en: "Predict: as you keep firing, how will the landing spots cluster?" },
  t1_a:       { th: "กองอยู่ตรงกลางจุดเดียว", en: "All piled in one central spot" },
  t1_b:       { th: "กระจายสุ่มทั่วฉากเท่า ๆ กัน", en: "Spread evenly and randomly" },
  t1_c:       { th: "รวมเป็นแถบ ๆ สลับสว่างกับมืด", en: "Form alternating bright and dark bands" },
  t1_explain: { th: "แม้ยิงทีละอนุภาค จุดตกกลับรวมเป็นแถบแทรกสอด เหมือนคลื่นสองลูกจากสองช่องมาเสริมและหักล้างกัน อนุภาคจึงมีธรรมชาติเป็นคลื่นด้วย", en: "Even fired one by one, the hits build interference bands — as if a wave from each slit adds and cancels. The particle carries a wave nature too." },

  // Topic 2
  t2_title:   { th: "การซ้อนทับเชิงควอนตัม", en: "Quantum Superposition" },
  t2_desc:    { th: "คิวบิตอยู่ได้หลายสถานะพร้อมกัน จนกว่าจะถูกวัด", en: "A qubit can be many states at once — until it is measured." },
  t2_intro:   { th: "ลูกศรบนทรงกลมสถานะคือสถานะของคิวบิต ลากหมุนดูได้เลย ยิ่งลูกศรเอียง โอกาสวัดได้ 0 หรือ 1 ก็เปลี่ยนไป กด “วัดผล” แล้วดูมันยุบลงเป็นคำตอบเดียว", en: "The arrow on the state globe is the qubit’s state — drag to spin it. Its tilt sets the odds of measuring 0 or 1. Hit Measure and watch it collapse to a single answer." },
  t2_challenge:{ th: "เอียงลูกศรให้ได้ 50:50 แล้ววัดสัก 20 ครั้ง ผลออกมาใกล้ครึ่ง–ครึ่งไหม?", en: "Tilt the arrow to a 50:50 split, measure 20 times — does it land near half and half?" },
  t2_q:       { th: "ทายดู: ถ้าวางลูกศรให้นอนราบ (ชี้ออกด้านข้าง) ผลการวัดจะเป็นอย่างไร?", en: "Predict: with the arrow lying flat (pointing straight out to the side), what will measurements give?" },
  t2_a:       { th: "ได้ 0 (สปินขึ้น) ทุกครั้ง", en: "Always 0 (spin up)" },
  t2_b:       { th: "ได้ 1 (สปินลง) ทุกครั้ง", en: "Always 1 (spin down)" },
  t2_c:       { th: "ได้ 0 กับ 1 อย่างละครึ่ง", en: "Half 0 and half 1" },
  t2_explain: { th: "ลูกศรนอนราบ = 50:50 เป๊ะ ๆ วัดกี่ครั้งก็สุ่มจริง แต่จุดที่แปลกสุดคือ ไม่เหมือนเหรียญที่แอบออกหัว/ก้อยไว้ตั้งแต่แรก คิวบิตมันยัง “ไม่เลือก” อะไรเลยจนกว่าเราจะไปดู (ชื่อเท่ ๆ ของสถานะลูกศรนอนราบคือ superposition แบบเท่ากัน ส่วนมุมเอียงเรียกว่า θ)", en: "Flat arrow = a perfect 50:50. Every measurement is a real coin-flip — but here's the wild part: unlike a real coin that's secretly already heads or tails, the qubit hasn't picked an answer at all until you look. (Fancy name for the flat-arrow state: an equal superposition. The tilt angle is θ.)" },

  // Topic 3
  t3_title:   { th: "หลักความไม่แน่นอน", en: "The Uncertainty Principle" },
  t3_desc:    { th: "ยิ่งรู้ตำแหน่งแม่นเท่าไร ก็ยิ่งไม่รู้ความเร็ว", en: "The better you know position, the less you know momentum." },
  t3_intro:   { th: "กราฟบน = รู้ว่ามันอยู่ตรงไหนแค่ไหน กราฟล่าง = รู้ว่ามันวิ่งเร็วแค่ไหน ลองบีบอันนึงให้แคบสิ อีกอันพองปุ๊บทันที จะให้ชัดทั้งคู่พร้อมกันไม่ได้เลย กำแพงนี้ธรรมชาติตั้งไว้ ไม่ใช่แอปตั้งเอง", en: "Top graph = how sure you are of WHERE it is. Bottom = how sure you are of how FAST it's going. Squeeze one skinny and the other instantly blows up — you literally can't make both sharp at once. That wall is nature's, not the app's." },
  t3_challenge:{ th: "ลองบีบตำแหน่งให้ชัดที่สุด แล้วดูความมั่วของความเร็วพุ่งขึ้น กดเล่นเพื่อดูก้อนคลื่นค่อย ๆ บานออกตามเวลา", en: "Make the position as sharp as you can and watch the speed-blur shoot up. Hit Play to watch the blob spread out over time." },
  t3_q:       { th: "ทายดู: เราทำให้ทั้งความมั่วของตำแหน่งและความเร็วเป็น 0 พร้อมกันได้ไหม?", en: "Predict: can we make both the position-blur and the speed-blur zero at the same time?" },
  t3_a:       { th: "ได้สิ แค่ล็อกตำแหน่งให้เป๊ะ", en: "Yep — just pin the position exactly" },
  t3_b:       { th: "ได้สิ แค่ล็อกความเร็วให้เป๊ะ", en: "Yep — just pin the speed exactly" },
  t3_c:       { th: "ไม่ได้หรอก มันมีพื้นที่ทะลุไม่ได้เสมอ", en: "Nope — there's always a floor you can't beat" },
  t3_explain: { th: "ยิ่งบีบความมั่วของตำแหน่งเข้าใกล้ 0 ความมั่วของความเร็วยิ่งพุ่งไม่มีที่สิ้นสุด ผลคูณเลยไม่มีทางแตะ 0 ธรรมชาติล็อกพื้นไว้แน่น โกงไม่ได้ (ชื่อทางการ: หลักความไม่แน่นอน และพื้นนั่นคือค่า ħ/2)", en: "Push the position-blur toward 0 and the speed-blur rockets toward infinity, so their product never hits 0. Nature bolts that floor down — no cheating it. (Grown-up name: the Uncertainty Principle, and that floor is ħ/2.)" },

  // Topic 4
  t4_title:   { th: "การทะลุอุโมงค์ควอนตัม", en: "Quantum Tunneling" },
  t4_desc:    { th: "อนุภาคผ่านกำแพงพลังงานที่โดยปกติมันข้ามไม่ได้", en: "Particles slip through energy walls they could never climb." },
  t4_intro:   { th: "ยิงกลุ่มคลื่นเข้าใส่กำแพงพลังงาน ตามฟิสิกส์ปกติมันควรเด้งกลับหมด แต่ควอนตัมกลับมีบางส่วน “ทะลุ” ออกไปอีกฝั่งได้ ลองปรับกำแพงดูว่าโอกาสทะลุเปลี่ยนแค่ไหน", en: "Fire a wave packet at an energy wall. Classically it should bounce straight back — yet a slice of it tunnels through to the far side. Tune the wall and watch the odds change." },
  t4_challenge:{ th: "ลองทำให้กำแพงบางและเตี้ยที่สุด แล้วดูว่าโอกาสทะลุขึ้นไปได้สูงแค่ไหน", en: "Make the wall as thin and low as possible and see how high the tunneling odds climb." },
  t4_q:       { th: "ทายดู: ถ้าเพิ่ม “ความสูงกำแพง” โอกาสทะลุจะเป็นอย่างไร?", en: "Predict: if you raise the wall height, what happens to the tunneling odds?" },
  t4_a:       { th: "สูงขึ้น ทะลุง่ายขึ้น", en: "They rise — easier to tunnel" },
  t4_b:       { th: "ต่ำลง ทะลุยากขึ้น", en: "They fall — harder to tunnel" },
  t4_c:       { th: "เท่าเดิม ไม่เกี่ยวกัน", en: "No change — unrelated" },
  t4_explain: { th: "กำแพงยิ่งสูงยิ่งหนา โอกาสทะลุยิ่งร่วงเร็วมาก ทุกความหนาที่เพิ่มมาตัดของที่ผ่านได้ลงราว ๆ ครึ่งนึง แต่ไม่เคยเป็นศูนย์เป๊ะ เลยมีลุ้นเสมอ (เกร็ด: นี่แหละเหตุผลที่ดวงอาทิตย์ส่องแสงได้)", en: "A taller, thicker wall crushes the odds fast — every extra bit of wall roughly halves what gets through — but it never hits exactly zero, so there's always a tiny chance. Lowkey this is why the sun shines." },

  // Topic 5
  t5_title:   { th: "การพัวพันเชิงควอนตัม", en: "Quantum Entanglement" },
  t5_desc:    { th: "อนุภาคสองตัวเชื่อมผลกัน แม้อยู่ไกลคนละมุมโลก", en: "Two particles share one fate, no matter the distance." },
  t5_intro:   { th: "สร้างคู่อนุภาคที่ลิงก์กัน แล้วส่งไปเครื่องวัด A กับ B คนละฝั่งห้อง วัดพร้อมกันแล้วดูว่าคำตอบมันตรงกันแบบขนลุกแค่ไหน แล้วลองบิดมุมเครื่องวัดให้ต่างกันดูสิว่าเกิดอะไรขึ้น", en: "Make a linked pair and ship them to detectors A and B on opposite sides of the room. Measure both and see how eerily their answers agree. Then try tilting the detectors apart and watch what happens." },
  t5_challenge:{ th: "ตั้งมุม A กับ B ให้เท่ากัน แล้ววัดรัว ๆ ตรงกันกี่ %?", en: "Set A and B to the same angle, measure a bunch — what % match?" },
  t5_q:       { th: "ทายดู: ถ้าตั้งมุมเครื่องวัดทั้งสองให้เท่ากัน ผลจะเป็นอย่างไร?", en: "Predict: with both detectors at the same angle, what will the results be?" },
  t5_a:       { th: "ตรงกันทุกครั้ง (100%)", en: "Identical every time (100%)" },
  t5_b:       { th: "ตรงข้ามกันทุกครั้ง", en: "Opposite every time" },
  t5_c:       { th: "สุ่มไม่มีความสัมพันธ์", en: "Random and unrelated" },
  t5_explain: { th: "พอมุมเท่ากัน A กับ B ตรงกันทุกครั้งเป๊ะ ทั้งที่แต่ละตัวออกมาสุ่มสุด ๆ จุดพีคคือ ไม่มีแผนลับที่แอบใส่ไว้ก่อนอันไหนปลอมความตรงกันระดับนี้ได้เลย ฟิสิกส์แบบเดิมอธิบายไม่ได้ (ชื่อทางการ: ทฤษฎีบทเบลล์)", en: "At equal angles A and B match every single time — even though each result on its own is totally random. Here's the kicker: no secret plan packed in ahead of time can fake a link this tight. Classical physics simply can't explain it. (Grown-up name: Bell's theorem.)" },

  // Topic 6
  t6_title:   { th: "แมวของชเรอดิงเงอร์", en: "Schrödinger’s Cat" },
  t6_desc:    { th: "ก่อนเปิดกล่อง แมวเป็นทั้งเป็นและตายพร้อมกัน", en: "Before you look, the cat is alive and dead at once." },
  t6_intro:   { th: "แมวอยู่ในกล่องปิดสนิทกับอะตอมกัมมันตรังสี ถ้าอะตอมสลาย สารพิษจะถูกปล่อย ตราบใดที่ยังไม่เปิด แมวจึงอยู่ในสถานะซ้อนทับ “เป็น+ตาย” การเปิดกล่องคือการวัดที่ทำให้มันกลายเป็นคำตอบเดียว", en: "A cat sits in a sealed box with a radioactive atom. If the atom decays, poison is released. Until you open it, the cat is in a superposition of alive and dead — opening the box is the measurement that forces one answer." },
  t6_challenge:{ th: "ทดลองเปิดกล่องหลาย ๆ รอบ แล้วดูว่าอัตราส่วนเป็น:ตาย เข้าใกล้ที่ทฤษฎีทำนายไหม", en: "Open the box many times and check whether the alive:dead ratio matches the prediction." },
  t6_q:       { th: "ทายดู: ก่อนเปิดกล่อง แมวอยู่ในสถานะใด?", en: "Predict: before the box is opened, what state is the cat in?" },
  t6_a:       { th: "เป็นอย่างเดียว", en: "Alive only" },
  t6_b:       { th: "ตายอย่างเดียว", en: "Dead only" },
  t6_c:       { th: "ซ้อนทับของเป็นและตาย", en: "A superposition of alive and dead" },
  t6_explain: { th: "ก่อนมีใครไปดู แมวเป็นทั้งเป็นและตายพร้อมกันจริง ๆ ไม่ใช่แค่ “เรายังไม่รู้” แต่มันเป็นทั้งคู่จริง ๆ การเปิดกล่องคือการวัดที่ทำให้สถานะสแนปเหลือคำตอบเดียว", en: "Before anyone looks, the cat is genuinely alive AND dead at once — not 'we just don't know yet,' but actually both. Opening the box is the measurement that snaps it to a single outcome." },

  // Game page
  game_eyebrow:     { th: "ARCADE · ควอนตัม", en: "ARCADE · QUANTUM" },
  game_title:       { th: "Qubit Runner", en: "Qubit Runner" },
  game_desc:        { th: "คุณคืออนุภาคควอนตัม กด SPACE ค้างเพื่อแยกร่างทะลุกำแพง วิ่งให้ไกลที่สุด!", en: "You're a quantum particle. Hold SPACE to split and phase through walls. Run as far as you can!" },
  game_menu_title:  { th: "QUBIT RUNNER", en: "QUBIT RUNNER" },
  game_menu_sub:    { th: "คุณคืออนุภาคควอนตัม วิ่งเลย!", en: "You are a quantum particle. Run." },
  game_tagline:     { th: "กด SPACE ค้างเพื่อแยกตัว · หลบกำแพง · รอดชีวิต", en: "Hold SPACE to split · Dodge barriers · Survive" },
  game_start:       { th: "เริ่มเล่น", en: "START" },
  game_how_title:   { th: "วิธีเล่น", en: "HOW TO PLAY" },
  game_how_move:    { th: "เคลื่อนที่ — ขึ้น / ลง เลน", en: "Move — up / down lanes" },
  game_how_split:   { th: "แยกตัว — กด SPACE เพื่อเข้าสู่ซ้อนทับและลอดใต้กำแพง", en: "Split — hold SPACE to enter superposition and phase through barriers" },
  game_how_coh:     { th: "ความเป็นระเบียบ — ลดลงขณะแยกตัว ฟื้นเมื่อกลับเป็นอนุภาคเดียว", en: "Coherence — depletes while split; regenerates when whole" },
  game_over_title:  { th: "ยุบแล้ว!", en: "COLLAPSED" },
  game_over_sub:    { th: "ฟังก์ชันคลื่นถูกวัดแล้ว", en: "The wavefunction was measured." },
  game_newrecord:   { th: "สถิติใหม่!", en: "NEW RECORD!" },
  game_retry:       { th: "เล่นอีกครั้ง", en: "PLAY AGAIN" },
  game_physics:     { th: "ฟิสิกส์", en: "PHYSICS" },
  game_phys_note:   { th: "ทุกกลไกสอดคล้องกับฟิสิกส์ควอนตัมจริง", en: "Every mechanic maps to real quantum physics" },
  game_phys_superp: { th: "การแยกซ้อนทับ", en: "Superposition Split" },
  game_phys_superp_desc:{ th: "กด SPACE สร้างซ้อนทับที่คุณอยู่สองเลนพร้อมกัน — จนกว่ากำแพงจะยุบฟังก์ชันคลื่น", en: "Holding SPACE creates a superposition where you exist in two lanes simultaneously — until a barrier collapses the wavefunction." },
  game_phys_tunnel: { th: "การผ่านคลื่น", en: "Quantum Tunneling" },
  game_phys_tunnel_desc:{ th: "อนุภาคที่แยกตัวมีความน่าจะเป็นที่จะผ่านกำแพงพลังงาน ความน่าจะเป็นลดแบบทวีคูณตามความหนาของกำแพง", en: "A split particle has a probability amplitude to tunnel through energy barriers. The odds fall exponentially with barrier thickness." },
  game_phys_collapse:{ th: "การวัด / การยุบ", en: "Measurement / Collapse" },
  game_phys_collapse_desc:{ th: "เมื่ออนุภาคที่ยังไม่แยกชนกำแพง ฟังก์ชันคลื่นไม่มีทางไป ต้องยุบ เกมจบเพราะอนุภาคถูก \"วัด\"", en: "When an unsplit you hits a barrier, the wavefunction has nowhere to go — collapse. The game ends because the particle was \"measured.\"" },

  // Lab page
  lab_title:          { th: "ห้องปฏิบัติการควอนตัม", en: "Quantum Core Lab" },
  lab_desc:           { th: "ฝึกฝนทักษะควอนตัมขั้นสูง ผ่านสามสถานีท้าทาย", en: "Sharpen your quantum skills through three challenging stations." },
  lab_match:          { th: "ตรงกัน", en: "MATCH" },
  lab_target_locked:  { th: "เป้าหมายล็อคแล้ว รันควอนตัมเซิร์ช?", en: "Target locked. Run quantum search?" },
  lab_search_running: { th: "ควอนตัมเซิร์ชกำลังทำงาน…", en: "Quantum search running…" },
  lab_search_complete:{ th: "ควอนตัมเซิร์ชเสร็จใน 1 คิวรี!", en: "Quantum search complete in 1 query!" },
  lab_classical_q:    { th: "คิวรี", en: "queries" },
  lab_select_target:  { th: "เลือกไอเทมในฐานข้อมูลเพื่อกำหนดเป้าหมาย แล้วรันเซิร์ช", en: "Select a database item to mark as the target, then run the search." },

  // Control labels
  ctl_slit_sep:  { th: "ระยะห่างช่อง", en: "Slit separation" },
  ctl_energy:    { th: "พลังงานอนุภาค", en: "Particle energy" },
  ctl_theta:     { th: "เอียงโต๊ะ", en: "Table tilt" },
  ctl_phi:       { th: "หมุนรอบแกน (φ)", en: "Spin around (φ)" },
  ctl_width:     { th: "ความกว้างกลุ่มคลื่น", en: "Wave packet width" },
  ctl_speed:     { th: "ความเร็วเวลา", en: "Time speed" },
  ctl_barrier_h: { th: "ความสูงกำแพง", en: "Barrier height" },
  ctl_barrier_w: { th: "ความหนากำแพง", en: "Barrier width" },
  ctl_angle_a:   { th: "มุมเครื่องวัด A", en: "Detector A angle" },
  ctl_angle_b:   { th: "มุมเครื่องวัด B", en: "Detector B angle" },
  ctl_wait:      { th: "เวลารอ (วินาที)", en: "Wait time (s)" },

  // Stat labels
  stat_particles:   { th: "อนุภาคที่ยิงแล้ว", en: "Particles fired" },
  stat_spin_up:     { th: "วัดได้ 0 ↑", en: "Measured 0 ↑" },
  stat_spin_down:   { th: "วัดได้ 1 ↓", en: "Measured 1 ↓" },
  stat_measurements:{ th: "จำนวนการวัด", en: "Measurements" },
  stat_dx:          { th: "ความมั่วตำแหน่ง (Δx)", en: "Position blur (Δx)" },
  stat_dp:          { th: "ความมั่วความเร็ว (Δp)", en: "Speed blur (Δp)" },
  stat_product:     { th: "ผลคูณ (Δx × Δp)", en: "Product (Δx × Δp)" },
  stat_transmission:{ th: "โอกาสทะลุ (T)", en: "Transmission (T)" },
  stat_reflection:  { th: "โอกาสสะท้อน (R)", en: "Reflection (R)" },
  stat_correlation: { th: "ผลตรงกัน", en: "Results match" },
  stat_trials:      { th: "จำนวนครั้ง", en: "Trials" },
  stat_alive:       { th: "แมวเป็น", en: "Alive" },
  stat_dead:        { th: "แมวตาย", en: "Dead" },

  // Canvas labels
  lbl_source:       { th: "แหล่งกำเนิด", en: "Source" },
  lbl_double_slit:  { th: "ช่องคู่", en: "Double slit" },
  lbl_screen:       { th: "ฉากรับ", en: "Screen" },
  lbl_pos_space:    { th: "ปริภูมิตำแหน่ง  |ψ(x)|²", en: "Position space  |ψ(x)|²" },
  lbl_mom_space:    { th: "ปริภูมิโมเมนตัม  |ψ(p)|²", en: "Momentum space  |ψ(p)|²" },
  lbl_incoming:     { th: "คลื่นเข้า", en: "Incoming" },
  lbl_barrier:      { th: "กำแพงพลังงาน", en: "Energy barrier" },
  lbl_transmitted:  { th: "ทะลุออก", en: "Transmitted" },
  lbl_reflected:    { th: "สะท้อนกลับ", en: "Reflected" },
  lbl_ent_source:   { th: "แหล่งพัวพัน", en: "Entangled source" },
  lbl_detector:     { th: "เครื่องวัด", en: "Detector" },
  lbl_atom:         { th: "อะตอม", en: "Atom" },
  lbl_poison:       { th: "สารพิษ", en: "Poison" },
  lbl_prob_same:    { th: "โอกาสตรงกัน (ทฤษฎี)", en: "Match odds (theory)" },
  cat_alive:        { th: "เป็น", en: "Alive" },
  cat_dead:         { th: "ตาย", en: "Dead" },
  cat_super:        { th: "ซ้อนทับ", en: "Superposition" },

  // Station 7 — Circuit Builder
  t7_title:   { th: "เครื่องสร้างวงจรควอนตัม", en: "Quantum Circuit Builder" },
  t7_desc:    { th: "สร้างอัลกอริทึมการค้นหาของ Grover ด้วยตัวเอง", en: "Build Grover's search algorithm from scratch." },
  t7_intro:   { th: "ลากเกตมาวางบนสาย กดรัน แล้วดันเป้าหมาย (กล่อง #2 จาก 8) ให้เครื่องเจอในทีเดียว", en: "Drag gates onto the wires, hit run, and boost your target — box #2 of 8 — until the machine finds it in one shot." },
  t7_challenge:{ th: "สร้างวงจรให้กล่อง #2 เกิน 75%", en: "Build a circuit that pushes box #2 above 75%." },
  t7_q:       { th: "ทายดู: หาของ 1 ชิ้นใน 8 กล่อง แบบปกติเปิดเฉลี่ย ~4 ครั้ง แล้ว Grover เร็วกว่าประมาณกี่เท่า?", en: "Predict: to find 1 prize among 8 boxes (normal search opens ~4), how much faster is Grover's?" },
  t7_a:       { th: "เร็วกว่า 2 เท่า", en: "2× faster" },
  t7_b:       { th: "เร็วราว √N เท่า (~1 ครั้ง แทน 4)", en: "About √N faster (~1 look instead of 4)" },
  t7_c:       { th: "เร็วกว่า N เท่า", en: "N times faster" },
  t7_explain: { th: "8 กล่อง เปิดทีละใบเฉลี่ย ~4 ครั้ง แต่ Grover เจอในราว 1 ครั้ง ยิ่งกองใหญ่ยิ่งทิ้งห่าง (ชื่อทางการ: การเร่งแบบ √N หรือ “quadratic speedup”)", en: "For 8 boxes, checking one-by-one takes ~4 tries but Grover's finds it in about 1. The bigger the pile, the more it wins. (Grown-up name: a √N 'quadratic' speedup.)" },

  // Station 7 — circuit page UI
  c7_title:    { th: "เครื่องสร้างวงจรควอนตัม", en: "Quantum Circuit Builder" },
  c7_intro:    { th: "ลากเกตมาต่อวงจร แล้วทำให้เครื่องหากล่อง #2 เจอในครั้งเดียว", en: "Drag gates onto the wires and make the machine find box #2 in one shot." },
  c7_challenge:{ th: "H ทั้ง 3 สาย → Oracle → Diffusion → รัน ดันกล่อง #2 (|2⟩) ให้เกิน 75%", en: "H on all 3 wires → Oracle → Diffusion → Run. Push box #2 (|2⟩) above 75%." },
  c7_hint_btn: { th: "ขอคำใบ้", en: "Hint" },

  schr_idle:  { th: "กด “เริ่มการทดลอง” เพื่อปิดฝากล่อง", en: "Press Set up experiment to seal the box" },
  schr_super: { th: "แมวกำลังซ้อนทับ เป็น + ตาย …", en: "The cat is in superposition: alive + dead …" },
  schr_alive: { th: "เปิดกล่อง — แมวยังเป็นอยู่! 🎉", en: "Box opened — the cat is alive! 🎉" },
  schr_dead:  { th: "เปิดกล่อง — แมวตายแล้ว …", en: "Box opened — the cat did not make it …" },

  // Sim hints
  hint_slit:      { th: "กดยิงอนุภาค แล้วดูลายแทรกสอดค่อย ๆ ปรากฏ", en: "Fire particles and watch the interference pattern build" },
  hint_bloch:     { th: "ลากโต๊ะให้เอียง แล้วกดวัด", en: "Drag the table to tilt it, then Measure" },
  hint_uncertainty:{ th: "เลื่อนแถบความกว้าง แล้วดูอีกกราฟตอบสนอง", en: "Slide the width and watch the other curve react" },
  hint_tunnel:    { th: "ปรับกำแพงแล้วกดยิงกลุ่มคลื่น", en: "Adjust the wall, then fire the wave packet" },
  hint_entangle:  { th: "ตั้งมุมแล้วกดวัดผลหลาย ๆ ครั้ง", en: "Set the angles, then measure many times" },
  hint_schrodinger:{ th: "เริ่มการทดลอง แล้วค่อยเปิดกล่อง", en: "Set it up, then open the box" },

  // Footer
  credits_note: { th: "โครงการ วมว. · มหาวิทยาลัยบูรพา — สร้างขึ้นเพื่อจุดประกายความสนใจในวิทยาศาสตร์ควอนตัม", en: "SCIUS · Burapha University — built to spark curiosity in quantum science" },
  role_dev:     { th: "นักพัฒนา", en: "Developer" },
  role_advisor: { th: "อาจารย์ที่ปรึกษา", en: "Advisor" },

  // Toasts
  toast_lang:     { th: "เปลี่ยนเป็นภาษาไทยแล้ว", en: "Switched to English" },
  toast_sound_on: { th: "เปิดเสียงแล้ว", en: "Sound on" },
  toast_sound_off:{ th: "ปิดเสียงแล้ว", en: "Sound off" },
  toast_done:     { th: "ปลดล็อกความสำเร็จ! 🌟", en: "Topic completed! 🌟" }
};

const TOPIC_META = {
  1: { icon: "🌊", key: "t1" },
  2: { icon: "⚛️", key: "t2" },
  3: { icon: "📈", key: "t3" },
  4: { icon: "🚀", key: "t4" },
  5: { icon: "🔗", key: "t5" },
  6: { icon: "🐈", key: "t6" },
  7: { icon: "⚡", key: "t7" },
};

const QUIZ = {
  1: { correct: "c" }, 2: { correct: "c" }, 3: { correct: "c" },
  4: { correct: "b" }, 5: { correct: "a" }, 6: { correct: "c" },
  7: { correct: "b" },
};

/* ============================================================
   2. GLOBAL STATE
   ============================================================ */
let lang = localStorage.getItem('qx_lang') || 'th';
let soundOn = localStorage.getItem('qx_sound') !== 'false';
let currentTopic = 0;
let progress = JSON.parse(localStorage.getItem('qx_progress') || '{}');

let audioCtx = null;
const buffers = {};
let continuousTimer = null;

function t(key) {
  const e = I18N[key];
  return e ? (e[lang] || e.en) : key;
}

/* ============================================================
   3. INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildLabHome();   // replaces buildHome() — new narrative lab screen
  buildTopics();
  injectPuzzleUI(); // adds puzzle goal strips + overlays to each topic page
  buildBackground();
  initAudio();
  setupCanvases();
  applyLanguage();
  applySoundUI();
  syncPuzzleStateFromProgress(); // re-solve any already-completed stations
  if (typeof auraCheckInbound === 'function') auraCheckInbound(); // open Aura if arrived via a friend's entangle link
  if (typeof chatCheckInbound === 'function') chatCheckInbound(); // open the particle chat if arrived via its entangle link
  if (typeof duelCheckInbound === 'function') duelCheckInbound(); // open Quantum Match if arrived via a duel link

  // resume audio on first gesture (browsers block autoplay)
  const resume = () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    window.removeEventListener('pointerdown', resume);
    window.removeEventListener('keydown', resume);
  };
  window.addEventListener('pointerdown', resume);
  window.addEventListener('keydown', resume);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(redrawCurrent);
  }
});

/* ── Sync already-solved stations from localStorage ──────── */
function syncPuzzleStateFromProgress() {
  for (let i = 1; i <= 7; i++) {
    if (progress[i]) PUZZLE[i].solved = true;
  }
  updateLabProgress(true);
}

/* ============================================================
   4. AUDIO SYSTEM (procedural, preloaded buffers)
   ============================================================ */
function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    buffers.click    = tone([[900, 0], [1200, 0.04]], 0.06, 0.22, 'sine');
    buffers.hover    = tone([[1400, 0]], 0.03, 0.10, 'sine');
    buffers.particle = noiseBurst(0.18, 0.28);
    buffers.prepare  = sweep(320, 880, 0.35, 0.30);
    buffers.measure  = sweep(820, 260, 0.35, 0.28);
    buffers.success  = arpeggio([523, 659, 784, 1046], 0.5, 0.24);
    buffers.error    = tone([[200, 0], [150, 0.2]], 0.3, 0.24, 'triangle');
    buffers.collision= tone([[420, 0], [180, 0.12]], 0.16, 0.24, 'square');
    buffers.discover = arpeggio([659, 880, 1174], 0.55, 0.26);
    buffers.nav      = sweep(500, 760, 0.18, 0.16);
  } catch (e) {
    console.warn('Web Audio unavailable:', e);
  }
}

function tone(freqPts, dur, vol, type) {
  const sr = audioCtx.sampleRate, len = Math.floor(sr * dur);
  const buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const time = i / sr, prog = time / dur;
    let f = freqPts[0][1] === undefined ? freqPts[0][0] : interpFreq(freqPts, prog);
    let s = type === 'square' ? Math.sign(Math.sin(2*Math.PI*f*time))
          : type === 'triangle' ? 2*Math.abs(2*(time*f % 1)-1)-1
          : Math.sin(2*Math.PI*f*time);
    d[i] = s * Math.exp(-time*8) * vol;
  }
  return buf;
}
function interpFreq(pts, prog) {
  for (let i = 0; i < pts.length-1; i++) {
    if (prog >= pts[i][1] && prog <= pts[i+1][1]) {
      const local = (prog-pts[i][1])/(pts[i+1][1]-pts[i][1]);
      return pts[i][0] + (pts[i+1][0]-pts[i][0])*local;
    }
  }
  return pts[pts.length-1][0];
}
function sweep(f0, f1, dur, vol) {
  const sr = audioCtx.sampleRate, len = Math.floor(sr*dur);
  const buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const time = i/sr, prog = time/dur, f = f0 + (f1-f0)*prog;
    d[i] = Math.sin(2*Math.PI*f*time) * Math.sin(Math.PI*prog) * vol;
  }
  return buf;
}
function noiseBurst(dur, vol) {
  const sr = audioCtx.sampleRate, len = Math.floor(sr*dur);
  const buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const time = i/sr, f = 260 + Math.random()*520;
    d[i] = (Math.sin(2*Math.PI*f*time) + (Math.random()*2-1)*0.4) * Math.exp(-time*16) * vol;
  }
  return buf;
}
function arpeggio(notes, dur, vol) {
  const sr = audioCtx.sampleRate, len = Math.floor(sr*dur);
  const buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  const step = dur/notes.length;
  for (let i = 0; i < len; i++) {
    const time = i/sr, idx = Math.min(notes.length-1, Math.floor(time/step));
    const nt = time - idx*step;
    d[i] = Math.sin(2*Math.PI*notes[idx]*nt) * Math.exp(-nt*7) * vol;
  }
  return buf;
}

function play(name) {
  if (!soundOn || !audioCtx || !buffers[name]) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const src = audioCtx.createBufferSource();
  src.buffer = buffers[name];
  const g = audioCtx.createGain();
  g.gain.value = 1;
  src.connect(g).connect(audioCtx.destination);
  src.start();
}

function toggleSound() {
  soundOn = !soundOn;
  localStorage.setItem('qx_sound', soundOn);
  applySoundUI();
  if (soundOn) play('click');
  toast(soundOn ? t('toast_sound_on') : t('toast_sound_off'));
}
function applySoundUI() {
  const btn = document.getElementById('soundBtn');
  btn.classList.toggle('active', soundOn);
  document.getElementById('soundOn').style.display = soundOn ? 'block' : 'none';
  document.getElementById('soundOff').style.display = soundOn ? 'none' : 'block';
  btn.setAttribute('aria-pressed', soundOn);
}

/* ============================================================
   5. LANGUAGE
   ============================================================ */
function toggleLanguage() {
  lang = lang === 'th' ? 'en' : 'th';
  localStorage.setItem('qx_lang', lang);
  applyLanguage();
  play('nav');
  toast(t('toast_lang'));
}

function applyLanguage() {
  document.documentElement.lang = lang;

  // Rebuild pages whose text is generated in JS so they pick up the new language
  if (typeof buildLabHome === 'function' &&
      document.getElementById('homePage')?.classList.contains('active')) {
    buildLabHome();
  }
  if (typeof renderCircuit === 'function' &&
      document.getElementById('circuitPage')?.classList.contains('active')) {
    renderCircuit();
  }
  if (typeof buildGroverPage === 'function' &&
      document.getElementById('corePage')?.classList.contains('active')) {
    buildGroverPage();
  }
  if (typeof refreshCoopLanguage === 'function' &&
      document.getElementById('coopPage')?.classList.contains('active')) {
    refreshCoopLanguage();
  }
  if (typeof updateLabGoalStrips === 'function') updateLabGoalStrips();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.getElementById('langBtn').querySelector('span').textContent = lang === 'th' ? 'EN' : 'TH';
  // header title
  if (currentTopic) {
    document.getElementById('headerTitle').textContent = t(TOPIC_META[currentTopic].key + '_title');
  }
  // game page bilingual elements
  document.querySelector('.game-page-header-number')?.setAttribute('data-i18n', 'game_eyebrow');
  const gp = document.getElementById('gamePage');
  if (gp) {
    const h = gp.querySelector('.game-page-header-number');
    if (h) h.textContent = t('game_eyebrow');
    const ht = gp.querySelector('.game-page-header-title');
    if (ht) ht.textContent = t('game_title');
    const hd = gp.querySelector('.game-page-header-desc');
    if (hd) hd.textContent = t('game_desc');
    const menu = gp.querySelector('.game-title');
    if (menu) menu.textContent = t('game_menu_title');
    const sub = gp.querySelector('.game-subtitle');
    if (sub) sub.textContent = t('game_menu_sub');
    const tag = gp.querySelector('.game-tagline');
    if (tag) tag.textContent = t('game_tagline');
    const start = gp.querySelector('.game-start-btn');
    if (start) start.textContent = t('game_start');
    const howTitle = gp.querySelector('.game-how-title');
    if (howTitle) howTitle.textContent = t('game_how_title');
    const howItems = gp.querySelectorAll('.game-how-text');
    const howTexts = [t('game_how_move'), t('game_how_split'), t('game_how_coh')];
    howItems.forEach((el, i) => { if (howTexts[i]) el.innerHTML = howTexts[i]; });
    const goTitle = gp.querySelector('.go-title');
    if (goTitle) goTitle.textContent = t('game_over_title');
    const goSub = gp.querySelector('.go-sub');
    if (goSub) goSub.textContent = t('game_over_sub');
    const goRetry = gp.querySelector('.go-retry');
    if (goRetry) goRetry.textContent = t('game_retry');
    // physics strip
    const chip = gp.querySelector('.chip');
    if (chip) chip.textContent = t('game_physics');
    const physNote = gp.querySelector('.challenge-strip span:last-child');
    if (physNote) physNote.textContent = t('game_phys_note');
  }
  renderProgress();
  redrawCurrent();
}

/* ============================================================
   6. NAVIGATION
   ============================================================ */
function stopAnimations() {
  S3.playing = false; cancelAnimationFrame(S3.raf);
  cancelAnimationFrame(S4.raf);
  cancelAnimationFrame(S5.raf);
  if (S5.batchTimer) { clearInterval(S5.batchTimer); S5.batchTimer = null; }
  cancelAnimationFrame(S6.raf);
  const b = document.getElementById('playBtn3');
  if (b) { b.querySelector('span').textContent = t('btn_play'); b.classList.remove('pressed'); }
}

function goHome() {
  stopContinuous();
  stopAnimations();
  if (typeof QR !== 'undefined' && QR.raf) cancelAnimationFrame(QR.raf);
  // Bring the mascot back if a page (e.g. co-op) hid it
  const ball = document.getElementById('ownerSpaceball');
  if (ball) ball.style.display = '';
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('homePage').classList.add('active');
  document.getElementById('headerTitle').textContent = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  play('nav');
  if (typeof buildLabHome === 'function') buildLabHome();
}

function openTopic(id) {
  stopContinuous();
  stopAnimations();
  // Station 4 is Qubit Runner — redirect to game page
  if (id === 4) { openGame(); return; }
  currentTopic = id;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('topic' + id + 'Page').classList.add('active');
  document.getElementById('headerTitle').textContent = t(TOPIC_META[id].key + '_title');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  requestAnimationFrame(() => {
    resizeCanvas(id); drawTopic(id);
    if (typeof refreshGoalStripSolved === 'function') refreshGoalStripSolved(id);
  });
}

function openGame() {
  stopContinuous();
  stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('gamePage').classList.add('active');
  document.getElementById('headerTitle').textContent = t('game_title');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  // resize and refresh game
  requestAnimationFrame(() => {
    if (QR.resize) QR.resize();
    updateGameMenu();
    QR.showMenu();
  });
}

function openCircuitPuzzle() {
  stopContinuous();
  stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('circuitPage').classList.add('active');
  document.getElementById('headerTitle').textContent = t('t7_title');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  if (typeof initCircuit7 === 'function') initCircuit7();
  applyLanguage();
}

function updateGameMenu() {
  const el = document.getElementById('menuHighScore');
  if (el && QR.highScore > 0) {
    el.textContent = 'BEST: ' + QR.highScore;
  }
}

function arcadeGlow(e, el) {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--my', (e.clientY - r.top) + 'px');
}

/* ============================================================
   7. BACKGROUND PARTICLES
   ============================================================ */
function buildBackground() {
  const c = document.getElementById('bgParticles');
  const colors = ['var(--cyan)', 'var(--violet)', 'var(--blue)'];
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('div');
    p.className = 'bg-particle';
    p.style.left = Math.random()*100 + '%';
    p.style.top = Math.random()*100 + '%';
    p.style.animationDelay = Math.random()*22 + 's';
    p.style.animationDuration = (16 + Math.random()*12) + 's';
    p.style.background = colors[i % 3];
    p.style.boxShadow = '0 0 8px currentColor';
    c.appendChild(p);
  }
}

/* ============================================================
   8. PROGRESS
   ============================================================ */
function markComplete(id) {
  if (progress[id]) return;
  progress[id] = true;
  localStorage.setItem('qx_progress', JSON.stringify(progress));
  // Keep lab station state in sync so cards show ONLINE without a reload
  if (typeof PUZZLE !== 'undefined' && PUZZLE[id]) PUZZLE[id].solved = true;
  if (typeof updateLabProgress === 'function') updateLabProgress();
  renderProgress();
  toast(t('toast_done'));
}
function renderProgress() {
  for (let i = 1; i <= 7; i++) {
    const badge = document.getElementById('status' + i);
    if (badge) badge.classList.toggle('done', !!progress[i]);
  }
  const done = Object.keys(progress).filter(k => progress[k]).length;
  const el = document.getElementById('progressSummary');
  if (el) el.textContent = t('progress_summary') + ': ' + done + '/' + (typeof STATIONS !== 'undefined' ? STATIONS.length : 7);
}

/* ============================================================
   9. HOME + TOPIC PAGE BUILDERS
   ============================================================ */
function buildHome() {
  const grid = document.getElementById('topicGrid');
  let html = '';
  for (let i = 1; i <= 6; i++) {
    const m = TOPIC_META[i];
    const rec = i === 1
      ? '<span class="badge" data-i18n="badge_recommended"></span>'
      : '<span class="topic-status" id="status' + i + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span>';
    // topic 1 also needs a status marker; place it after badge
    const statusForOne = i === 1
      ? '<span class="topic-status" id="status1" style="margin-left:8px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span>'
      : '';
    html += `
      <button class="topic-card" onclick="openTopic(${i})" onmousemove="cardGlow(event,this)" onpointerenter="play('hover')">
        <div class="topic-card-head">
          <div class="topic-icon">${m.icon}</div>
          <div style="display:flex;align-items:center;gap:8px">${rec}${statusForOne}</div>
        </div>
        <div class="topic-number">0${i} / QUANTUM</div>
        <div class="topic-title" data-i18n="${m.key}_title"></div>
        <div class="topic-desc" data-i18n="${m.key}_desc"></div>
      </button>`;
  }
  grid.innerHTML = html;
}

function cardGlow(e, el) {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--my', (e.clientY - r.top) + 'px');
}

const TOPIC_CONFIG = {
  1: {
    canvas: 'sim1',
    controls: [
      { id: 'slitSep', label: 'ctl_slit_sep', min: 20, max: 100, val: 55, unit: '' },
      { id: 'energy', label: 'ctl_energy', min: 10, max: 100, val: 55, unit: '' }
    ],
    buttons: [
      { fn: 'fireParticle1()', cls: 'btn-primary', label: 'btn_fire', sound: 'particle', icon: 'plus' },
      { fn: 'toggleContinuous1(this)', cls: 'btn-violet', label: 'btn_continuous', id: 'contBtn1', icon: 'play' },
      { fn: 'toggleWaveView1(this)', cls: 'btn-secondary', label: 'btn_wave_view', id: 'waveBtn1', icon: 'wave' },
      { fn: 'resetTopic(1)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [ { id: 'stParticles', label: 'stat_particles', val: '0' } ],
    hint: 'hint_slit'
  },
  2: {
    canvas: 'sim2',
    controls: [
      { id: 'theta', label: 'ctl_theta', min: 0, max: 180, val: 45, unit: '°' }
    ],
    buttons: [
      { fn: 'measure2()', cls: 'btn-primary', label: 'btn_measure', sound: 'measure', icon: 'search' },
      { fn: 'resetTopic(2)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [
      { id: 'stUp', label: 'stat_spin_up', val: '0' },
      { id: 'stDown', label: 'stat_spin_down', val: '0' },
      { id: 'stMeas', label: 'stat_measurements', val: '0' }
    ],
    hint: 'hint_bloch'
  },
  3: {
    canvas: 'sim3',
    controls: [
      { id: 'pwidth', label: 'ctl_width', min: 12, max: 100, val: 50, unit: '' },
      { id: 'tspeed', label: 'ctl_speed', min: 1, max: 5, val: 2, unit: '×' }
    ],
    buttons: [
      { fn: 'togglePlay3(this)', cls: 'btn-primary', label: 'btn_play', id: 'playBtn3', icon: 'play' },
      { fn: 'resetTopic(3)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [
      { id: 'stDx', label: 'stat_dx', val: '0.71' },
      { id: 'stDp', label: 'stat_dp', val: '0.71' },
      { id: 'stProd', label: 'stat_product', val: '0.50' }
    ],
    hint: 'hint_uncertainty'
  },
  4: {
    canvas: 'sim4',
    controls: [
      { id: 'bheight', label: 'ctl_barrier_h', min: 20, max: 100, val: 60, unit: '' },
      { id: 'bwidth', label: 'ctl_barrier_w', min: 10, max: 80, val: 30, unit: '' }
    ],
    buttons: [
      { fn: 'fireWave4()', cls: 'btn-primary', label: 'btn_fire_wave', sound: 'particle', icon: 'plus' },
      { fn: 'resetTopic(4)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [
      { id: 'stT', label: 'stat_transmission', val: '0%' },
      { id: 'stR', label: 'stat_reflection', val: '100%' }
    ],
    hint: 'hint_tunnel'
  },
  5: {
    canvas: 'sim5',
    controls: [
      { id: 'angA', label: 'ctl_angle_a', min: 0, max: 180, val: 0, unit: '°' },
      { id: 'angB', label: 'ctl_angle_b', min: 0, max: 180, val: 0, unit: '°' }
    ],
    buttons: [
      { fn: 'measureEnt5()', cls: 'btn-primary', label: 'btn_measure', sound: 'measure', icon: 'search' },
      { fn: 'measureBatch5()', cls: 'btn-violet', label: 'btn_run_many', sound: 'prepare', icon: 'bolt' },
      { fn: 'resetTopic(5)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [
      { id: 'stCorr', label: 'stat_correlation', val: '—' },
      { id: 'stTrials', label: 'stat_trials', val: '0' }
    ],
    hint: 'hint_entangle'
  },
  6: {
    canvas: 'sim6',
    controls: [
      { id: 'waitT', label: 'ctl_wait', min: 1, max: 10, val: 3, unit: '' }
    ],
    buttons: [
      { fn: 'prepareCat6()', cls: 'btn-violet', label: 'btn_prepare_exp', sound: 'prepare', icon: 'bolt' },
      { fn: 'openBox6()', cls: 'btn-primary', label: 'btn_open_box', sound: 'measure', icon: 'eye' },
      { fn: 'resetTopic(6)', cls: 'btn-secondary', label: 'btn_reset', icon: 'reset' }
    ],
    stats: [
      { id: 'stAlive', label: 'stat_alive', val: '0' },
      { id: 'stDead', label: 'stat_dead', val: '0' },
      { id: 'stTotal', label: 'stat_trials', val: '0' }
    ],
    hint: 'hint_schrodinger'
  }
};

const ICONS = {
  plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  play: '<polygon points="6 4 20 12 6 20 6 4"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  wave: '<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>'
};

function svg(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
}

function buildTopics() {
  const host = document.getElementById('topicsHost');
  let out = '';
  for (let i = 1; i <= 6; i++) {
    const cfg = TOPIC_CONFIG[i];
    const m = TOPIC_META[i];

    const controls = cfg.controls.map(c => `
      <div class="control-group">
        <div class="control-label">
          <span data-i18n="${c.label}"></span>
          <span class="control-value" id="${c.id}Val">${c.val}${c.unit}</span>
        </div>
        <input type="range" class="slider" id="${c.id}" min="${c.min}" max="${c.max}" value="${c.val}"
          oninput="onSlider(${i}, this)" aria-label="${t(c.label)}">
      </div>`).join('');

    const buttons = cfg.buttons.map(b => `
      <button class="btn ${b.cls}" ${b.id ? 'id="' + b.id + '"' : ''} onclick="${b.sound ? "play('" + b.sound + "');" : ''}${b.fn}">
        ${svg(b.icon)}<span data-i18n="${b.label}"></span>
      </button>`).join('');

    const stats = cfg.stats.map(s => `
      <div class="stat-item">
        <div class="stat-value" id="${s.id}">${s.val}</div>
        <div class="stat-label" data-i18n="${s.label}"></div>
      </div>`).join('');

    out += `
      <div class="page" id="topic${i}Page">
        <div class="topic-page">
          <button class="back-btn" onclick="goHome()">${svg('back')}<span data-i18n="nav_back"></span></button>
          <div class="topic-header">
            <div class="topic-header-number">0${i} / ${m.key.toUpperCase()}</div>
            <h1 class="topic-header-title" data-i18n="${m.key}_title"></h1>
            <p class="topic-header-desc" data-i18n="${m.key}_desc"></p>
          </div>
          <div class="howto-strip">
            <div class="howto-title" data-i18n="howto_title"></div>
            <div class="howto-steps">
              <div class="howto-step"><span class="howto-num">1</span><span class="howto-text" data-i18n="${m.key}_how1"></span></div>
              <div class="howto-step"><span class="howto-num">2</span><span class="howto-text" data-i18n="${m.key}_how2"></span></div>
              <div class="howto-step"><span class="howto-num">3</span><span class="howto-text" data-i18n="${m.key}_how3"></span></div>
            </div>
          </div>
          <div class="simulation-container">
            <div class="sim-canvas-wrap">
              <canvas id="${cfg.canvas}"></canvas>
              <div class="sim-hint" data-i18n="${cfg.hint}"></div>
            </div>
            <div class="controls-panel">${controls}</div>
            <div class="btn-group">${buttons}</div>
            <div class="stats-panel">${stats}</div>
          </div>
          <div class="quiz-section">
            <div class="quiz-tag" data-i18n="predict_tag"></div>
            <h3 class="quiz-question" data-i18n="${m.key}_q"></h3>
            <div class="quiz-options">
              <button class="quiz-option" onclick="answer(${i},'a',this)"><span data-i18n="${m.key}_a"></span></button>
              <button class="quiz-option" onclick="answer(${i},'b',this)"><span data-i18n="${m.key}_b"></span></button>
              <button class="quiz-option" onclick="answer(${i},'c',this)"><span data-i18n="${m.key}_c"></span></button>
            </div>
            <div id="feedback${i}"></div>
          </div>
        </div>
      </div>`;
  }
  host.innerHTML = out;
}

function onSlider(topic, el) {
  const cfg = TOPIC_CONFIG[topic];
  const c = cfg.controls.find(x => x.id === el.id);
  document.getElementById(el.id + 'Val').textContent = el.value + (c ? c.unit : '');
  play('hover');
  // live updates
  if (topic === 1) drawSlit();
  if (topic === 2) drawBloch();
  if (topic === 3) updateUncertainty();
  if (topic === 4) drawTunnel();
  if (topic === 5) drawEntangle();
}

/* ============================================================
   10. QUIZ
   ============================================================ */
function answer(topic, choice, btn) {
  const opts = btn.parentElement.querySelectorAll('.quiz-option');
  opts.forEach(o => o.disabled = true);
  const correct = QUIZ[topic].correct;
  const fb = document.getElementById('feedback' + topic);
  const m = TOPIC_META[topic];

  if (choice === correct) {
    btn.classList.add('correct');
    fb.innerHTML = '<div class="quiz-feedback correct"><strong>' + t('correct_label') +
      '</strong><span class="body" data-i18n="' + m.key + '_explain">' + t(m.key + '_explain') + '</span></div>';
    play('success');
    confetti();
    markComplete(topic);
  } else {
    btn.classList.add('incorrect');
    // reveal correct one
    opts.forEach(o => {
      if (o.getAttribute('onclick').includes("'" + correct + "'")) o.classList.add('correct');
    });
    fb.innerHTML = '<div class="quiz-feedback incorrect"><strong>' + t('incorrect_label') +
      '</strong><span class="body" data-i18n="' + m.key + '_explain">' + t(m.key + '_explain') + '</span></div>';
    play('error');
  }
}

/* ============================================================
   11. CANVAS HELPERS (high-DPI)
   ============================================================ */
const CV = {};   // per-canvas {canvas, ctx, w, h}

function setupCanvases() {
  for (let i = 1; i <= 6; i++) prepCanvas('sim' + i);
}
function prepCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  CV[id] = { canvas, ctx, w: 0, h: 0 };
  sizeCanvas(id);
}
function sizeCanvas(id) {
  const o = CV[id];
  if (!o) return;
  const rect = o.canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(rect.width, 10), h = Math.max(rect.height, 10);
  o.canvas.width = Math.floor(w * dpr);
  o.canvas.height = Math.floor(h * dpr);
  o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  o.w = w; o.h = h;
}
function resizeCanvas(topic) { sizeCanvas('sim' + topic); }

function drawTopic(id) {
  switch (id) {
    case 1: drawSlit(); break;
    case 2: drawBloch(); break;
    case 3: drawUncertainty(); break;
    case 4: drawTunnel(); break;
    case 5: drawEntangle(); break;
    case 6: drawCatBox(); break;
  }
}
function redrawCurrent() {
  if (currentTopic) { sizeCanvas('sim' + currentTopic); drawTopic(currentTopic); }
}
function val(id) { const e = document.getElementById(id); return e ? parseFloat(e.value) : 0; }

/* small drawing utils */
function glowDot(ctx, x, y, r, color, glow) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r * 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function label(ctx, text, x, y, color, size, align) {
  ctx.fillStyle = color || '#9aa6c8';
  ctx.font = (size || 12) + 'px Inter, Kanit, sans-serif';
  ctx.textAlign = align || 'left';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
}

/* ============================================================
   12. TOPIC 1 — DOUBLE SLIT
   ============================================================ */
const S1 = { hits: [], waveView: false, anim: null };

function drawSlit() {
  const o = CV.sim1; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  if (typeof checkStation1Match === 'function') checkStation1Match();

  const wallX = w * 0.34;
  const screenX = w * 0.82;
  const cy = h / 2;
  const sep = val('slitSep');
  const energy = val('energy');
  const lambda = (120 - energy) * 0.55 + 6;

  // source glow
  glowDot(ctx, w * 0.08, cy, 5, 'rgba(34,224,255,0.9)', true);
  label(ctx, t('lbl_source'), w * 0.02, cy - 18, '#9aa6c8', 12);

  // beam lines to slits
  ctx.strokeStyle = 'rgba(34,224,255,0.15)'; ctx.lineWidth = 1;
  [cy - sep/2, cy + sep/2].forEach(sy => {
    ctx.beginPath(); ctx.moveTo(w*0.08, cy); ctx.lineTo(wallX, sy); ctx.stroke();
  });

  // wall with two slits
  const slitH = 12;
  ctx.fillStyle = '#1b2145';
  ctx.fillRect(wallX - 7, 0, 14, cy - sep/2 - slitH/2);
  ctx.fillRect(wallX - 7, cy - sep/2 + slitH/2, 14, sep - slitH);
  ctx.fillRect(wallX - 7, cy + sep/2 + slitH/2, 14, h - (cy + sep/2 + slitH/2));
  label(ctx, t('lbl_double_slit'), wallX - 34, 22, '#9aa6c8', 12);

  // wave view overlay (intensity curve on screen)
  if (S1.waveView) {
    ctx.beginPath();
    for (let y = 8; y < h - 8; y += 2) {
      const I = intensity1(y, cy, sep, lambda, wallX, screenX, h);
      const x = screenX + 10 + I * 46;
      if (y === 8) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(155,123,255,0.85)'; ctx.lineWidth = 2; ctx.stroke();
    // interference bands (soft)
    for (let y = 8; y < h - 8; y += 2) {
      const I = intensity1(y, cy, sep, lambda, wallX, screenX, h);
      ctx.fillStyle = 'rgba(34,224,255,' + (I * 0.16) + ')';
      ctx.fillRect(screenX + 8, y, 8, 2);
    }
  }

  // detection screen
  ctx.fillStyle = '#0c1330';
  ctx.fillRect(screenX + 8, 8, 10, h - 16);
  ctx.strokeStyle = 'rgba(150,175,255,0.25)'; ctx.strokeRect(screenX + 8, 8, 10, h - 16);
  label(ctx, t('lbl_screen'), screenX - 8, 22, '#9aa6c8', 12);

  // accumulated hits
  S1.hits.forEach(hy => {
    ctx.fillStyle = 'rgba(34,224,255,0.85)';
    ctx.fillRect(screenX + 8, hy - 1, 10, 2.4);
  });

  // in-flight particle
  if (S1.fly) {
    glowDot(ctx, S1.fly.x, S1.fly.y, 4, 'rgba(120,240,255,1)', true);
  }
}

function intensity1(y, cy, sep, lambda, wallX, screenX, h) {
  const D = screenX - wallX;
  const r1 = Math.hypot(D, y - (cy - sep/2));
  const r2 = Math.hypot(D, y - (cy + sep/2));
  const phase = 2 * Math.PI * (r2 - r1) / lambda;
  const interf = Math.cos(phase / 2) ** 2;
  const envelope = Math.exp(-(((y - cy) / (h * 0.34)) ** 2));
  return interf * envelope;
}

function sampleHit1() {
  const o = CV.sim1; const { w, h } = o;
  const cy = h / 2, sep = val('slitSep'), energy = val('energy');
  const lambda = (120 - energy) * 0.55 + 6;
  const wallX = w * 0.34, screenX = w * 0.82;
  // rejection sampling on intensity
  for (let k = 0; k < 60; k++) {
    const y = 10 + Math.random() * (h - 20);
    const I = intensity1(y, cy, sep, lambda, wallX, screenX, h);
    if (Math.random() < I) return y;
  }
  return cy + (Math.random() - 0.5) * h * 0.5;
}

function fireParticle1(animate) {
  const o = CV.sim1; if (!o) return;
  const { w, h } = o;
  const hy = sampleHit1();
  const cy = h / 2, sep = val('slitSep');
  const wallX = w * 0.34, screenX = w * 0.82;
  const slitY = Math.random() < 0.5 ? cy - sep/2 : cy + sep/2;

  if (animate === false) {
    S1.hits.push(hy);
    document.getElementById('stParticles').textContent = S1.hits.length;
    drawSlit();
    return;
  }

  // animate: source -> slit -> screen
  const path = [
    { x: w * 0.08, y: cy },
    { x: wallX, y: slitY },
    { x: screenX + 12, y: hy }
  ];
  let t0 = 0;
  cancelAnimationFrame(S1.fly && S1.fly.raf);
  const step = () => {
    t0 += 0.06;
    const seg = t0 < 0.5 ? 0 : 1;
    const local = seg === 0 ? t0 / 0.5 : (t0 - 0.5) / 0.5;
    const a = path[seg], b = path[seg + 1];
    S1.fly = { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
    drawSlit();
    if (t0 < 1) { S1.fly.raf = requestAnimationFrame(step); }
    else {
      S1.fly = null;
      S1.hits.push(hy);
      document.getElementById('stParticles').textContent = S1.hits.length;
      play('collision');
      drawSlit();
    }
  };
  step();
}

function toggleContinuous1(btn) {
  if (continuousTimer) { stopContinuous(); btn.querySelector('span').textContent = t('btn_continuous'); btn.classList.remove('pressed'); return; }
  btn.querySelector('span').textContent = t('btn_continuous_stop');
  btn.classList.add('pressed');
  continuousTimer = setInterval(() => {
    fireParticle1(false);
    if (S1.hits.length % 12 === 0) play('particle');
  }, 55);
}
function stopContinuous() {
  if (continuousTimer) { clearInterval(continuousTimer); continuousTimer = null; }
  const b = document.getElementById('contBtn1');
  if (b) { b.querySelector('span').textContent = t('btn_continuous'); b.classList.remove('pressed'); }
}
function toggleWaveView1(btn) {
  S1.waveView = !S1.waveView;
  btn.querySelector('span').textContent = S1.waveView ? t('btn_wave_view_off') : t('btn_wave_view');
  btn.classList.toggle('pressed', S1.waveView);
  play('click');
  drawSlit();
}

/* ============================================================
   13. TOPIC 2 — BLOCH SPHERE / SUPERPOSITION
   ============================================================ */
const S2 = { up: 0, down: 0, flip: null };

function drawBloch() {
  // Station 2 reframed: a coin balancing on a tilting table (see-saw beam).
  // Level table (θ=90) = 50:50. Full tilt = a certain outcome. The coin shows a
  // green "0" wedge and red "1" wedge sized by probability — it is genuinely BOTH
  // until measured (no hidden pre-set face), the anti-determinism point made visual.
  const o = CV.sim2; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  const theta = val('theta');                        // 0..180
  const p0 = Math.cos(theta * Math.PI / 360) ** 2;   // cos²(θ/2) — chance of 0
  const p1 = 1 - p0;
  const balanced = Math.abs(theta - 90) <= 5;

  const pivotX = w * 0.40, pivotY = h * 0.60;
  const beamHalf = Math.min(w * 0.30, 150);
  const ang = (theta - 90) / 90 * (30 * Math.PI / 180); // θ<90 → left(0) end drops

  // balance glow near 50:50
  if (balanced) {
    const g = ctx.createRadialGradient(pivotX, pivotY, 4, pivotX, pivotY, beamHalf * 1.5);
    g.addColorStop(0, 'rgba(52,224,138,0.22)');
    g.addColorStop(1, 'rgba(52,224,138,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(pivotX, pivotY, beamHalf * 1.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(ang);

  // beam
  const beamH = 12;
  const bgrad = ctx.createLinearGradient(-beamHalf, 0, beamHalf, 0);
  bgrad.addColorStop(0, 'rgba(52,224,138,0.55)');
  bgrad.addColorStop(0.5, 'rgba(150,175,255,0.32)');
  bgrad.addColorStop(1, 'rgba(255,107,125,0.55)');
  rrect(ctx, -beamHalf, -beamH / 2, beamHalf * 2, beamH, 6);
  ctx.fillStyle = bgrad; ctx.fill();
  ctx.strokeStyle = balanced ? 'rgba(52,224,138,0.9)' : 'rgba(150,175,255,0.5)';
  ctx.lineWidth = 1.5; ctx.stroke();
  label(ctx, '0', -beamHalf - 2, -14, '#34e08a', 15, 'center');
  label(ctx, '1', beamHalf + 2, -14, '#ff6b7d', 15, 'center');

  // coin slides toward the LOW end; wedge split by probability
  const coinLocalX = (p1 - p0) * beamHalf * 0.82;
  drawCoin(ctx, coinLocalX, -beamH / 2 - 28, 26, p0, S2.flip);
  ctx.restore();

  // fulcrum (upright)
  ctx.fillStyle = 'rgba(150,175,255,0.5)';
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY + 2);
  ctx.lineTo(pivotX - 18, pivotY + 46);
  ctx.lineTo(pivotX + 18, pivotY + 46);
  ctx.closePath(); ctx.fill();

  // caption
  label(ctx,
    balanced ? (lang === 'th' ? '⚖ สมดุล 50:50' : '⚖ Balanced 50:50')
             : (lang === 'th' ? 'ลากโต๊ะให้สมดุล' : 'tilt it level'),
    pivotX, pivotY + 72, balanced ? '#34e08a' : '#9aa6c8', 13, 'center');

  // right side: probability bars + measurement histogram
  const bx = w * 0.76, bw = w * 0.16, top = h * 0.16, barH = 26;
  label(ctx, lang === 'th' ? 'โอกาสวัดได้' : 'chance of', bx, top - 12, '#9aa6c8', 12);
  drawProbBar(ctx, bx, top, bw, barH, p0, '0', '#34e08a');
  drawProbBar(ctx, bx, top + 44, bw, barH, p1, '1', '#ff6b7d');

  const total = S2.up + S2.down;
  label(ctx, t('stat_measurements'), bx, top + 108, '#9aa6c8', 12);
  const hgY = top + 120, hgH = 70;
  const upFrac = total ? S2.up / total : 0;
  const dnFrac = total ? S2.down / total : 0;
  ctx.fillStyle = 'rgba(52,224,138,0.75)';
  ctx.fillRect(bx, hgY + hgH * (1 - upFrac), bw / 2 - 4, hgH * upFrac);
  ctx.fillStyle = 'rgba(255,107,125,0.75)';
  ctx.fillRect(bx + bw / 2 + 4, hgY + hgH * (1 - dnFrac), bw / 2 - 4, hgH * dnFrac);
  ctx.strokeStyle = 'rgba(150,175,255,0.2)';
  ctx.strokeRect(bx, hgY, bw / 2 - 4, hgH);
  ctx.strokeRect(bx + bw / 2 + 4, hgY, bw / 2 - 4, hgH);
  label(ctx, '0', bx + bw / 4 - 4, hgY + hgH + 14, '#9aa6c8', 11, 'center');
  label(ctx, '1', bx + bw * 3 / 4, hgY + hgH + 14, '#9aa6c8', 11, 'center');
}

// rounded-rect path helper
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// coin: a disc split green(0)/red(1) by probability; squashes mid-flip
function drawCoin(ctx, x, y, r, p0, flip) {
  ctx.save();
  ctx.translate(x, y);
  let faceP0 = p0, squash = 1;
  if (flip) {
    squash = Math.max(0.08, Math.abs(Math.cos(flip.spin)));
    if (flip.settled) faceP0 = flip.result === 'up' ? 1 : 0;
  }
  ctx.scale(squash, 1);

  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = 'rgba(255,107,125,0.92)';           // 1 (top)
  ctx.fillRect(-r, -r, 2 * r, 2 * r);
  const gh = 2 * r * faceP0;                           // 0 fills lower fraction
  ctx.fillStyle = 'rgba(52,224,138,0.94)';
  ctx.fillRect(-r, r - gh, 2 * r, gh);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-r, r - gh); ctx.lineTo(r, r - gh); ctx.stroke();
  ctx.restore();

  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.stroke();
  if (squash > 0.6) {
    label(ctx, '1', 0, -r * 0.42, 'rgba(255,255,255,0.85)', 12, 'center');
    label(ctx, '0', 0, r * 0.66, 'rgba(6,18,10,0.9)', 12, 'center');
  }
  ctx.restore();
}

function drawProbBar(ctx, x, y, wBar, hBar, frac, tag, color) {
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(x, y, wBar, hBar);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, wBar * frac, hBar);
  label(ctx, tag, x - 26, y + hBar - 8, '#eef3ff', 13);
  label(ctx, (frac*100).toFixed(0) + '%', x + wBar + 6, y + hBar - 8, '#9aa6c8', 12);
}

function measure2() {
  const o = CV.sim2; if (!o) return;
  if (S2.flip && !S2.flip.settled) return;            // ignore taps mid-flip
  const theta = val('theta');
  const p0 = Math.cos(theta * Math.PI / 360) ** 2;
  const result = Math.random() < p0 ? 'up' : 'down';  // 'up' = 0, 'down' = 1
  play('measure');

  const tally = () => {
    if (result === 'up') S2.up++; else S2.down++;
    document.getElementById('stUp').textContent = S2.up;
    document.getElementById('stDown').textContent = S2.down;
    document.getElementById('stMeas').textContent = S2.up + S2.down;
    play(result === 'up' ? 'success' : 'collision');
    if (typeof checkStation2Super === 'function') checkStation2Super();
  };

  // reduced-motion: skip the spin, settle at once
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    S2.flip = { spin: Math.PI * 6, settled: true, result };
    tally(); drawBloch();
    setTimeout(() => { S2.flip = null; drawBloch(); }, 600);
    return;
  }

  // spin with a strong ease-out, then land on one face
  S2.flip = { spin: 0, settled: false, result };
  const dur = 620;
  let start = null;
  const step = (ts) => {
    if (start === null) start = ts;
    const t = Math.min(1, (ts - start) / dur);
    if (t >= 1) {
      S2.flip.spin = Math.PI * 6;            // land flat (cos = 1 → no squash)
      S2.flip.settled = true;
      tally(); drawBloch();
      setTimeout(() => { S2.flip = null; drawBloch(); }, 650);  // re-arm to superposition
      return;
    }
    const eased = 1 - Math.pow(1 - t, 3);     // strong ease-out
    S2.flip.spin = eased * Math.PI * 6;
    drawBloch();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// drag to rotate
function initBlochDrag() {
  const o = CV.sim2; if (!o) return;
  const canvas = o.canvas;
  let dragging = false, lastX;
  const down = e => {
    dragging = true; lastX = pointer(e, canvas).x;
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  };
  const move = e => {
    if (!dragging) return;
    const p = pointer(e, canvas);
    const dx = p.x - lastX; lastX = p.x;
    const thEl = document.getElementById('theta');
    if (!thEl) return;
    // drag right → tilt toward 1, drag left → tilt toward 0
    let th = Math.max(0, Math.min(180, parseFloat(thEl.value) + dx * 0.6));
    thEl.value = th.toFixed(0);
    const tv = document.getElementById('thetaVal'); if (tv) tv.textContent = th.toFixed(0) + '°';
    drawBloch();
  };
  const up = () => { dragging = false; };
  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
}
function pointer(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

/* ============================================================
   14. TOPIC 3 — UNCERTAINTY
   ============================================================ */
const S3 = { playing: false, time: 0, raf: null };

function sigmaX() { return 0.25 + (val('pwidth') / 100) * 1.6; }  // 0.25 .. 1.85

function updateUncertainty() {
  const sx0 = sigmaX();
  const sp = 0.5 / sx0;                       // minimum-uncertainty at t=0 (ħ=1)
  const sx = sx0 * Math.sqrt(1 + (S3.time) ** 2);
  const prod = sx * sp;
  document.getElementById('stDx').textContent = sx.toFixed(2);
  document.getElementById('stDp').textContent = sp.toFixed(2);
  document.getElementById('stProd').textContent = prod.toFixed(2);
  drawUncertainty();
  if (typeof checkStation3Spec === 'function') checkStation3Spec();
}

function drawUncertainty() {
  const o = CV.sim3; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  const sx0 = sigmaX();
  const sp = 0.5 / sx0;
  const sx = sx0 * Math.sqrt(1 + (S3.time) ** 2);

  const midY = h / 2;
  // dividers
  ctx.strokeStyle = 'rgba(150,175,255,0.12)';
  ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

  // position space (top)
  drawGaussianPanel(ctx, 0, 8, w, midY - 16, sx, '#22e0ff', t('lbl_pos_space'), 1.9);
  // momentum space (bottom)
  drawGaussianPanel(ctx, 0, midY + 8, w, midY - 16, sp, '#9b7bff', t('lbl_mom_space'), 1.9);

  // Heisenberg readout
  const prod = (sx * sp).toFixed(2);
  ctx.font = '15px JetBrains Mono, monospace';
  ctx.fillStyle = prod <= 0.51 ? '#34e08a' : '#22e0ff';
  ctx.textAlign = 'right';
  ctx.fillText('Δx·Δp = ' + prod + '  ≥  0.50', w - 16, 24);
  ctx.textAlign = 'left';
}

function drawGaussianPanel(ctx, x, y, pw, ph, sigma, color, title, refSigma) {
  label(ctx, title, x + 14, y + 18, '#9aa6c8', 12);
  const cx = x + pw / 2, baseY = y + ph - 10;
  const amp = ph - 34;
  // normalize width visually: bigger sigma -> wider, shorter
  const widthScale = pw * 0.42;
  ctx.beginPath();
  for (let i = 0; i <= pw; i += 2) {
    const rel = (i - pw/2) / widthScale;
    const g = Math.exp(-(rel*rel) / (2 * (sigma/refSigma) ** 2));
    const yy = baseY - g * amp;
    if (i === 0) ctx.moveTo(x + i, yy); else ctx.lineTo(x + i, yy);
  }
  ctx.lineTo(x + pw, baseY); ctx.lineTo(x, baseY); ctx.closePath();
  ctx.fillStyle = hexA(color, 0.28);
  ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();

  // width arrows
  const half = widthScale * (sigma / refSigma);
  ctx.strokeStyle = hexA(color, 0.6); ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - half, baseY + 4); ctx.lineTo(cx + half, baseY + 4); ctx.stroke();
}
function hexA(hex, a) {
  const h = hex.replace('#','');
  const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function togglePlay3(btn) {
  S3.playing = !S3.playing;
  btn.querySelector('span').textContent = S3.playing ? t('btn_pause') : t('btn_play');
  btn.classList.toggle('pressed', S3.playing);
  play('click');
  if (S3.playing) loop3(); else cancelAnimationFrame(S3.raf);
}
function loop3() {
  if (!S3.playing) return;
  S3.time += 0.012 * val('tspeed');
  if (S3.time > 3) S3.time = 0;
  updateUncertainty();
  S3.raf = requestAnimationFrame(loop3);
}

/* ============================================================
   15. TOPIC 4 — TUNNELING
   ============================================================ */
const S4 = { packet: null, raf: null, T: 0, R: 1 };

function drawTunnel() {
  const o = CV.sim4; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  const bh = val('bheight'), bw = val('bwidth');
  const barrierX = w * 0.5 - (bw * w / 200);
  const barrierW = bw * w / 100;
  const barrierPix = (bh / 100) * (h * 0.6);
  const baseY = h * 0.78;

  // ground line
  ctx.strokeStyle = 'rgba(150,175,255,0.2)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();

  // barrier
  const bg = ctx.createLinearGradient(0, baseY - barrierPix, 0, baseY);
  bg.addColorStop(0, 'rgba(155,123,255,0.65)');
  bg.addColorStop(1, 'rgba(155,123,255,0.2)');
  ctx.fillStyle = bg;
  ctx.fillRect(barrierX, baseY - barrierPix, barrierW, barrierPix);
  ctx.strokeStyle = 'rgba(155,123,255,0.8)';
  ctx.strokeRect(barrierX, baseY - barrierPix, barrierW, barrierPix);
  label(ctx, t('lbl_barrier'), barrierX + barrierW/2, baseY - barrierPix - 10, '#c4b5ff', 12, 'center');

  // energy line of the particle (fixed, below barrier top)
  const eY = baseY - h * 0.32;
  ctx.strokeStyle = 'rgba(34,224,255,0.5)'; ctx.setLineDash([6,5]);
  ctx.beginPath(); ctx.moveTo(0, eY); ctx.lineTo(w, eY); ctx.stroke();
  ctx.setLineDash([]);
  label(ctx, 'E', 6, eY - 6, 'rgba(34,224,255,0.8)', 12);

  // packet
  const p = S4.packet;
  if (p) {
    drawPacket(ctx, w, h, baseY, p, barrierX, barrierW);
  } else {
    label(ctx, t('lbl_incoming'), w*0.12, eY - 14, '#9aa6c8', 12);
  }

  // readouts
  label(ctx, t('lbl_reflected') + ': ' + (S4.R*100).toFixed(0) + '%', w*0.04, 26, '#ff9db0', 13);
  ctx.textAlign = 'right';
  label(ctx, t('lbl_transmitted') + ': ' + (S4.T*100).toFixed(0) + '%', w - 16, 26, '#34e08a', 13, 'right');
  ctx.textAlign = 'left';
}

function drawPacket(ctx, w, h, baseY, p, barrierX, barrierW) {
  const amp = h * 0.16;
  const drawGaussianWave = (center, scale, color) => {
    if (scale <= 0.01) return;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const rel = (x - center) / 34;
      const env = Math.exp(-rel*rel) * scale;
      const carrier = Math.cos(rel * 6);
      const y = baseY - h*0.32 - env * carrier * amp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  };

  if (p.phase === 'incoming') {
    drawGaussianWave(p.x, 1, 'rgba(34,224,255,0.95)');
  } else {
    // reflected (moving left) + transmitted (moving right)
    drawGaussianWave(p.reflX, Math.sqrt(S4.R), 'rgba(255,107,125,0.9)');
    drawGaussianWave(p.transX, Math.sqrt(S4.T), 'rgba(52,224,138,0.95)');
  }
}

function fireWave4() {
  const o = CV.sim4; if (!o) return;
  const { w } = o;
  const bh = val('bheight'), bw = val('bwidth');
  // pedagogical tunneling: T ≈ exp(-2κL), scaled for visible & engaging results
  const kappa = 0.015 + (bh / 100) * 0.055;
  S4.T = Math.min(0.95, Math.max(0.004, Math.exp(-kappa * bw * 2.2)));
  S4.R = 1 - S4.T;
  document.getElementById('stT').textContent = (S4.T*100).toFixed(0) + '%';
  document.getElementById('stR').textContent = (S4.R*100).toFixed(0) + '%';

  const barrierX = w * 0.5 - (bw * w / 200);
  const barrierW = bw * w / 100;
  const barrierCenter = barrierX + barrierW/2;
  S4.packet = { phase: 'incoming', x: w * 0.12, reflX: barrierCenter, transX: barrierCenter, barrierCenter };
  cancelAnimationFrame(S4.raf);

  let collided = false;
  const anim = () => {
    const p = S4.packet; if (!p) return;
    if (p.phase === 'incoming') {
      p.x += 4;
      if (p.x >= p.barrierCenter) {
        p.phase = 'split';
        p.reflX = p.barrierCenter;
        p.transX = p.barrierCenter;
        if (!collided) { play('collision'); collided = true; }
      }
    } else {
      p.reflX -= 4;
      p.transX += 4;
    }
    drawTunnel();
    const done = p.phase === 'split' && (p.transX > CV.sim4.w + 40 && p.reflX < -40);
    if (!done) S4.raf = requestAnimationFrame(anim);
  };
  anim();
}

/* ============================================================
   16. TOPIC 5 — ENTANGLEMENT (Bell Φ+)
   ============================================================ */
const S5 = { trials: 0, same: 0, flight: null, lastA: null, lastB: null, raf: null, batchTimer: null };

function matchProb5() {
  const da = (val('angA') - val('angB')) * Math.PI / 180;
  return Math.cos(da / 2) ** 2;   // Φ+ : same-result probability
}

function drawEntangle() {
  const o = CV.sim5; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  const cx = w/2, cy = h*0.42;
  const ax = w*0.16, bx = w*0.84;

  // link lines
  ctx.strokeStyle = 'rgba(34,224,255,0.2)'; ctx.setLineDash([5,6]); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, cy); ctx.stroke();
  ctx.setLineDash([]);

  // source
  glowDot(ctx, cx, cy, 10, 'rgba(155,123,255,0.9)', true);
  label(ctx, t('lbl_ent_source'), cx, cy - 24, '#c4b5ff', 12, 'center');

  // detectors
  drawDetector5(ctx, ax, cy, 'A', val('angA'), S5.lastA);
  drawDetector5(ctx, bx, cy, 'B', val('angB'), S5.lastB);

  // in-flight particles
  if (S5.flight) {
    glowDot(ctx, S5.flight.ax, cy, 6, 'rgba(120,240,255,1)');
    glowDot(ctx, S5.flight.bx, cy, 6, 'rgba(120,240,255,1)');
  }

  // theory curve of match probability vs angle difference
  const gx = w*0.14, gy = h*0.72, gw = w*0.72, gh = h*0.2;
  ctx.strokeStyle = 'rgba(150,175,255,0.25)';
  ctx.strokeRect(gx, gy, gw, gh);
  label(ctx, t('lbl_prob_same'), gx, gy - 8, '#9aa6c8', 11);
  ctx.beginPath();
  for (let i = 0; i <= gw; i += 2) {
    const dd = (i / gw) * 180 * Math.PI / 180;
    const pv = Math.cos(dd/2) ** 2;
    const yy = gy + gh - pv * gh;
    if (i === 0) ctx.moveTo(gx + i, yy); else ctx.lineTo(gx + i, yy);
  }
  ctx.strokeStyle = 'rgba(34,224,255,0.7)'; ctx.lineWidth = 2; ctx.stroke();
  // current angle-diff marker
  const diff = Math.abs(val('angA') - val('angB'));
  const mxp = gx + (diff/180)*gw;
  ctx.strokeStyle = 'rgba(255,107,125,0.8)';
  ctx.beginPath(); ctx.moveTo(mxp, gy); ctx.lineTo(mxp, gy+gh); ctx.stroke();
  // measured point
  if (S5.trials > 0) {
    const meas = S5.same / S5.trials;
    glowDot(ctx, mxp, gy + gh - meas*gh, 4, 'rgba(52,224,138,1)');
  }
  label(ctx, 'Δθ = ' + diff.toFixed(0) + '°', mxp + 6, gy + 14, '#ff9db0', 11);
}

function drawDetector5(ctx, x, y, tag, angle, result) {
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(34,224,255,0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(34,224,255,0.6)'; ctx.lineWidth = 2; ctx.stroke();
  const rad = angle * Math.PI / 180;
  ctx.strokeStyle = '#9b7bff'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(rad)*34, y - Math.sin(rad)*34);
  ctx.lineTo(x + Math.cos(rad)*34, y + Math.sin(rad)*34);
  ctx.stroke();
  if (result) {
    ctx.fillStyle = result === 'up' ? '#34e08a' : '#ff6b7d';
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI*2); ctx.fill();
    label(ctx, result === 'up' ? '↑' : '↓', x, y + 5, '#06121a', 14, 'center');
  }
  label(ctx, t('lbl_detector') + ' ' + tag, x, y + 50, '#eef3ff', 13, 'center');
  label(ctx, angle.toFixed(0) + '°', x, y + 68, '#9aa6c8', 12, 'center');
}

function doMeasure5() {
  const pSame = matchProb5();
  const a = Math.random() < 0.5 ? 'up' : 'down';
  const same = Math.random() < pSame;
  const b = same ? a : (a === 'up' ? 'down' : 'up');
  S5.lastA = a; S5.lastB = b;
  S5.trials++;
  if (a === b) S5.same++;
  document.getElementById('stTrials').textContent = S5.trials;
  document.getElementById('stCorr').textContent = (S5.same / S5.trials * 100).toFixed(0) + '%';
}

function measureEnt5() {
  const o = CV.sim5; if (!o) return;
  const { w } = o;
  const cx = w/2, ax = w*0.16, bx = w*0.84;
  S5.flight = { ax: cx, bx: cx };
  cancelAnimationFrame(S5.raf);
  let tt = 0;
  const anim = () => {
    tt += 0.06;
    S5.flight.ax = cx + (ax - cx) * tt;
    S5.flight.bx = cx + (bx - cx) * tt;
    drawEntangle();
    if (tt < 1) S5.raf = requestAnimationFrame(anim);
    else { S5.flight = null; doMeasure5(); play('measure'); drawEntangle(); }
  };
  anim();
}

function measureBatch5() {
  // Re-entrancy guard: ignore a second click while a batch is already running.
  if (S5.batchTimer) return;
  play('prepare');
  // Reset stats so each batch is judged on its own 40 trials, not a running
  // total across different detector-angle settings.
  S5.trials = 0; S5.same = 0;
  const stTrials = document.getElementById('stTrials');
  const stCorr = document.getElementById('stCorr');
  if (stTrials) stTrials.textContent = '0';
  if (stCorr) stCorr.textContent = '—';
  let n = 0;
  S5.batchTimer = setInterval(() => {
    doMeasure5(); n++;
    drawEntangle();
    if (n % 8 === 0) play('particle');
    if (n >= 40) {
      clearInterval(S5.batchTimer);
      S5.batchTimer = null;
      play('discover');
      const corrPct = S5.trials > 0 ? parseFloat((S5.same / S5.trials * 100).toFixed(0)) : 0;
      if (typeof checkStation5Bell === 'function') checkStation5Bell(S5.trials, corrPct);
    }
  }, 40);
}

/* ============================================================
   17. TOPIC 6 — SCHRÖDINGER'S CAT
   ============================================================ */
const S6 = { state: 'idle', alive: 0, dead: 0, result: null, pulse: 0, raf: null };

function drawCatBox() {
  const o = CV.sim6; if (!o) return;
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, w, h);

  const bx = w*0.28, by = h*0.2, bw = w*0.44, bh = h*0.56;

  // box
  ctx.strokeStyle = 'rgba(150,175,255,0.5)'; ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, bw, bh);
  // lid (open when result)
  if (S6.state === 'result') {
    ctx.strokeStyle = 'rgba(34,224,255,0.6)';
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw*0.5, by - h*0.12); ctx.lineTo(bx + bw, by); ctx.stroke();
  }

  // atom
  const atomX = bx + bw*0.24, atomY = by + bh*0.24;
  const pulse = S6.state === 'prepared' ? (Math.sin(S6.pulse)*0.5+0.5) : 0.2;
  glowDot(ctx, atomX, atomY, 8 + pulse*4, 'rgba(155,123,255,' + (0.5+pulse*0.5) + ')');
  label(ctx, t('lbl_atom'), atomX, atomY + 30, '#c4b5ff', 11, 'center');

  // poison
  const pX = bx + bw*0.72, pY = by + bh*0.2;
  const released = S6.state === 'result' && S6.result === 'dead';
  ctx.fillStyle = released ? 'rgba(255,107,125,0.7)' : 'rgba(52,224,138,0.5)';
  ctx.fillRect(pX - 10, pY, 20, 34);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.strokeRect(pX - 10, pY, 20, 34);
  label(ctx, t('lbl_poison'), pX, pY + 50, '#9aa6c8', 11, 'center');

  // cat
  const catX = bx + bw*0.5, catY = by + bh*0.72;
  if (S6.state === 'idle') drawCat(ctx, catX, catY, 'alive', 1);
  else if (S6.state === 'prepared') drawSuperCat(ctx, catX, catY);
  else drawCat(ctx, catX, catY, S6.result, 1);

  // status text
  let key = 'schr_idle';
  if (S6.state === 'prepared') key = 'schr_super';
  else if (S6.state === 'result') key = S6.result === 'alive' ? 'schr_alive' : 'schr_dead';
  ctx.fillStyle = '#22e0ff';
  ctx.font = '15px Inter, Kanit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t(key), w/2, h - 18);
  ctx.textAlign = 'left';
}

function drawCat(ctx, x, y, mood, alpha) {
  const color = mood === 'alive' ? '#34e08a' : '#ff6b7d';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  // body
  ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI*2); ctx.fill();
  // ears
  ctx.beginPath(); ctx.moveTo(x-22,y-14); ctx.lineTo(x-30,y-38); ctx.lineTo(x-8,y-22); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+22,y-14); ctx.lineTo(x+30,y-38); ctx.lineTo(x+8,y-22); ctx.closePath(); ctx.fill();
  // eyes
  ctx.fillStyle = '#06121a';
  if (mood === 'alive') {
    ctx.beginPath(); ctx.arc(x-9,y-4,3.4,0,Math.PI*2); ctx.arc(x+9,y-4,3.4,0,Math.PI*2); ctx.fill();
  } else {
    ctx.lineWidth = 2.4; ctx.strokeStyle = '#06121a';
    ctx.beginPath();
    ctx.moveTo(x-12,y-7); ctx.lineTo(x-6,y-1); ctx.moveTo(x-6,y-7); ctx.lineTo(x-12,y-1);
    ctx.moveTo(x+6,y-7); ctx.lineTo(x+12,y-1); ctx.moveTo(x+12,y-7); ctx.lineTo(x+6,y-1);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  label(ctx, t(mood === 'alive' ? 'cat_alive' : 'cat_dead'), x, y + 46, color, 13, 'center');
}

function drawSuperCat(ctx, x, y) {
  drawCat(ctx, x - 22, y, 'alive', 0.55);
  drawCat(ctx, x + 22, y, 'dead', 0.55);
  ctx.fillStyle = '#9b7bff';
  ctx.font = '13px Inter, Kanit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('50% / 50%', x, y + 66);
  ctx.fillText(t('cat_super'), x, y - 44);
  ctx.textAlign = 'left';
}

function prepareCat6() {
  S6.state = 'prepared';
  S6.result = null;
  animateSuper6();
}
function animateSuper6() {
  cancelAnimationFrame(S6.raf);
  const loop = () => {
    if (S6.state !== 'prepared') return;
    S6.pulse += 0.12;
    drawCatBox();
    S6.raf = requestAnimationFrame(loop);
  };
  loop();
}
function openBox6() {
  if (S6.state !== 'prepared') { toast(lang==='th' ? 'กด “เริ่มการทดลอง” ก่อนนะ' : 'Set up the experiment first'); return; }
  cancelAnimationFrame(S6.raf);
  const waitT = val('waitT');
  const pDead = 1 - Math.pow(0.5, waitT / 3);   // half-life = 3s
  const dead = Math.random() < pDead;
  S6.result = dead ? 'dead' : 'alive';
  S6.state = 'result';
  if (dead) { S6.dead++; play('error'); }
  else { S6.alive++; play('discover'); confetti(); }
  document.getElementById('stAlive').textContent = S6.alive;
  document.getElementById('stDead').textContent = S6.dead;
  document.getElementById('stTotal').textContent = S6.alive + S6.dead;
  drawCatBox();
  if (typeof logStation6Open === 'function') logStation6Open(!dead, waitT);
}

/* ============================================================
   21. SECRET DEBUG PANEL
   Click the logo 7 times quickly, or press ↑↑↓↓←→←→BA
   ============================================================ */
let debugClickCount = 0;
let debugClickTimer = null;

function debugUnlock() {
  const panel = document.getElementById('debugPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function debugClose() {
  document.getElementById('debugPanel').style.display = 'none';
}

function debugRepairAll() {
  // Reset all simulation states
  S1.hits = []; S1.fly = null; S1.waveView = false;
  stopContinuous();
  document.getElementById('stParticles') && (document.getElementById('stParticles').textContent = '0');
  drawSlit();

  S2.up = 0; S2.down = 0; S2.flip = null;
  document.getElementById('stUp') && (document.getElementById('stUp').textContent = '0');
  document.getElementById('stDown') && (document.getElementById('stDown').textContent = '0');
  document.getElementById('stMeas') && (document.getElementById('stMeas').textContent = '0');
  drawBloch();

  S3.playing = false; S3.time = 0;
  cancelAnimationFrame(S3.raf);
  const pb3 = document.getElementById('playBtn3');
  if (pb3) { pb3.querySelector('span').textContent = t('btn_play'); pb3.classList.remove('pressed'); }
  updateUncertainty();

  S4.packet = null; S4.T = 0; S4.R = 1;
  cancelAnimationFrame(S4.raf);
  document.getElementById('stT') && (document.getElementById('stT').textContent = '0%');
  document.getElementById('stR') && (document.getElementById('stR').textContent = '100%');
  drawTunnel();

  S5.trials = 0; S5.same = 0; S5.lastA = null; S5.lastB = null; S5.flight = null;
  cancelAnimationFrame(S5.raf);
  document.getElementById('stTrials') && (document.getElementById('stTrials').textContent = '0');
  document.getElementById('stCorr') && (document.getElementById('stCorr').textContent = '—');
  drawEntangle();

  S6.state = 'idle'; S6.alive = 0; S6.dead = 0; S6.result = null;
  cancelAnimationFrame(S6.raf);
  document.getElementById('stAlive') && (document.getElementById('stAlive').textContent = '0');
  document.getElementById('stDead') && (document.getElementById('stDead').textContent = '0');
  document.getElementById('stTotal') && (document.getElementById('stTotal').textContent = '0');
  drawCatBox();

  // Reset sliders to defaults
  const defaults = { slitSep:55, energy:55, theta:45, phi:30, pwidth:50, tspeed:2, bheight:60, bwidth:30, angA:0, angB:0, waitT:3 };
  for (const [id, val] of Object.entries(defaults)) {
    const el = document.getElementById(id);
    if (el) { el.value = val; el.dispatchEvent(new Event('input')); }
  }

  toast('🔧 All simulations repaired!');
}

function debugUnlockAll() {
  progress = {};
  for (let i = 1; i <= 7; i++) {
    progress[i] = true;
    if (typeof PUZZLE !== 'undefined' && PUZZLE[i]) PUZZLE[i].solved = true;
  }
  localStorage.setItem('qx_progress', JSON.stringify(progress));
  renderProgress();
  if (typeof buildLabHome === 'function' &&
      document.getElementById('homePage')?.classList.contains('active')) {
    buildLabHome();
  }
  if (typeof updateLabProgress === 'function') updateLabProgress(true);
  debugClose();
  toast('🔓 All 7 stations + Quantum Core unlocked!');
}

function debugUnlockGrover() {
  debugClose();
  // Jump straight into the Quantum Core demo, bypassing the lock
  if (typeof openQuantumCore === 'function') openQuantumCore();
  toast('⚡ Quantum Core opened!');
}

function debugCompleteGrover() {
  debugClose();
  // Auto-build the winning Grover circuit on station 7 and run it
  if (typeof openCircuitPuzzle === 'function' && typeof CIRCUIT !== 'undefined') {
    openCircuitPuzzle();
    setTimeout(() => {
      CIRCUIT.wires = [['H', 'ORACLE', 'DIFF', 'M'], ['H'], ['H']];
      CIRCUIT.hasRun = false;
      CIRCUIT.probs = null;
      renderCircuit();
      runCircuit7();
    }, 150);
  }
}

// Konami-style: ↑↑↓↓←→←→BA
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
  if (e.keyCode === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      debugUnlock();
    }
  } else {
    konamiIndex = e.keyCode === KONAMI[0] ? 1 : 0;
  }
});

// Logo click 7 times fast
const logoBtn = document.querySelector('.logo');
if (logoBtn) {
  logoBtn.addEventListener('click', () => {
    clearTimeout(debugClickTimer);
    debugClickCount++;
    if (debugClickCount >= 7) {
      debugClickCount = 0;
      debugUnlock();
    } else {
      debugClickTimer = setTimeout(() => { debugClickCount = 0; }, 1200);
    }
  });
}

/* ============================================================
   18. RESET
   ============================================================ */
function resetTopic(id) {
  play('click');
  switch (id) {
    case 1:
      stopContinuous(); S1.hits = []; S1.fly = null;
      document.getElementById('stParticles').textContent = '0';
      drawSlit(); break;
    case 2:
      S2.up = 0; S2.down = 0; S2.flip = null;
      document.getElementById('stUp').textContent = '0';
      document.getElementById('stDown').textContent = '0';
      document.getElementById('stMeas').textContent = '0';
      drawBloch(); break;
    case 3:
      S3.playing = false; S3.time = 0;
      cancelAnimationFrame(S3.raf);
      { const b = document.getElementById('playBtn3'); b.querySelector('span').textContent = t('btn_play'); b.classList.remove('pressed'); }
      updateUncertainty(); break;
    case 4:
      S4.packet = null; S4.T = 0; S4.R = 1;
      cancelAnimationFrame(S4.raf);
      document.getElementById('stT').textContent = '0%';
      document.getElementById('stR').textContent = '100%';
      drawTunnel(); break;
    case 5:
      S5.trials = 0; S5.same = 0; S5.lastA = null; S5.lastB = null; S5.flight = null;
      cancelAnimationFrame(S5.raf);
      document.getElementById('stTrials').textContent = '0';
      document.getElementById('stCorr').textContent = '—';
      drawEntangle(); break;
    case 6:
      S6.state = 'idle'; S6.alive = 0; S6.dead = 0; S6.result = null;
      cancelAnimationFrame(S6.raf);
      document.getElementById('stAlive').textContent = '0';
      document.getElementById('stDead').textContent = '0';
      document.getElementById('stTotal').textContent = '0';
      drawCatBox(); break;
  }
}

/* ============================================================
   19. EFFECTS
   ============================================================ */
function confetti() {
  const colors = ['#22e0ff', '#9b7bff', '#34e08a', '#eef3ff', '#4c86ff'];
  const c = document.createElement('div');
  c.className = 'confetti';
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.background = colors[i % colors.length];
    p.style.left = (48 + (Math.random()-0.5)*44) + '%';
    p.style.top = '38%';
    p.style.setProperty('transform', 'translateX(' + (Math.random()-0.5)*260 + 'px)');
    p.style.animationDelay = (Math.random()*0.25) + 's';
    p.style.animationDuration = (0.9 + Math.random()*0.7) + 's';
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 1800);
}

let toastTimer = null;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
}

/* ============================================================
   20. RESIZE
   ============================================================ */
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    for (let i = 1; i <= 6; i++) sizeCanvas('sim' + i);
    redrawCurrent();
  }, 150);
});

// init drag after canvases exist
window.addEventListener('load', () => {
  initBlochDrag();
  // draw all once so returning to a topic is instant
  drawSlit(); drawBloch(); updateUncertainty(); drawTunnel(); drawEntangle(); drawCatBox();
});
