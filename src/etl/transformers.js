/**
 * transforms.js
 * -------------
 * Pure transformation functions used by the ETL layer.
 *
 * Rules:
 * - No database access
 * - No file system access
 * - No side effects
 * - Input: raw CSV row (strings)
 * - Output: clean JS object matching Mongoose schema
 */

const { checkIfNumber } = require('./checkIfNumber.js');
/* =========================
   PRODUCT DATA
   ========================= */

function cleanProducts(data) {
    const rawPrice = String(data.default_price || '').trim();

    //Extract only digits (and optional decimal)
    const match = rawPrice.match(/-?\d+(\.\d+)?/)

    // if (!match) {
    //     console.log(`This is match result: ${match}`)
    //     throw new Error(`Invalid default_price: "${rawPrice}"`)
    // }

    const defaultPrice = checkIfNumber(match[0], 'Product', 'default_price', data.id);

    return {
        id: Number(data.id),
        name: data.name,
        slogan: data.slogan,
        description: data.description,
        category: data.category,
        default_price: defaultPrice,
    };
}

function cleanRelated(data) {
    return {
        id: Number(data.id),
        current_product_id: Number(data.current_product_id),
        related_product_id: Number(data.related_product_id),
    };
}

function cleanFeatures(data) {
    return {
        id: Number(data.id),
        product_id: Number(data.product_id),
        feature: data.feature === 'null' ? undefined : data.feature,
        value: data.value,
    };
}

function cleanStyles(data) {
    return {
        style_id: Number(data.id),
        product_id: Number(data.productId),
        name: data.name,
        sale_price: data.sale_price === 'null' ? undefined : data.sale_price,
        original_price: Number(data.original_price),
        default_style: data.default_style === '1',
    };
}

function cleanSKUs(data) {
    return {
        id: Number(data.id),
        style_id: Number(data.styleId),
        size: data.size,
        quantity: Number(data.quantity),
    };
}

function cleanPhotos(data) {
    return {
        id: Number(data.id),
        styleId: Number(data.styleId),
        url: data.url,
        thumbnail_url: data.thumbnail_url,
    };
}

/* =========================
   QUESTIONS & ANSWERS
   ========================= */

function cleanQuestions(data) {
    return {
        question_id: Number(data.id),
        product_id: Number(data.product_id),
        question_body: data.body,
        question_date: data.date_written,
        asker_name: data.asker_name,
        asker_email: data.asker_email,
        reported: data.reported === '1',
        question_helpfulness: Number(data.helpful),
    };
}

function cleanAnswers(data) {
    return {
        answer_id: Number(data.id),
        question_id: Number(data.question_id),
        body: data.body,
        date: data.date_written,
        answerer_name: data.answerer_name,
        answerer_email: data.answerer_email,
        reported: data.reported === '1',
        helpfulness: Number(data.helpful),
    };
}

function cleanAnswerPhotos(data) {
    return {
        id: Number(data.id),
        answer_id: Number(data.answer_id),
        url: data.url,
    };
}

/* =========================
   REVIEWS
   ========================= */

function cleanReviews(data) {
    return {
        review_id: Number(data.id),
        product_id: Number(data.product_id),
        rating: Number(data.rating),
        date: data.date,
        summary: data.summary,
        body: data.body,
        recommend: data.recommend === '1',
        reported: data.reported === '1',
        reviewer_name: data.reviewer_name,
        reviewer_email: data.reviewer_email,
        response: data.response === 'null' ? undefined : data.response,
        helpfulness: Number(data.helpfulness),
    };
}

function cleanReviewPhotos(data) {
    return {
        id: Number(data.id),
        review_id: Number(data.review_id),
        url: data.url,
    };
}

function cleanCharacteristics(data) {
    return {
        id: Number(data.id),
        product_id: Number(data.product_id),
        name: data.name,
    };
}

function cleanCharacteristicReviews(data) {
    return {
        id: Number(data.id),
        characteristic_id: Number(data.characteristic_id),
        review_id: Number(data.review_id),
        value: Number(data.value),
    };
}

/* =========================
   EXPORTS
   ========================= */

module.exports = {
    cleanProducts,
    cleanRelated,
    cleanFeatures,
    cleanStyles,
    cleanSKUs,
    cleanPhotos,
    cleanQuestions,
    cleanAnswers,
    cleanAnswerPhotos,
    cleanReviews,
    cleanReviewPhotos,
    cleanCharacteristics,
    cleanCharacteristicReviews,
};
