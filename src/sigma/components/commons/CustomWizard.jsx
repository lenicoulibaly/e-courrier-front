import React, {forwardRef, useImperativeHandle, useState} from 'react';

// material-ui
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports

import AnimateButton from 'ui-component/extended/AnimateButton';

// ==============================|| FORMS WIZARD - BASIC ||============================== //

const CustumWizard = forwardRef(({steps = []}, ref) =>
{
    useImperativeHandle(ref, () => ({
        resetWizard: () => setActiveIndex(0),
        goToStep: (index) => {
            if (index >= 0 && index < steps.length) {
                setActiveIndex(index);
            }
        },
    }));

    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prevIndex) => prevIndex + 1);
    };

    const handleBack = () => {
        setActiveIndex((prevIndex) => prevIndex - 1);
    };
     const activeStep = steps[activeIndex];
    return (
        < >
            <Stepper activeStep={activeIndex} sx={{ pt: 3, pb: 5 }}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeIndex === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                            Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your
                            order has shipped.
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            <AnimateButton>
                                <Button variant="contained" color="error" onClick={() => setActiveStep(0)} sx={{ my: 3, ml: 1 }}>
                                    Reset
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </>
                ) : (
                    <>
                        {activeStep.component}
                        <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>

                                <Button onClick={handleBack} sx={{ my: 3, ml: 1 }} disabled={activeIndex === 0}>
                                    Revenir
                                </Button>

                            <AnimateButton>
                                <Button disabled={activeIndex === (steps.length - 1) || activeStep.nextDisabled} variant="contained" onClick={handleNext} sx={{my: 3, ml: 1}}>
                                    {'Suivant'}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </>
                )}
            </>
        </>
    );
});

export default CustumWizard;
