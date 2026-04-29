-- Phase 10.3.1: Fill remaining effectively-missing Arabic product descriptions
-- for rows that were previously unmatched due to naming differences.
--
-- Rules enforced:
-- 1) Update only public.products.description_ar.
-- 2) Match only by exact (category_name_ar, product_name_ar).
-- 3) Update only when description_ar is effectively missing:
--    - NULL
--    - empty/whitespace
--    - equals category name placeholder
-- 4) No schema changes. No product/category/name/price/availability edits.

begin;

with description_map(category_name_ar, product_name_ar, new_description_ar) as (
  values
    ('باستا','سوسيس او برجر','باستا باختيار سوسيس أو برجر مع صوص غني وجبنة.'),

    ('بيتزا توسكانيني','الباستشيو','بيتزا دجاج متبل بطابع توسكانيني الخاص مع موتزاريلا وصوص مميز.'),
    ('بيتزا توسكانيني','تشيكن باربكيو','بيتزا دجاج متبل مع موتزاريلا وصوص باربكيو بطعم مدخن ومميز.'),
    ('بيتزا توسكانيني','سجق كيري','بيتزا سجق مع جبنة كيري وموتزاريلا بطعم كريمي غني.'),

    ('بيتزا لحوم','بيروني','بيتزا بيروني بطعم سبايسي خفيف مع موتزاريلا وصوص بيتزا.'),
    ('بيتزا لحوم','سوسيس','بيتزا سوسيس بطعم مدخن مع موتزاريلا وصوص مميز.'),
    ('بيتزا لحوم','مفروم','بيتزا لحم مفروم مع موتزاريلا وصوص غني بطعم مشبع.'),

    ('ساندوتشات فرنساوي','بوم فريت','ساندوتش بطاطس وصوص غني مناسب كاختيار خفيف.'),
    ('ساندوتشات فرنساوي','زينجر سوبريم','ساندوتش زينجر كرانشي بصوص غني وطعم سبايسي.'),
    ('ساندوتشات فرنساوي','سوسيس ميكسكانو','ساندوتش سوسيس بطابع ميكسكانو وصوص سبايسي متوازن.'),
    ('ساندوتشات فرنساوي','شاورما فراخ/شيش','ساندوتش فراخ متبلة مع صوص مميز وخضار طازة.'),
    ('ساندوتشات فرنساوي','شاورما لحم','ساندوتش شاورما لحم متبلة مع صوص خاص وخضار.'),
    ('ساندوتشات فرنساوي','فاهيتا فراخ / لحم','ساندوتش فاهيتا بخضار مشوح وصوص توسكانيني.'),

    ('ساندوتشات كيزر','كايزر','ساندوتش كايزر بسيط بطعم مشبع وصوص خاص.'),

    ('كريب توسكانيني','بيف ميجا','مكس بيف غني مع موتزاريلا وصوص توسكانيني بطعم قوي.'),
    ('كريب توسكانيني','تركي بيف','كريب بيف تقيل بمكس لحوم وموتزاريلا وصوص توسكانيني.'),
    ('كريب توسكانيني','تشيكن أوميجا','كريب دجاج كرانشي مع إضافات مدخنة، موتزاريلا، مخلل ألوان، وصوص توسكانيني.'),
    ('كريب توسكانيني','تشيكن باربكيو','دجاج كرانشي مع شاورما فراخ، موتزاريلا، مخلل ألوان، وصوص باربكيو بطعم مدخن.'),
    ('كريب توسكانيني','سيراتشا','كريب دجاج كرانشي بصوص سيراتشا سبايسي مع موتزاريلا وإضافات توسكانيني.'),

    ('كريب فراخ','برجر ع بانيه','كريب برجر بانيه دجاج مع جبنة وصوص غني.'),

    ('كريب لحوم','سوسيس','كريب سوسيس مدخن مع جبنة وصوص غني.'),
    ('كريب لحوم','مفروم','كريب لحم مفروم متبل مع جبنة وصوص توسكانيني.'),
    ('كريب لحوم','ميكس لحوم برجر ع سوسيس','كريب مكس لحوم يجمع البرجر والسوسيس مع موتزاريلا وصوص خاص.'),

    ('كريب متنوع','مشروم','كريب مشروم مع جبنة موتزاريلا وصوص كريمي خفيف.'),

    ('مشروبات','تويست','مشروب بارد مناسب مع الوجبات.'),
    ('مشروبات','فيروز','مشروب بارد بطعم خفيف ومنعش.'),

    ('مقبلات','استيك موزاريلا','أصابع موزاريلا مقرمشة من الخارج وسايحة من الداخل.'),
    ('مقبلات','باكت كرانشي','مقبل كرانشي خفيف يقدم ساخنًا بجانب الوجبة.'),
    ('مقبلات','بطاطس شيدر / موزاريلا','بطاطس ساخنة مع شيدر وموزاريلا.'),
    ('مقبلات','كرسبي فرايز','بطاطس كرسبي مقرمشة بصوص غني.'),
    ('مقبلات','كول سلو','سلطة كول سلو خفيفة وكريمية بجانب الوجبة.'),

    -- Known intentionally unresolved unless exact rows exist:
    ('مقبلات','صوص','صوص إضافي حسب اختيارك.'),
    ('مقبلات','ميني سالي','مقبل خفيف مناسب جنب الوجبة.')
),
matched_rows as (
  select
    p.id as product_id,
    c.name_ar as category_name_ar,
    p.name_ar as product_name_ar,
    dm.new_description_ar
  from description_map dm
  join public.menu_categories c
    on c.name_ar = dm.category_name_ar
  join public.products p
    on p.category_id = c.id
   and p.name_ar = dm.product_name_ar
),
updated_rows as (
  update public.products p
     set description_ar = mr.new_description_ar
    from matched_rows mr
   where p.id = mr.product_id
     and (
       p.description_ar is null
       or btrim(p.description_ar) = ''
       or p.description_ar = mr.category_name_ar
     )
  returning p.id
),
unmatched_map_rows as (
  select dm.category_name_ar, dm.product_name_ar
  from description_map dm
  left join matched_rows mr
    on mr.category_name_ar = dm.category_name_ar
   and mr.product_name_ar = dm.product_name_ar
  where mr.product_id is null
)
select
  (select count(*) from description_map) as map_rows_total,
  (select count(*) from matched_rows) as matched_rows_total,
  (select count(*) from updated_rows) as updated_rows_total,
  (select count(*) from unmatched_map_rows) as unmatched_rows_total;

-- Detailed unmatched report:
with description_map(category_name_ar, product_name_ar, new_description_ar) as (
  values
    ('باستا','سوسيس او برجر','x'),
    ('بيتزا توسكانيني','الباستشيو','x'),('بيتزا توسكانيني','تشيكن باربكيو','x'),('بيتزا توسكانيني','سجق كيري','x'),
    ('بيتزا لحوم','بيروني','x'),('بيتزا لحوم','سوسيس','x'),('بيتزا لحوم','مفروم','x'),
    ('ساندوتشات فرنساوي','بوم فريت','x'),('ساندوتشات فرنساوي','زينجر سوبريم','x'),('ساندوتشات فرنساوي','سوسيس ميكسكانو','x'),('ساندوتشات فرنساوي','شاورما فراخ/شيش','x'),('ساندوتشات فرنساوي','شاورما لحم','x'),('ساندوتشات فرنساوي','فاهيتا فراخ / لحم','x'),
    ('ساندوتشات كيزر','كايزر','x'),
    ('كريب توسكانيني','بيف ميجا','x'),('كريب توسكانيني','تركي بيف','x'),('كريب توسكانيني','تشيكن أوميجا','x'),('كريب توسكانيني','تشيكن باربكيو','x'),('كريب توسكانيني','سيراتشا','x'),
    ('كريب فراخ','برجر ع بانيه','x'),
    ('كريب لحوم','سوسيس','x'),('كريب لحوم','مفروم','x'),('كريب لحوم','ميكس لحوم برجر ع سوسيس','x'),
    ('كريب متنوع','مشروم','x'),
    ('مشروبات','تويست','x'),('مشروبات','فيروز','x'),
    ('مقبلات','استيك موزاريلا','x'),('مقبلات','باكت كرانشي','x'),('مقبلات','بطاطس شيدر / موزاريلا','x'),('مقبلات','كرسبي فرايز','x'),('مقبلات','كول سلو','x'),
    ('مقبلات','صوص','x'),('مقبلات','ميني سالي','x')
)
select dm.category_name_ar, dm.product_name_ar
from description_map dm
left join public.menu_categories c
  on c.name_ar = dm.category_name_ar
left join public.products p
  on p.category_id = c.id
 and p.name_ar = dm.product_name_ar
where p.id is null
order by dm.category_name_ar, dm.product_name_ar;

commit;
