import { Trans } from "@lingui/macro";
import styled from "styled-components/macro";
import { ReactComponent as Close } from "../../assets/images/x.svg";
import { ButtonSecondary } from "../Button";
import Modal from "../Modal";
import { AutoRow } from "components/Row";

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) =>
    props.color === "blue" ? ({ theme }) => theme.primary1 : "inherit"};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`;

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`;

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`;


const ContentSection = styled.div`
  padding: 0rem 1rem;
  ${({ theme }) =>
    theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`;

const Content = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`;


const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`;

interface ChatModalProps {
  onClickOk: () => void;
  isOpen: boolean;
  InfoHtml: any;
  showModal: any;
  title: string;
}

export default function ChatModal({
  onClickOk,
  showModal,
  isOpen,
  InfoHtml,
  title
}: ChatModalProps) {


  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => { showModal(false) }}
      minHeight={false}
      maxHeight={90}
    >
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={() => { showModal(false) }}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            <Trans>{title}</Trans>
          </HeaderRow>
          <ContentSection>
            <Content>
              <InfoCard>
                {InfoHtml}
                <AutoRow justify="center" style={{marginTop: "10px"}}>
                  <ButtonSecondary
                    onClick={() => { onClickOk() }}
                    style={{
                      height: "30px",
                      width: "100px",
                      marginRight: "20px",
                    }}
                  >
                    OK
                  </ButtonSecondary>
                  <ButtonSecondary
                    onClick={() => { showModal(false) }}
                    style={{ height: "30px", width: "100px" }}
                  >
                    Cancel
                  </ButtonSecondary>
                </AutoRow>
              </InfoCard>
            </Content>
          </ContentSection>
        </UpperSection>
      </Wrapper>
    </Modal>
  );
}
