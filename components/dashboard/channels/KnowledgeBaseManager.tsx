import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HiPlus, HiOutlineDocumentText, HiOutlineCog } from 'react-icons/hi';

interface KnowledgeBase {
  id: string;
  name: string;
  contextLimit: number;
  maxRagResults: number;
  confidenceScore: number;
}

interface Props {
  channelId: string;
}

export default function KnowledgeBaseManager({ channelId }: Props) {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newKnowledgeBase, setNewKnowledgeBase] = useState<KnowledgeBase>({
    id: '',
    name: '',
    contextLimit: 1000,
    maxRagResults: 3,
    confidenceScore: 0.7,
  });

  useEffect(() => {
    // Fetch knowledge base data for the channel
    // This is a placeholder, replace with actual data fetching logic
    // setKnowledgeBase(fetchedKnowledgeBase);
  }, [channelId]);

  const openWizard = () => {
    setIsWizardOpen(true);
    setWizardStep(1);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setNewKnowledgeBase({
      id: '',
      name: '',
      contextLimit: 1000,
      maxRagResults: 3,
      confidenceScore: 0.7,
    });
  };

  const handleNextStep = () => {
    setWizardStep(wizardStep + 1);
  };

  const handlePreviousStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleCreateKnowledgeBase = () => {
    // Add logic to create the knowledge base
    setKnowledgeBase(newKnowledgeBase);
    closeWizard();
  };

  return (
    <div>
      {knowledgeBase ? (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <HiOutlineDocumentText className="mr-2 h-5 w-5 text-zinc-500" />
              <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.name}</h4>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsWizardOpen(true)}>
              <HiOutlineCog className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              <p>Context Limit</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.contextLimit} tokens</p>
            </div>
            <div>
              <p>Max RAG Results</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.maxRagResults}</p>
            </div>
            <div>
              <p>Confidence Score</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{knowledgeBase.confidenceScore}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-8">
          <HiOutlineDocumentText className="mx-auto h-12 w-12 text-zinc-400" />
          <h4 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Knowledge Base</h4>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Add a knowledge base to enhance your AI's responses</p>
          <Button className="mt-4" onClick={openWizard}>
            <HiPlus className="mr-2 h-4 w-4" />
            Add Knowledge Base
          </Button>
        </div>
      )}

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-100">{knowledgeBase ? 'Configure Knowledge Base' : 'Add Knowledge Base'}</DialogTitle>
          </DialogHeader>
          {wizardStep === 1 && (
            <div>
              <label htmlFor="kbName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Knowledge Base Name</label>
              <Input
                id="kbName"
                value={newKnowledgeBase.name}
                onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, name: e.target.value})}
                className="mt-1 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="contextLimit" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Context Limit (tokens)</label>
                <Input
                  id="contextLimit"
                  type="number"
                  value={newKnowledgeBase.contextLimit}
                  onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, contextLimit: parseInt(e.target.value)})}
                  className="mt-1 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="maxRagResults" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Max RAG Results</label>
                <Input
                  id="maxRagResults"
                  type="number"
                  value={newKnowledgeBase.maxRagResults}
                  onChange={(e) => setNewKnowledgeBase({...newKnowledgeBase, maxRagResults: parseInt(e.target.value)})}
                  className="mt-1 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="confidenceScore" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confidence Score</label>
                <Slider
                  id="confidenceScore"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[newKnowledgeBase.confidenceScore]}
                  onValueChange={(value) => setNewKnowledgeBase({...newKnowledgeBase, confidenceScore: value[0]})}
                  className="mt-1"
                />
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{newKnowledgeBase.confidenceScore.toFixed(2)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {wizardStep > 1 && (
              <Button variant="outline" onClick={handlePreviousStep}>Back</Button>
            )}
            {wizardStep < 2 ? (
              <Button onClick={handleNextStep}>Next</Button>
            ) : (
              <Button onClick={handleCreateKnowledgeBase}>{knowledgeBase ? 'Update' : 'Create'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
