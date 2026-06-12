import React from 'react';
import PropTypes from 'prop-types';
import { AccordionSection } from './Section';
import { Code } from './Code';
import DecoderEncoderView from '../DecoderEncoderView';

export default function DataAccordionSection({ title, actualSignedData, value }) {
    return (
        <AccordionSection title={title}>
            <DecoderEncoderView input={value} actualSignedData={actualSignedData} />
        </AccordionSection>
    );
}

DataAccordionSection.propTypes = {
    title: PropTypes.string.isRequired,
    actualSignedData: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array,
    ]).isRequired,
};
