/**
 * Explicit real-photo manifest for Tuscanini Rebirth.
 * Photos are historically provided by the user from the confirmed restaurant Facebook page.
 * 640px originals; picture-to-specific-menu-item match is NOT verified.
 * Do not generate food substitutions or make price/ingredient promises from images.
 */
export type TuscaniniFoodMedia = {
  id: string;
  path: string;
  sourceFile: string;
  altAr: string;
  roles: readonly string[];
  verifiedProductId: null;
  width: 640;
  height: 640;
};
export const tuscaniniFoodMedia: readonly TuscaniniFoodMedia[] = [
  { id: 'TSC-01', path: '/images/rebirth/food-01.webp', sourceFile: '782208451_122125102508813154_3012964228322686674_n.jpg', altAr: 'مجموعة كريبات محشوة أمام شعار مطعم توسكانيني', roles: ['brand-context','hero-candidate'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-02', path: '/images/rebirth/food-02.webp', sourceFile: '807858902_122127740210813154_7264629719392698387_n.jpg', altAr: 'قطاع في كريب محشو يحمله موظف من المطعم', roles: ['cross-section'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-03', path: '/images/rebirth/food-03.webp', sourceFile: '784197571_122125571198813154_1637167208819104149_n.jpg', altAr: 'بيتزا داخل صندوق مطبوع بعلامة توسكانيني', roles: ['pizza','packaging'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-04', path: '/images/rebirth/food-04.webp', sourceFile: '812535501_122128267022813154_6789820019884523052_n.jpg', altAr: 'كريب مفتوح بحشوات ظاهرة على يد موظف', roles: ['cross-section','editorial-detail'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-05', path: '/images/rebirth/food-05.webp', sourceFile: '808441146_122129677868813154_6728074287811253701_n.jpg', altAr: 'مجموعة كريبات مختلفة بحشوات ظاهرة', roles: ['variety'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-06', path: '/images/rebirth/food-06.webp', sourceFile: '825328265_122130038708813154_1462278202442388874_n.jpg', altAr: 'شخص يعرض مجموعة كريبات محشوة في المطعم', roles: ['human-scale','variety'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-07', path: '/images/rebirth/food-07.webp', sourceFile: '825286535_122131450682813154_8860430949979013186_n.jpg', altAr: 'ثلاثة كريبات متراصة تظهر الطبقات والحشوات', roles: ['inside-out','editorial-detail'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-08', path: '/images/rebirth/food-08.webp', sourceFile: '833873500_122131785872813154_7378712455740153250_n.jpg', altAr: 'ساندوتشات بجانب عبوات توسكانيني الحمراء', roles: ['sandwich','packaging'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-09', path: '/images/rebirth/food-09.webp', sourceFile: '839651250_122132141966813154_3935688610852167747_n.jpg', altAr: 'لقطة قريبة لثلاثة كريبات بحشوات مختلفة', roles: ['editorial-hero','variety'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-10', path: '/images/rebirth/food-10.webp', sourceFile: '841229327_122132807210813154_8422595721934789532_n.jpg', altAr: 'بيتزا توسكانيني مصورة من أعلى', roles: ['pizza'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-11', path: '/images/rebirth/food-11.webp', sourceFile: '849075737_122133129620813154_7687456626755428731_n.jpg', altAr: 'وجبة محملة بصوص أصفر وعبوات الطعام من حولها', roles: ['other-food','sauces'], verifiedProductId: null, width:640, height:640 },
  { id: 'TSC-12', path: '/images/rebirth/food-12.webp', sourceFile: '853153311_122133477818813154_2342043302948759856_n.jpg', altAr: 'مجموعة كريبات مفتوحة ممسوكة بالقفازات', roles: ['abundance','crepe'], verifiedProductId: null, width:640, height:640 },
] as const;
